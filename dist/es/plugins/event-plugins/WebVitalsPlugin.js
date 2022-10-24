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
import { InternalPlugin } from '../InternalPlugin';
import { getCLS, getFID, getLCP } from 'web-vitals';
import { LCP_EVENT_TYPE, FID_EVENT_TYPE, CLS_EVENT_TYPE } from '../utils/constant';
export var WEB_VITAL_EVENT_PLUGIN_ID = 'web-vitals';
var WebVitalsPlugin = /** @class */ (function (_super) {
    __extends(WebVitalsPlugin, _super);
    function WebVitalsPlugin() {
        return _super.call(this, WEB_VITAL_EVENT_PLUGIN_ID) || this;
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
        getLCP(function (data) { return _this.getWebVitalData(data, LCP_EVENT_TYPE); });
        getFID(function (data) { return _this.getWebVitalData(data, FID_EVENT_TYPE); });
        getCLS(function (data) { return _this.getWebVitalData(data, CLS_EVENT_TYPE); });
    };
    return WebVitalsPlugin;
}(InternalPlugin));
export { WebVitalsPlugin };
