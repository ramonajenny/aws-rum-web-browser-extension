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
import { InternalPlugin } from '../InternalPlugin';
import { JS_ERROR_EVENT_TYPE } from '../utils/constant';
import { errorEventToJsErrorEvent } from '../utils/js-error-utils';
export var JS_ERROR_EVENT_PLUGIN_ID = 'js-error';
var defaultConfig = {
    stackTraceLength: 200,
    ignore: function () { return false; }
};
var JsErrorPlugin = /** @class */ (function (_super) {
    __extends(JsErrorPlugin, _super);
    function JsErrorPlugin(config) {
        var _this = _super.call(this, JS_ERROR_EVENT_PLUGIN_ID) || this;
        _this.eventHandler = function (errorEvent) {
            if (!_this.config.ignore(errorEvent)) {
                _this.recordJsErrorEvent(errorEvent);
            }
        };
        _this.promiseRejectEventHandler = function (event) {
            if (!_this.config.ignore(event)) {
                _this.recordJsErrorEvent({
                    type: event.type,
                    error: event.reason
                });
            }
        };
        _this.config = __assign(__assign({}, defaultConfig), config);
        return _this;
    }
    JsErrorPlugin.prototype.enable = function () {
        if (this.enabled) {
            return;
        }
        this.addEventHandler();
        this.enabled = true;
    };
    JsErrorPlugin.prototype.disable = function () {
        if (!this.enabled) {
            return;
        }
        this.removeEventHandler();
        this.enabled = false;
    };
    JsErrorPlugin.prototype.record = function (error) {
        if (error instanceof ErrorEvent) {
            this.recordJsErrorEvent(error);
        }
        else {
            this.recordJsErrorEvent({ type: 'error', error: error });
        }
    };
    JsErrorPlugin.prototype.onload = function () {
        this.addEventHandler();
    };
    JsErrorPlugin.prototype.recordJsErrorEvent = function (error) {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.record(JS_ERROR_EVENT_TYPE, errorEventToJsErrorEvent(error, this.config.stackTraceLength));
    };
    JsErrorPlugin.prototype.addEventHandler = function () {
        window.addEventListener('error', this.eventHandler);
        window.addEventListener('unhandledrejection', this.promiseRejectEventHandler);
    };
    JsErrorPlugin.prototype.removeEventHandler = function () {
        window.removeEventListener('error', this.eventHandler);
        window.removeEventListener('unhandledrejection', this.promiseRejectEventHandler);
    };
    return JsErrorPlugin;
}(InternalPlugin));
export { JsErrorPlugin };
