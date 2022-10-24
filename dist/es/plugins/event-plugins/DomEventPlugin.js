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
import { DOM_EVENT_TYPE } from '../utils/constant';
export var DOM_EVENT_PLUGIN_ID = 'dom-event';
var defaultConfig = {
    interactionId: function () { return ''; },
    enableMutationObserver: false,
    events: []
};
var DomEventPlugin = /** @class */ (function (_super) {
    __extends(DomEventPlugin, _super);
    function DomEventPlugin(config) {
        var _this = _super.call(this, DOM_EVENT_PLUGIN_ID) || this;
        _this.enabled = false;
        _this.eventListenerMap = new Map();
        _this.config = __assign(__assign({}, defaultConfig), config);
        return _this;
    }
    DomEventPlugin.getElementInfo = function (event) {
        var elementInfo = { name: 'UNKNOWN' };
        if (event.target instanceof Node) {
            elementInfo.name = event.target.nodeName;
        }
        if (event.target instanceof Element && event.target.id) {
            elementInfo.id = event.target.id;
        }
        return elementInfo;
    };
    DomEventPlugin.prototype.enable = function () {
        var _this = this;
        if (document.readyState !== 'complete') {
            window.addEventListener('load', function () { return _this.enable(); });
            return;
        }
        if (this.enabled) {
            return;
        }
        this.addListeners();
        if (this.config.enableMutationObserver) {
            this.observeDOMMutation();
        }
        this.enabled = true;
    };
    DomEventPlugin.prototype.disable = function () {
        if (!this.enabled) {
            return;
        }
        this.removeListeners();
        if (this.observer) {
            this.observer.disconnect();
        }
        this.enabled = false;
    };
    DomEventPlugin.prototype.update = function (events) {
        var _this = this;
        events.forEach(function (domEvent) {
            _this.addEventHandler(domEvent);
            _this.config.events.push(domEvent);
        });
    };
    DomEventPlugin.prototype.onload = function () {
        this.enable();
    };
    DomEventPlugin.prototype.removeListeners = function () {
        var _this = this;
        this.config.events.forEach(function (domEvent) {
            return _this.removeEventHandler(domEvent);
        });
    };
    DomEventPlugin.prototype.addListeners = function () {
        var _this = this;
        this.config.events.forEach(function (domEvent) {
            return _this.addEventHandler(domEvent);
        });
    };
    DomEventPlugin.prototype.getEventListener = function (cssLocator) {
        var _this = this;
        return function (event) {
            var _a;
            var elementInfo = DomEventPlugin.getElementInfo(event);
            var interactionId = _this.config.interactionId(event);
            var eventData = __assign(__assign(__assign({ version: '1.1.0', event: event.type, element: elementInfo.name }, (elementInfo.id ? { elementId: elementInfo.id } : {})), (interactionId ? { interactionId: interactionId } : {})), (cssLocator ? { cssLocator: cssLocator } : {}));
            if ((_a = _this.context) === null || _a === void 0 ? void 0 : _a.record) {
                _this.context.record(DOM_EVENT_TYPE, eventData);
            }
        };
    };
    DomEventPlugin.prototype.addEventHandler = function (domEvent) {
        var eventType = domEvent.event;
        var eventListener = this.getEventListener(domEvent.cssLocator);
        var identifiedElementList = [];
        var elementEventListenerList = this.eventListenerMap.has(domEvent)
            ? this.eventListenerMap.get(domEvent)
            : [];
        // first add event listener to all elements identified by the CSS locator
        if (domEvent.cssLocator) {
            var cssLocatedElements = document.querySelectorAll(domEvent.cssLocator);
            cssLocatedElements.forEach(function (element) {
                identifiedElementList.push(element);
            });
        }
        else if (domEvent.elementId) {
            var identifiedElement = document.getElementById(domEvent.elementId);
            if (identifiedElement) {
                identifiedElementList.push(identifiedElement);
            }
        }
        else if (domEvent.element) {
            identifiedElementList.push(domEvent.element);
        }
        identifiedElementList.forEach(function (element) {
            element.addEventListener(eventType, eventListener);
            elementEventListenerList.push({ element: element, eventListener: eventListener });
        });
        this.eventListenerMap.set(domEvent, elementEventListenerList);
    };
    DomEventPlugin.prototype.removeEventHandler = function (domEvent) {
        var elementEventListenerList = this.eventListenerMap.get(domEvent);
        if (elementEventListenerList) {
            elementEventListenerList.forEach(function (elementEventListener) {
                var element = elementEventListener.element;
                var eventListener = elementEventListener.eventListener;
                element.removeEventListener(domEvent.event, eventListener);
            });
            this.eventListenerMap.delete(domEvent);
        }
    };
    DomEventPlugin.prototype.observeDOMMutation = function () {
        var _this = this;
        this.observer = new MutationObserver(function () {
            _this.removeListeners();
            _this.addListeners();
        });
        //  we track only changes to nodes/DOM elements, not attributes or characterData
        this.observer.observe(document, { childList: true, subtree: true });
    };
    return DomEventPlugin;
}(InternalPlugin));
export { DomEventPlugin };
