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
exports.MonkeyPatched = void 0;
var shimmer = require("shimmer");
var InternalPlugin_1 = require("./InternalPlugin");
var MonkeyPatched = /** @class */ (function (_super) {
    __extends(MonkeyPatched, _super);
    function MonkeyPatched() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enable = _this.patch.bind(_this, true);
        _this.disable = _this.patch.bind(_this, false);
        _this.enabled = false;
        return _this;
    }
    MonkeyPatched.prototype.patchAll = function () {
        var wrap = shimmer.wrap.bind(shimmer);
        for (var _i = 0, _a = this.patches; _i < _a.length; _i++) {
            var patch = _a[_i];
            wrap(patch.nodule, patch.name, patch.wrapper());
        }
    };
    MonkeyPatched.prototype.unpatchAll = function () {
        var unwrap = shimmer.unwrap.bind(shimmer);
        for (var _i = 0, _a = this.patches; _i < _a.length; _i++) {
            var patch = _a[_i];
            unwrap(patch.nodule, patch.name);
        }
    };
    MonkeyPatched.prototype.patch = function (shouldPatch) {
        if (shouldPatch === void 0) { shouldPatch = true; }
        if (this.enabled !== shouldPatch) {
            this.enabled = shouldPatch;
            if (shouldPatch) {
                this.patchAll();
            }
            else {
                this.unpatchAll();
            }
        }
    };
    return MonkeyPatched;
}(InternalPlugin_1.InternalPlugin));
exports.MonkeyPatched = MonkeyPatched;
