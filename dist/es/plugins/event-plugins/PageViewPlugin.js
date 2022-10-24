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
import { PageIdFormatEnum } from '../../orchestration/Orchestration';
import { MonkeyPatched } from '../MonkeyPatched';
export var PAGE_EVENT_PLUGIN_ID = 'page-view';
/**
 * A plugin which records page view transitions.
 *
 * When a session is initialized, the PageManager records the landing page. When
 * subsequent pages are viewed, this plugin updates the page.
 */
var PageViewPlugin = /** @class */ (function (_super) {
    __extends(PageViewPlugin, _super);
    function PageViewPlugin() {
        var _this = _super.call(this, PAGE_EVENT_PLUGIN_ID) || this;
        _this.pushState = function () {
            var self = _this;
            return function (original) {
                return function (data, title, url) {
                    var retVal = original.apply(this, arguments);
                    self.recordPageView();
                    return retVal;
                };
            };
        };
        _this.replaceState = function () {
            var self = _this;
            return function (original) {
                return function (data, title, url) {
                    var retVal = original.apply(this, arguments);
                    self.recordPageView();
                    return retVal;
                };
            };
        };
        _this.popstateListener = function (event) {
            _this.recordPageView();
        };
        _this.recordPageView = function () {
            _this.context.recordPageView(_this.createIdForCurrentPage());
        };
        _this.enable();
        return _this;
    }
    PageViewPlugin.prototype.onload = function () {
        this.addListener();
        this.recordPageView();
    };
    Object.defineProperty(PageViewPlugin.prototype, "patches", {
        get: function () {
            return [
                {
                    nodule: History.prototype,
                    name: 'pushState',
                    wrapper: this.pushState
                },
                {
                    nodule: History.prototype,
                    name: 'replaceState',
                    wrapper: this.replaceState
                }
            ];
        },
        enumerable: false,
        configurable: true
    });
    PageViewPlugin.prototype.addListener = function () {
        // popstate will fire under the following conditions:
        // (1) The history back, forward or go APIs are used
        // (2) The URI's fragment (hash) changes
        window.addEventListener('popstate', this.popstateListener);
    };
    PageViewPlugin.prototype.createIdForCurrentPage = function () {
        var path = window.location.pathname;
        var hash = window.location.hash;
        switch (this.context.config.pageIdFormat) {
            case PageIdFormatEnum.PathAndHash:
                if (path && hash) {
                    return path + hash;
                }
                else if (path) {
                    return path;
                }
                else if (hash) {
                    return hash;
                }
                return '';
            case PageIdFormatEnum.Hash:
                return hash ? hash : '';
            case PageIdFormatEnum.Path:
            default:
                return path ? path : '';
        }
    };
    return PageViewPlugin;
}(MonkeyPatched));
export { PageViewPlugin };
