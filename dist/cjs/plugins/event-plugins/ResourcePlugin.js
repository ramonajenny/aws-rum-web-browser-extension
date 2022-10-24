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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcePlugin = exports.defaultConfig = exports.RESOURCE_EVENT_PLUGIN_ID = void 0;
var InternalPlugin_1 = require("../InternalPlugin");
var common_utils_1 = require("../../utils/common-utils");
var constant_1 = require("../utils/constant");
exports.RESOURCE_EVENT_PLUGIN_ID = 'resource';
var RESOURCE = 'resource';
var LOAD = 'load';
exports.defaultConfig = {
    eventLimit: 10,
    recordAllTypes: [common_utils_1.ResourceType.DOCUMENT, common_utils_1.ResourceType.SCRIPT],
    sampleTypes: [
        common_utils_1.ResourceType.STYLESHEET,
        common_utils_1.ResourceType.IMAGE,
        common_utils_1.ResourceType.FONT,
        common_utils_1.ResourceType.OTHER
    ]
};
/**
 * This plugin records resource performance timing events generated during every page load/re-load.
 */
var ResourcePlugin = /** @class */ (function (_super) {
    __extends(ResourcePlugin, _super);
    function ResourcePlugin(config) {
        var _this = _super.call(this, exports.RESOURCE_EVENT_PLUGIN_ID) || this;
        _this.resourceEventListener = function (event) {
            var recordAll = [];
            var sample = [];
            var eventCount = 0;
            var resourceObserver = new PerformanceObserver(function (list) {
                list.getEntries()
                    .filter(function (e) { return e.entryType === RESOURCE; })
                    .forEach(function (event) {
                    // Out of n resource events, x events are recorded using Observer API
                    var type = (0, common_utils_1.getResourceFileType)(event.name);
                    if (_this.config.recordAllTypes.includes(type)) {
                        recordAll.push(event);
                    }
                    else if (_this.config.sampleTypes.includes(type)) {
                        sample.push(event);
                    }
                });
            });
            resourceObserver.observe({
                entryTypes: [RESOURCE]
            });
            // Remaining (n-x) resource events are recorded using getEntriesByType API.
            // Note: IE11 browser does not support Performance Observer API. Handle the failure gracefully
            var events = performance.getEntriesByType(RESOURCE);
            if (events !== undefined && events.length > 0) {
                events.forEach(function (event) {
                    var type = (0, common_utils_1.getResourceFileType)(event.name);
                    if (_this.config.recordAllTypes.includes(type)) {
                        recordAll.push(event);
                    }
                    else if (_this.config.sampleTypes.includes(type)) {
                        sample.push(event);
                    }
                });
            }
            // Record events for resources in recordAllTypes
            (0, common_utils_1.shuffle)(recordAll);
            while (recordAll.length > 0 && eventCount < _this.config.eventLimit) {
                _this.recordResourceEvent(recordAll.pop());
                eventCount++;
            }
            // Record events sampled from resources in sample
            (0, common_utils_1.shuffle)(sample);
            while (sample.length > 0 && eventCount < _this.config.eventLimit) {
                _this.recordResourceEvent(sample.pop());
                eventCount++;
            }
        };
        _this.recordResourceEvent = function (entryData) {
            var _a;
            // Ignore monitoring beacons.
            if (new URL(entryData.name).host ===
                _this.context.config.endpointUrl.host) {
                return;
            }
            if ((_a = _this.context) === null || _a === void 0 ? void 0 : _a.record) {
                var eventData = {
                    version: '1.0.0',
                    initiatorType: entryData.initiatorType,
                    duration: entryData.duration,
                    fileType: (0, common_utils_1.getResourceFileType)(entryData.name),
                    transferSize: entryData.transferSize
                };
                if (_this.context.config.recordResourceUrl) {
                    eventData.targetUrl = entryData.name;
                }
                _this.context.record(constant_1.PERFORMANCE_RESOURCE_EVENT_TYPE, eventData);
            }
        };
        _this.config = __assign(__assign({}, exports.defaultConfig), config);
        return _this;
    }
    ResourcePlugin.prototype.enable = function () {
        if (this.enabled) {
            return;
        }
        this.enabled = true;
        window.addEventListener(LOAD, this.resourceEventListener);
    };
    ResourcePlugin.prototype.disable = function () {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;
        if (this.resourceEventListener) {
            window.removeEventListener(LOAD, this.resourceEventListener);
        }
    };
    ResourcePlugin.prototype.onload = function () {
        window.addEventListener(LOAD, this.resourceEventListener);
    };
    return ResourcePlugin;
}(InternalPlugin_1.InternalPlugin));
exports.ResourcePlugin = ResourcePlugin;
