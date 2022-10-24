"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestration = exports.defaultConfig = exports.defaultCookieAttributes = exports.PageIdFormatEnum = exports.TelemetryEnum = void 0;
var Authentication_1 = require("../dispatch/Authentication");
var EnhancedAuthentication_1 = require("../dispatch/EnhancedAuthentication");
var PluginManager_1 = require("../plugins/PluginManager");
var DomEventPlugin_1 = require("../plugins/event-plugins/DomEventPlugin");
var JsErrorPlugin_1 = require("../plugins/event-plugins/JsErrorPlugin");
var EventCache_1 = require("../event-cache/EventCache");
var Dispatch_1 = require("../dispatch/Dispatch");
var NavigationPlugin_1 = require("../plugins/event-plugins/NavigationPlugin");
var ResourcePlugin_1 = require("../plugins/event-plugins/ResourcePlugin");
var WebVitalsPlugin_1 = require("../plugins/event-plugins/WebVitalsPlugin");
var XhrPlugin_1 = require("../plugins/event-plugins/XhrPlugin");
var FetchPlugin_1 = require("../plugins/event-plugins/FetchPlugin");
var PageViewPlugin_1 = require("../plugins/event-plugins/PageViewPlugin");
var DEFAULT_REGION = "us-west-2";
var DEFAULT_ENDPOINT = "https://dataplane.rum.".concat(DEFAULT_REGION, ".amazonaws.com");
var TelemetryEnum;
(function (TelemetryEnum) {
    TelemetryEnum["Errors"] = "errors";
    TelemetryEnum["Performance"] = "performance";
    TelemetryEnum["Interaction"] = "interaction";
    TelemetryEnum["Http"] = "http";
})(TelemetryEnum = exports.TelemetryEnum || (exports.TelemetryEnum = {}));
var PageIdFormatEnum;
(function (PageIdFormatEnum) {
    PageIdFormatEnum["Path"] = "PATH";
    PageIdFormatEnum["Hash"] = "HASH";
    PageIdFormatEnum["PathAndHash"] = "PATH_AND_HASH";
})(PageIdFormatEnum = exports.PageIdFormatEnum || (exports.PageIdFormatEnum = {}));
var defaultCookieAttributes = function () {
    return {
        unique: false,
        domain: "".concat(window.location.hostname, ".chrome"),
        path: "/",
        sameSite: "Strict",
        secure: true,
    };
};
exports.defaultCookieAttributes = defaultCookieAttributes;
var defaultConfig = function (cookieAttributes) {
    return {
        allowCookies: false,
        batchLimit: 100,
        cookieAttributes: cookieAttributes,
        sessionAttributes: {},
        disableAutoPageView: false,
        dispatchInterval: 5 * 1000,
        enableRumClient: true,
        enableXRay: false,
        endpoint: DEFAULT_ENDPOINT,
        endpointUrl: new URL(DEFAULT_ENDPOINT),
        eventCacheSize: 200,
        eventPluginsToLoad: [],
        pageIdFormat: PageIdFormatEnum.Path,
        pagesToExclude: [],
        pagesToInclude: [/.*/],
        recordResourceUrl: true,
        retries: 2,
        routeChangeComplete: 100,
        routeChangeTimeout: 10000,
        sessionEventLimit: 200,
        sessionLengthSeconds: 60 * 30,
        sessionSampleRate: 1,
        telemetries: [],
        useBeacon: true,
        userIdRetentionDays: 30,
    };
};
exports.defaultConfig = defaultConfig;
/**
 * An orchestrator which (1) initializes cwr components and (2) provides the API for the application to interact
 * with the RUM web client. Depending on how the RUM web client was loaded, this class may be called directly, or
 * indirectly through the CommandQueue:
 * - If the client was loaded by an HTML script tag, Orchestration is called indirectly through the CommandQueue.
 * - If the client was loaded as an NPM module, Orchestration is called directly by the application.
 */
var Orchestration = /** @class */ (function () {
    /**
     * Instantiate the CloudWatch RUM web client and begin monitoring the
     * application.
     *
     * This constructor may throw a TypeError if not correctly configured. In
     * production code, wrap calls to this constructor in a try/catch block so
     * that this does not impact the application.
     *
     * @param applicationId A globally unique identifier for the CloudWatch RUM
     * app monitor which monitors your application.
     * @param applicationVersion Your application's semantic version. If you do
     * not wish to use this field then add any placeholder, such as '0.0.0'.
     * @param region The AWS region of the app monitor. For example, 'us-east-1'
     * or 'eu-west-2'.
     * @param configCookieAttributes
     * @param partialConfig An application-specific configuration for the web
     * client.
     */
    function Orchestration(applicationId, applicationVersion, region, _a) {
        if (_a === void 0) { _a = {}; }
        var configCookieAttributes = _a.cookieAttributes, partialConfig = __rest(_a, ["cookieAttributes"]);
        if (typeof region === "undefined") {
            // Provide temporary backwards compatability if the region was not provided by the loader. This will be
            // removed when internal users have migrated to the new signature.
            region = "us-west-2";
        }
        var cookieAttributes = __assign(__assign({}, (0, exports.defaultCookieAttributes)()), configCookieAttributes);
        this.config = __assign(__assign({ fetchFunction: fetch }, (0, exports.defaultConfig)(cookieAttributes)), partialConfig);
        this.config.endpoint = this.getDataPlaneEndpoint(region, partialConfig);
        // If the URL is not formatted correctly, a TypeError will be thrown.
        // This breaks our convention to fail-safe here for the sake of
        // debugging. It is expected that the application has wrapped the call
        // to the constructor in a try/catch block, as is done in the example
        // code.
        this.config.endpointUrl = new URL(this.config.endpoint);
        this.eventCache = this.initEventCache(applicationId, applicationVersion);
        this.dispatchManager = this.initDispatch(region);
        this.pluginManager = this.initPluginManager(applicationId, applicationVersion);
        if (this.config.enableRumClient) {
            this.enable();
        }
        else {
            this.disable();
        }
    }
    /**
     * Set the credential provider that will be used to authenticate with the
     * data plane service (AWS auth).
     *
     * @param credentials A provider of AWS credentials.
     */
    Orchestration.prototype.setAwsCredentials = function (credentials) {
        this.dispatchManager.setAwsCredentials(credentials);
    };
    /**
     * Set custom session attributes to add them to all event metadata.
     *
     * @param payload object containing custom attribute data in the form of key, value pairs
     */
    Orchestration.prototype.addSessionAttributes = function (sessionAttributes) {
        this.eventCache.addSessionAttributes(sessionAttributes);
    };
    /**
     * Add a telemetry plugin.
     *
     * @param plugin A plugin which adheres to the RUM web client's plugin interface.
     */
    Orchestration.prototype.addPlugin = function (plugin) {
        this.pluginManager.addPlugin(plugin);
    };
    /**
     * Force the cllient to immediately dispatch events to the collector.
     */
    Orchestration.prototype.dispatch = function () {
        this.dispatchManager.dispatchFetch();
    };
    /**
     * Force the cllient to immediately dispatch events to the collector using a beacon.
     */
    Orchestration.prototype.dispatchBeacon = function () {
        this.dispatchManager.dispatchBeacon();
    };
    /**
     * When enabled, the client records and dispatches events.
     */
    Orchestration.prototype.enable = function () {
        this.eventCache.enable();
        this.pluginManager.enable();
        this.dispatchManager.enable();
    };
    /**
     * When disabled, the client does not record or dispatch events.
     */
    Orchestration.prototype.disable = function () {
        this.dispatchManager.disable();
        this.pluginManager.disable();
        this.eventCache.disable();
    };
    /**
     * @param allow when {@code false}, the RUM web client will not store cookies or use localstorage.
     */
    Orchestration.prototype.allowCookies = function (allow) {
        this.config.allowCookies = allow;
    };
    /**
     * Update the current page the user is interacting with.
     *
     * @param payload Can be string or PageAttributes object
     * If string, payload is pageId (The unique ID for the page within the application).
     * If PageAttributes, payload contains pageId as well as page attributes to include in events with pageId
     */
    Orchestration.prototype.recordPageView = function (payload) {
        this.eventCache.recordPageView(payload);
    };
    /**
     * Record an error using the JS error plugin.
     *
     * @param error An ErrorEvent, Error or primitive.
     */
    Orchestration.prototype.recordError = function (error) {
        this.pluginManager.record(JsErrorPlugin_1.JS_ERROR_EVENT_PLUGIN_ID, error);
    };
    /**
     * Update DOM plugin to record the (additional) provided DOM events.
     *
     * @param events
     */
    Orchestration.prototype.registerDomEvents = function (events) {
        this.pluginManager.updatePlugin(DomEventPlugin_1.DOM_EVENT_PLUGIN_ID, events);
    };
    Orchestration.prototype.initEventCache = function (applicationId, applicationVersion) {
        return new EventCache_1.EventCache({
            id: applicationId,
            version: applicationVersion,
        }, this.config);
    };
    Orchestration.prototype.initDispatch = function (region) {
        var dispatch = new Dispatch_1.Dispatch(region, this.config.endpointUrl, this.eventCache, this.config);
        if (this.config.identityPoolId && this.config.guestRoleArn) {
            dispatch.setAwsCredentials(new Authentication_1.Authentication(this.config).ChainAnonymousCredentialsProvider);
        }
        else if (this.config.identityPoolId) {
            dispatch.setAwsCredentials(new EnhancedAuthentication_1.EnhancedAuthentication(this.config)
                .ChainAnonymousCredentialsProvider);
        }
        return dispatch;
    };
    Orchestration.prototype.initPluginManager = function (applicationId, applicationVersion) {
        var BUILTIN_PLUGINS = this.constructBuiltinPlugins();
        var PLUGINS = __spreadArray(__spreadArray([], BUILTIN_PLUGINS, true), this.config.eventPluginsToLoad, true);
        var pluginContext = {
            applicationId: applicationId,
            applicationVersion: applicationVersion,
            config: this.config,
            record: this.eventCache.recordEvent,
            recordPageView: this.eventCache.recordPageView,
            getSession: this.eventCache.getSession,
        };
        // Initialize PluginManager
        var pluginManager = new PluginManager_1.PluginManager(pluginContext);
        // Load page view plugin
        if (!this.config.disableAutoPageView) {
            pluginManager.addPlugin(new PageViewPlugin_1.PageViewPlugin());
        }
        // Load plugins
        PLUGINS.forEach(function (p) {
            pluginManager.addPlugin(p);
        });
        return pluginManager;
    };
    Orchestration.prototype.constructBuiltinPlugins = function () {
        var plugins = [];
        var functor = this.telemetryFunctor();
        this.config.telemetries.forEach(function (type) {
            if (typeof type === "string" && functor[type.toLowerCase()]) {
                plugins = __spreadArray(__spreadArray([], plugins, true), functor[type.toLowerCase()]({}), true);
            }
            else if (Array.isArray(type) &&
                functor[type[0].toLowerCase()]) {
                plugins = __spreadArray(__spreadArray([], plugins, true), functor[type[0].toLowerCase()](type[1]), true);
            }
        });
        return plugins;
    };
    Orchestration.prototype.getDataPlaneEndpoint = function (region, partialConfig) {
        return partialConfig.endpoint
            ? partialConfig.endpoint
            : DEFAULT_ENDPOINT.replace(DEFAULT_REGION, region);
    };
    /**
     * Returns a functor which maps data collection categories to
     * instantiated plugins.
     */
    Orchestration.prototype.telemetryFunctor = function () {
        var _a;
        return _a = {},
            _a[TelemetryEnum.Errors] = function (config) {
                return [new JsErrorPlugin_1.JsErrorPlugin(config)];
            },
            _a[TelemetryEnum.Performance] = function (config) {
                return [
                    new NavigationPlugin_1.NavigationPlugin(),
                    new ResourcePlugin_1.ResourcePlugin(config),
                    new WebVitalsPlugin_1.WebVitalsPlugin(),
                ];
            },
            _a[TelemetryEnum.Interaction] = function (config) {
                return [new DomEventPlugin_1.DomEventPlugin(config)];
            },
            _a[TelemetryEnum.Http] = function (config) {
                return [new XhrPlugin_1.XhrPlugin(config), new FetchPlugin_1.FetchPlugin(config)];
            },
            _a;
    };
    return Orchestration;
}());
exports.Orchestration = Orchestration;
