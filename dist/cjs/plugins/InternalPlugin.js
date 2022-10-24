"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalPlugin = void 0;
var constant_1 = require("./utils/constant");
var InternalPlugin = /** @class */ (function () {
    function InternalPlugin(name) {
        this.enabled = true;
        this.pluginId = InternalPlugin.generatePluginId(name);
    }
    InternalPlugin.generatePluginId = function (name) {
        return "".concat(InternalPlugin.idPrefix, ".").concat(name);
    };
    InternalPlugin.prototype.load = function (context) {
        var _a;
        this.context = context;
        (_a = this.onload) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    InternalPlugin.prototype.getPluginId = function () {
        return this.pluginId;
    };
    InternalPlugin.idPrefix = constant_1.RUM_AWS_PREFIX;
    return InternalPlugin;
}());
exports.InternalPlugin = InternalPlugin;
