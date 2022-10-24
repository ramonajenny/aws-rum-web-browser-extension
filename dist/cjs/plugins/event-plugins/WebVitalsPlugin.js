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
exports.WebVitalsPlugin = exports.WEB_VITAL_EVENT_PLUGIN_ID = void 0;
var InternalPlugin_1 = require("../InternalPlugin");
var web_vitals_1 = require("web-vitals");
var constant_1 = require("../utils/constant");
exports.WEB_VITAL_EVENT_PLUGIN_ID = 'web-vitals';
var WebVitalsPlugin = /** @class */ (function (_super) {
    __extends(WebVitalsPlugin, _super);
    function WebVitalsPlugin() {
        return _super.call(this, exports.WEB_VITAL_EVENT_PLUGIN_ID) || this;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.enable = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.disable = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.configure = function (config) { };
    WebVitalsPlugin.prototype.getWebVitalData = function (webVitalData, eventType) {
        var _a;
        var webVitalEvent = {
            version: '1.0.0',
            value: webVitalData.value
        };
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.record(eventType, webVitalEvent);
    };
    WebVitalsPlugin.prototype.onload = function () {
        var _this = this;
        (0, web_vitals_1.getLCP)(function (data) { return _this.getWebVitalData(data, constant_1.LCP_EVENT_TYPE); });
        (0, web_vitals_1.getFID)(function (data) { return _this.getWebVitalData(data, constant_1.FID_EVENT_TYPE); });
        (0, web_vitals_1.getCLS)(function (data) { return _this.getWebVitalData(data, constant_1.CLS_EVENT_TYPE); });
    };
    return WebVitalsPlugin;
}(InternalPlugin_1.InternalPlugin));
exports.WebVitalsPlugin = WebVitalsPlugin;
