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
exports.XhrPlugin = exports.XHR_PLUGIN_ID = void 0;
var MonkeyPatched_1 = require("../MonkeyPatched");
var http_utils_1 = require("../utils/http-utils");
var XhrError_1 = require("../../errors/XhrError");
var constant_1 = require("../utils/constant");
var js_error_utils_1 = require("../utils/js-error-utils");
exports.XHR_PLUGIN_ID = 'xhr';
/**
 * A plugin which initiates and records AWS X-Ray traces for XML HTTP requests (XMLHttpRequest).
 *
 * The XMLHttpRequest API is monkey patched using shimmer so all calls to XMLHttpRequest are intercepted. Only calls
 * to URLs which are on the allowlist and are not on the denylist are traced and recorded.
 *
 * The XHR events we use (i.e., onload, onerror, onabort, ontimeout) are only
 * supported by newer browsers. If we want to support older browsers we will
 * need to detect older browsers and use the onreadystatechange event.
 *
 * For example, the following sequence events occur for each case:
 *
 * Case 1: Request succeeds events
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 2, status = 200)
 * readystatechange (state = 3, status = 200)
 * readystatechange (state = 4, status = 200)
 * load
 * loadend
 *
 * Case 2: Request fails because of invalid domain or CORS failure
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 4, status = 0)
 * error
 * loadend
 *
 * Case 3: Request fails because of timeout
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 4, status = 0)
 * timeout
 * loadend
 *
 * Case 4: Request is aborted
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 2, status = 200)
 * readystatechange (state = 3, status = 200)
 * readystatechange (state = 4, status = 0)
 * abort
 * loadend
 *
 * See
 * - https://xhr.spec.whatwg.org/#event-handlers.
 * - https://xhr.spec.whatwg.org/#events
 */
var XhrPlugin = /** @class */ (function (_super) {
    __extends(XhrPlugin, _super);
    function XhrPlugin(config) {
        var _this = _super.call(this, exports.XHR_PLUGIN_ID) || this;
        _this.addXRayTraceIdHeader = function () {
            return _this.config.addXRayTraceIdHeader;
        };
        _this.isTracingEnabled = function () {
            return _this.context.config.enableXRay;
        };
        _this.isSessionRecorded = function () {
            var _a;
            return ((_a = _this.context.getSession()) === null || _a === void 0 ? void 0 : _a.record) || false;
        };
        _this.handleXhrLoadEvent = function (e) {
            var xhr = e.target;
            var xhrDetails = _this.xhrMap.get(xhr);
            if (xhrDetails) {
                var endTimee = (0, http_utils_1.epochTime)();
                xhrDetails.trace.end_time = endTimee;
                xhrDetails.trace.subsegments[0].end_time = endTimee;
                xhrDetails.trace.subsegments[0].http.response = {
                    status: xhr.status
                };
                if ((0, http_utils_1.is429)(xhr.status)) {
                    xhrDetails.trace.subsegments[0].throttle = true;
                    xhrDetails.trace.throttle = true;
                }
                else if ((0, http_utils_1.is4xx)(xhr.status)) {
                    xhrDetails.trace.subsegments[0].error = true;
                    xhrDetails.trace.error = true;
                }
                else if ((0, http_utils_1.is5xx)(xhr.status)) {
                    xhrDetails.trace.subsegments[0].fault = true;
                    xhrDetails.trace.fault = true;
                }
                var clStr = xhr.getResponseHeader('Content-Length');
                var cl = clStr ? parseInt(clStr, 10) : NaN;
                if (!isNaN(cl)) {
                    xhrDetails.trace.subsegments[0].http.response.content_length = cl;
                }
                _this.recordTraceEvent(xhrDetails.trace);
                _this.recordHttpEventWithResponse(xhrDetails, xhr);
            }
        };
        _this.handleXhrErrorEvent = function (e) {
            var xhr = e.target;
            var xhrDetails = _this.xhrMap.get(xhr);
            var errorName = 'XMLHttpRequest error';
            var errorMessage = xhr.statusText
                ? xhr.status.toString() + ': ' + xhr.statusText
                : xhr.status.toString();
            if (xhrDetails) {
                var endTime = (0, http_utils_1.epochTime)();
                // Guidance from X-Ray documentation:
                // > Record errors in segments when your application returns an
                // > error to the user, and in subsegments when a downstream call
                // > returns an error.
                xhrDetails.trace.fault = true;
                xhrDetails.trace.end_time = endTime;
                xhrDetails.trace.subsegments[0].end_time = endTime;
                xhrDetails.trace.subsegments[0].fault = true;
                xhrDetails.trace.subsegments[0].cause = {
                    exceptions: [
                        {
                            type: errorName,
                            message: errorMessage
                        }
                    ]
                };
                _this.recordTraceEvent(xhrDetails.trace);
                _this.recordHttpEventWithError(xhrDetails, new XhrError_1.XhrError(errorMessage));
            }
        };
        _this.handleXhrAbortEvent = function (e) {
            var xhr = e.target;
            var xhrDetails = _this.xhrMap.get(xhr);
            var errorName = 'XMLHttpRequest abort';
            _this.handleXhrDetailsOnError(xhrDetails, errorName);
        };
        _this.handleXhrTimeoutEvent = function (e) {
            var xhr = e.target;
            var xhrDetails = _this.xhrMap.get(xhr);
            var errorName = 'XMLHttpRequest timeout';
            _this.handleXhrDetailsOnError(xhrDetails, errorName);
        };
        _this.initializeTrace = function (xhrDetails) {
            var startTime = (0, http_utils_1.epochTime)();
            xhrDetails.trace = (0, http_utils_1.createXRayTraceEvent)(_this.config.logicalServiceName, startTime);
            xhrDetails.trace.subsegments.push((0, http_utils_1.createXRaySubsegment)((0, http_utils_1.requestInfoToHostname)(xhrDetails.url), startTime, {
                request: {
                    method: xhrDetails.method,
                    url: xhrDetails.url,
                    traced: true
                }
            }));
        };
        _this.sendWrapper = function () {
            var self = _this;
            return function (original) {
                return function () {
                    var xhrDetails = self.xhrMap.get(this);
                    if (xhrDetails) {
                        this.addEventListener('load', self.handleXhrLoadEvent);
                        this.addEventListener('error', self.handleXhrErrorEvent);
                        this.addEventListener('abort', self.handleXhrAbortEvent);
                        this.addEventListener('timeout', self.handleXhrTimeoutEvent);
                        self.initializeTrace(xhrDetails);
                        if (self.isTracingEnabled() &&
                            self.addXRayTraceIdHeader() &&
                            self.isSessionRecorded()) {
                            this.setRequestHeader(http_utils_1.X_AMZN_TRACE_ID, (0, http_utils_1.getAmznTraceIdHeaderValue)(xhrDetails.trace.trace_id, xhrDetails.trace.subsegments[0].id));
                        }
                    }
                    return original.apply(this, arguments);
                };
            };
        };
        _this.openWrapper = function () {
            var self = _this;
            return function (original) {
                return function (method, url, async) {
                    if ((0, http_utils_1.isUrlAllowed)(url, self.config)) {
                        self.xhrMap.set(this, { url: url, method: method, async: async });
                    }
                    return original.apply(this, arguments);
                };
            };
        };
        _this.config = __assign(__assign({}, http_utils_1.defaultConfig), config);
        _this.xhrMap = new Map();
        return _this;
    }
    XhrPlugin.prototype.onload = function () {
        this.enable();
    };
    Object.defineProperty(XhrPlugin.prototype, "patches", {
        get: function () {
            return [
                {
                    nodule: XMLHttpRequest.prototype,
                    name: 'send',
                    wrapper: this.sendWrapper
                },
                {
                    nodule: XMLHttpRequest.prototype,
                    name: 'open',
                    wrapper: this.openWrapper
                }
            ];
        },
        enumerable: false,
        configurable: true
    });
    XhrPlugin.prototype.handleXhrDetailsOnError = function (xhrDetails, errorName) {
        if (xhrDetails) {
            var endTime = (0, http_utils_1.epochTime)();
            xhrDetails.trace.end_time = endTime;
            xhrDetails.trace.subsegments[0].end_time = endTime;
            xhrDetails.trace.subsegments[0].error = true;
            xhrDetails.trace.subsegments[0].cause = {
                exceptions: [
                    {
                        type: errorName
                    }
                ]
            };
            this.recordTraceEvent(xhrDetails.trace);
            this.recordHttpEventWithError(xhrDetails, errorName);
        }
    };
    XhrPlugin.prototype.statusOk = function (status) {
        return status >= 200 && status < 300;
    };
    XhrPlugin.prototype.recordHttpEventWithResponse = function (xhrDetails, xhr) {
        if (this.config.recordAllRequests || !this.statusOk(xhr.status)) {
            this.context.record(constant_1.HTTP_EVENT_TYPE, {
                version: '1.0.0',
                request: { method: xhrDetails.method, url: xhrDetails.url },
                response: { status: xhr.status, statusText: xhr.statusText }
            });
        }
    };
    XhrPlugin.prototype.recordHttpEventWithError = function (xhrDetails, error) {
        var httpEvent = {
            version: '1.0.0',
            request: { method: xhrDetails.method, url: xhrDetails.url }
        };
        httpEvent.error = (0, js_error_utils_1.errorEventToJsErrorEvent)({
            type: 'error',
            error: error
        }, this.config.stackTraceLength);
        this.context.record(constant_1.HTTP_EVENT_TYPE, httpEvent);
    };
    XhrPlugin.prototype.recordTraceEvent = function (trace) {
        if (this.isTracingEnabled() && this.isSessionRecorded()) {
            this.context.record(constant_1.XRAY_TRACE_EVENT_TYPE, trace);
        }
    };
    return XhrPlugin;
}(MonkeyPatched_1.MonkeyPatched));
exports.XhrPlugin = XhrPlugin;
