"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryEnum = exports.PageIdFormatEnum = exports.AwsRum = void 0;
var Orchestration_1 = require("./orchestration/Orchestration");
Object.defineProperty(exports, "AwsRum", { enumerable: true, get: function () { return Orchestration_1.Orchestration; } });
Object.defineProperty(exports, "PageIdFormatEnum", { enumerable: true, get: function () { return Orchestration_1.PageIdFormatEnum; } });
Object.defineProperty(exports, "TelemetryEnum", { enumerable: true, get: function () { return Orchestration_1.TelemetryEnum; } });
__exportStar(require("./plugins/event-plugins/DomEventPlugin"), exports);
__exportStar(require("./plugins/event-plugins/JsErrorPlugin"), exports);
__exportStar(require("./plugins/event-plugins/NavigationPlugin"), exports);
__exportStar(require("./plugins/event-plugins/PageViewPlugin"), exports);
__exportStar(require("./plugins/event-plugins/ResourcePlugin"), exports);
__exportStar(require("./plugins/event-plugins/WebVitalsPlugin"), exports);
__exportStar(require("./plugins/event-plugins/FetchPlugin"), exports);
__exportStar(require("./plugins/event-plugins/XhrPlugin"), exports);
