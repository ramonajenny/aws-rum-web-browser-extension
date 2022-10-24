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
import { MonkeyPatched } from '../MonkeyPatched';
import { defaultConfig, epochTime, createXRayTraceEvent, addAmznTraceIdHeaderToInit, createXRayTraceEventHttp, isUrlAllowed, createXRaySubsegment, requestInfoToHostname, addAmznTraceIdHeaderToHeaders, resourceToUrlString, is429, is4xx, is5xx } from '../utils/http-utils';
import { HTTP_EVENT_TYPE, XRAY_TRACE_EVENT_TYPE } from '../utils/constant';
import { errorEventToJsErrorEvent, isErrorPrimitive } from '../utils/js-error-utils';
export var FETCH_PLUGIN_ID = 'fetch';
/**
 * A plugin which initiates and records AWS X-Ray traces for fetch HTTP requests.
 *
 * The fetch API is monkey patched using shimmer so all calls to fetch are intercepted. Only calls to URLs which are
 * on the allowlist and are not on the denylist are traced and recorded.
 */
var FetchPlugin = /** @class */ (function (_super) {
    __extends(FetchPlugin, _super);
    function FetchPlugin(config) {
        var _this = _super.call(this, FETCH_PLUGIN_ID) || this;
        _this.isTracingEnabled = function () {
            return _this.context.config.enableXRay;
        };
        _this.isSessionRecorded = function () {
            var _a;
            return ((_a = _this.context.getSession()) === null || _a === void 0 ? void 0 : _a.record) || false;
        };
        _this.beginTrace = function (input, init, argsArray) {
            var startTime = epochTime();
            var http = createXRayTraceEventHttp(input, init, true);
            var xRayTraceEvent = createXRayTraceEvent(_this.config.logicalServiceName, startTime);
            var subsegment = createXRaySubsegment(requestInfoToHostname(input), startTime, http);
            xRayTraceEvent.subsegments.push(subsegment);
            if (_this.config.addXRayTraceIdHeader) {
                _this.addXRayTraceIdHeader(input, init, argsArray, xRayTraceEvent);
            }
            return xRayTraceEvent;
        };
        _this.addXRayTraceIdHeader = function (input, init, argsArray, xRayTraceEvent) {
            if (input.headers) {
                return addAmznTraceIdHeaderToHeaders(input.headers, xRayTraceEvent.trace_id, xRayTraceEvent.subsegments[0].id);
            }
            if (!init) {
                init = {};
                [].push.call(argsArray, init);
            }
            addAmznTraceIdHeaderToInit(init, xRayTraceEvent.trace_id, xRayTraceEvent.subsegments[0].id);
        };
        _this.endTrace = function (xRayTraceEvent, response, error) {
            if (xRayTraceEvent) {
                var endTime = epochTime();
                xRayTraceEvent.subsegments[0].end_time = endTime;
                xRayTraceEvent.end_time = endTime;
                if (response) {
                    xRayTraceEvent.subsegments[0].http.response = {
                        status: response.status
                    };
                    if (is429(response.status)) {
                        xRayTraceEvent.subsegments[0].throttle = true;
                        xRayTraceEvent.throttle = true;
                    }
                    else if (is4xx(response.status)) {
                        xRayTraceEvent.subsegments[0].error = true;
                        xRayTraceEvent.error = true;
                    }
                    else if (is5xx(response.status)) {
                        xRayTraceEvent.subsegments[0].fault = true;
                        xRayTraceEvent.fault = true;
                    }
                    var clStr = response.headers.get('Content-Length');
                    var cl = clStr ? parseInt(clStr, 10) : NaN;
                    if (!isNaN(cl)) {
                        xRayTraceEvent.subsegments[0].http.response.content_length = cl;
                    }
                }
                if (error) {
                    // Guidance from X-Ray documentation:
                    // > Record errors in segments when your application returns an
                    // > error to the user, and in subsegments when a downstream call
                    // > returns an error.
                    xRayTraceEvent.fault = true;
                    xRayTraceEvent.subsegments[0].fault = true;
                    if (error instanceof Object) {
                        _this.appendErrorCauseFromObject(xRayTraceEvent.subsegments[0], error);
                    }
                    else if (isErrorPrimitive(error)) {
                        _this.appendErrorCauseFromPrimitive(xRayTraceEvent.subsegments[0], error.toString());
                    }
                }
                _this.context.record(XRAY_TRACE_EVENT_TYPE, xRayTraceEvent);
            }
        };
        _this.createHttpEvent = function (input, init) {
            return {
                version: '1.0.0',
                request: {
                    url: resourceToUrlString(input),
                    method: (init === null || init === void 0 ? void 0 : init.method) ? init.method : 'GET'
                }
            };
        };
        _this.recordHttpEventWithResponse = function (httpEvent, response) {
            if (_this.config.recordAllRequests || !response.ok) {
                httpEvent.response = {
                    status: response.status,
                    statusText: response.statusText
                };
                _this.context.record(HTTP_EVENT_TYPE, httpEvent);
            }
        };
        _this.recordHttpEventWithError = function (httpEvent, error) {
            httpEvent.error = errorEventToJsErrorEvent({
                type: 'error',
                error: error
            }, _this.config.stackTraceLength);
            _this.context.record(HTTP_EVENT_TYPE, httpEvent);
        };
        _this.fetch = function (original, thisArg, argsArray, input, init) {
            var httpEvent = _this.createHttpEvent(input, init);
            var trace;
            if (!isUrlAllowed(resourceToUrlString(input), _this.config)) {
                return original.apply(thisArg, argsArray);
            }
            if (_this.isTracingEnabled() && _this.isSessionRecorded()) {
                trace = _this.beginTrace(input, init, argsArray);
            }
            return original
                .apply(thisArg, argsArray)
                .then(function (response) {
                _this.endTrace(trace, response, undefined);
                _this.recordHttpEventWithResponse(httpEvent, response);
                return response;
            })
                .catch(function (error) {
                _this.endTrace(trace, undefined, error);
                _this.recordHttpEventWithError(httpEvent, error);
                throw error;
            });
        };
        _this.fetchWrapper = function () {
            var self = _this;
            return function (original) {
                return function (input, init) {
                    return self.fetch(original, this, arguments, input, init);
                };
            };
        };
        _this.config = __assign(__assign({}, defaultConfig), config);
        return _this;
    }
    Object.defineProperty(FetchPlugin.prototype, "patches", {
        get: function () {
            return [
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
    FetchPlugin.prototype.onload = function () {
        this.enable();
    };
    FetchPlugin.prototype.appendErrorCauseFromPrimitive = function (subsegment, error) {
        subsegment.cause = {
            exceptions: [
                {
                    type: error
                }
            ]
        };
    };
    FetchPlugin.prototype.appendErrorCauseFromObject = function (subsegment, error) {
        subsegment.cause = {
            exceptions: [
                {
                    type: error.name,
                    message: error.message
                }
            ]
        };
    };
    return FetchPlugin;
}(MonkeyPatched));
export { FetchPlugin };
