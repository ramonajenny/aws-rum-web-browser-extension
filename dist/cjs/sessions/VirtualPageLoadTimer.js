"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualPageLoadTimer = void 0;
var constant_1 = require("../plugins/utils/constant");
var MonkeyPatched_1 = require("../plugins/MonkeyPatched");
/**
 * Maintains the core logic for virtual page load timing functionality.
 * (1) Holds all virtual page load timing related resources
 * (2) Intercepts outgoing XMLHttpRequests and Fetch requests and listens for DOM changes
 * (3) Records virtual page load
 */
var VirtualPageLoadTimer = /** @class */ (function (_super) {
    __extends(VirtualPageLoadTimer, _super);
    function VirtualPageLoadTimer(pageManager, config, record) {
        var _this = _super.call(this, 'virtual-page-load-timer') || this;
        _this.sendWrapper = function () {
            var self = _this;
            return function (original) {
                return function () {
                    self.recordXhr(this);
                    this.addEventListener('loadend', self.endTracking);
                    return original.apply(this, arguments);
                };
            };
        };
        /**
         * Removes the current event from either requestBuffer or ongoingRequests set.
         *
         * @param event
         */
        _this.endTracking = function (e) {
            var currTime = Date.now();
            var xhr = e.target;
            xhr.removeEventListener('loadend', _this.endTracking);
            _this.removeXhr(xhr, currTime);
        };
        _this.fetch = function (original, thisArg, argsArray) {
            return original
                .apply(thisArg, argsArray)
                .catch(function (error) {
                throw error;
            })
                .finally(_this.decrementFetchCounter);
        };
        /**
         * Increment the fetch counter in PageManager when fetch is beginning
         */
        _this.fetchWrapper = function () {
            var self = _this;
            return function (original) {
                return function (input, init) {
                    self.fetchCounter += 1;
                    return self.fetch(original, this, arguments);
                };
            };
        };
        _this.decrementFetchCounter = function () {
            if (!_this.isPageLoaded) {
                _this.latestEndTime = Date.now();
            }
            _this.fetchCounter -= 1;
        };
        /**
         * Checks whether the virtual page is still being loaded.
         * If completed:
         * (1) Clear the timers
         * (2) Record data using NavigationEvent
         * (3) Indicate current page has finished loading
         */
        _this.checkLoadStatus = function () {
            if (_this.ongoingRequests.size === 0 && _this.fetchCounter === 0) {
                clearInterval(_this.periodicCheckerId);
                clearTimeout(_this.timeoutCheckerId);
                _this.domMutationObserver.disconnect();
                _this.recordRouteChangeNavigationEvent(_this.pageManager.getPage());
                _this.periodicCheckerId = undefined;
                _this.timeoutCheckerId = undefined;
                _this.isPageLoaded = true;
            }
        };
        /** Clears timers and disconnects observer to stop page timing. */
        _this.declareTimeout = function () {
            clearInterval(_this.periodicCheckerId);
            _this.periodicCheckerId = undefined;
            _this.timeoutCheckerId = undefined;
            _this.domMutationObserver.disconnect();
            _this.isPageLoaded = true;
        };
        _this.resetInterval = function () {
            _this.latestEndTime = Date.now();
            clearInterval(_this.periodicCheckerId);
            _this.periodicCheckerId = setInterval(_this.checkLoadStatus, _this.config.routeChangeComplete);
        };
        _this.moveItemsFromBuffer = function (item) {
            _this.ongoingRequests.add(item);
        };
        _this.updateLatestInteractionTime = function (e) {
            _this.latestInteractionTime = Date.now();
        };
        _this.periodicCheckerId = undefined;
        _this.timeoutCheckerId = undefined;
        _this.domMutationObserver = new MutationObserver(_this.resetInterval);
        _this.ongoingRequests = new Set();
        _this.requestBuffer = new Set();
        _this.fetchCounter = 0;
        _this.isPageLoaded = true;
        _this.latestEndTime = 0;
        _this.latestInteractionTime = 0;
        _this.config = config;
        _this.pageManager = pageManager;
        _this.record = record;
        _this.enable();
        // Start tracking the timestamps
        document.addEventListener('mousedown', _this.updateLatestInteractionTime);
        document.addEventListener('keydown', _this.updateLatestInteractionTime);
        return _this;
    }
    Object.defineProperty(VirtualPageLoadTimer.prototype, "patches", {
        get: function () {
            return [
                {
                    nodule: XMLHttpRequest.prototype,
                    name: 'send',
                    wrapper: this.sendWrapper
                },
                {
                    nodule: window,
                    name: 'fetch',
                    wrapper: this.fetchWrapper
                }
            ];
        },
        enumerable: false,
        configurable: true
    });
    /** Initializes timing related resources for current page. */
    VirtualPageLoadTimer.prototype.startTiming = function () {
        this.latestEndTime = Date.now();
        // Clean up existing timer objects and mutationObserver
        if (this.periodicCheckerId) {
            clearInterval(this.periodicCheckerId);
        }
        if (this.timeoutCheckerId) {
            clearTimeout(this.timeoutCheckerId);
        }
        this.domMutationObserver.disconnect();
        // Initialize timer objects and start observing
        this.periodicCheckerId = setInterval(this.checkLoadStatus, this.config.routeChangeComplete);
        this.timeoutCheckerId = setTimeout(this.declareTimeout, this.config.routeChangeTimeout);
        // observing the add/delete of nodes
        this.domMutationObserver.observe(document, {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: false
        });
        // Indicate page has not loaded, and carry over buffered requests.
        this.isPageLoaded = false;
        this.requestBuffer.forEach(this.moveItemsFromBuffer);
        this.requestBuffer.clear();
    };
    VirtualPageLoadTimer.prototype.recordXhr = function (item) {
        var page = this.pageManager.getPage();
        if (page && this.isPageLoaded === false) {
            this.ongoingRequests.add(item);
        }
        else {
            this.requestBuffer.add(item);
        }
    };
    VirtualPageLoadTimer.prototype.removeXhr = function (item, currTime) {
        var page = this.pageManager.getPage();
        if (page && this.ongoingRequests.has(item)) {
            this.ongoingRequests.delete(item);
            this.latestEndTime = currTime;
        }
        else if (this.requestBuffer.has(item)) {
            this.requestBuffer.delete(item);
        }
    };
    VirtualPageLoadTimer.prototype.recordRouteChangeNavigationEvent = function (page) {
        var virtualPageNavigationEvent = {
            version: '1.0.0',
            initiatorType: 'route_change',
            navigationType: 'navigate',
            startTime: page.start,
            duration: this.latestEndTime - page.start
        };
        if (this.record) {
            this.record(constant_1.PERFORMANCE_NAVIGATION_EVENT_TYPE, virtualPageNavigationEvent);
        }
    };
    return VirtualPageLoadTimer;
}(MonkeyPatched_1.MonkeyPatched));
exports.VirtualPageLoadTimer = VirtualPageLoadTimer;
