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
import { Authentication } from "../dispatch/Authentication";
import { EnhancedAuthentication } from "../dispatch/EnhancedAuthentication";
import { PluginManager } from "../plugins/PluginManager";
import { DomEventPlugin, DOM_EVENT_PLUGIN_ID, } from "../plugins/event-plugins/DomEventPlugin";
import { JsErrorPlugin, JS_ERROR_EVENT_PLUGIN_ID, } from "../plugins/event-plugins/JsErrorPlugin";
import { EventCache } from "../event-cache/EventCache";
import { Dispatch } from "../dispatch/Dispatch";
import { NavigationPlugin } from "../plugins/event-plugins/NavigationPlugin";
import { ResourcePlugin } from "../plugins/event-plugins/ResourcePlugin";
import { WebVitalsPlugin } from "../plugins/event-plugins/WebVitalsPlugin";
import { XhrPlugin } from "../plugins/event-plugins/XhrPlugin";
import { FetchPlugin } from "../plugins/event-plugins/FetchPlugin";
import { PageViewPlugin } from "../plugins/event-plugins/PageViewPlugin";
var DEFAULT_REGION = "us-west-2";
var DEFAULT_ENDPOINT = "https://dataplane.rum.".concat(DEFAULT_REGION, ".amazonaws.com");
export var TelemetryEnum;
(function (TelemetryEnum) {
    TelemetryEnum["Errors"] = "errors";
    TelemetryEnum["Performance"] = "performance";
    TelemetryEnum["Interaction"] = "interaction";
    TelemetryEnum["Http"] = "http";
})(TelemetryEnum || (TelemetryEnum = {}));
export var PageIdFormatEnum;
(function (PageIdFormatEnum) {
    PageIdFormatEnum["Path"] = "PATH";
    PageIdFormatEnum["Hash"] = "HASH";
    PageIdFormatEnum["PathAndHash"] = "PATH_AND_HASH";
})(PageIdFormatEnum || (PageIdFormatEnum = {}));
export var defaultCookieAttributes = function () {
    return {
        unique: false,
        domain: "".concat(window.location.hostname, ".chrome"),
        path: "/",
        sameSite: "Strict",
        secure: true,
    };
};
export var defaultConfig = function (cookieAttributes) {
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
        var cookieAttributes = __assign(__assign({}, defaultCookieAttributes()), configCookieAttributes);
        this.config = __assign(__assign({ fetchFunction: fetch }, defaultConfig(cookieAttributes)), partialConfig);
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
        this.pluginManager.record(JS_ERROR_EVENT_PLUGIN_ID, error);
    };
    /**
     * Update DOM plugin to record the (additional) provided DOM events.
     *
     * @param events
     */
    Orchestration.prototype.registerDomEvents = function (events) {
        this.pluginManager.updatePlugin(DOM_EVENT_PLUGIN_ID, events);
    };
    Orchestration.prototype.initEventCache = function (applicationId, applicationVersion) {
        return new EventCache({
            id: applicationId,
            version: applicationVersion,
        }, this.config);
    };
    Orchestration.prototype.initDispatch = function (region) {
        var dispatch = new Dispatch(region, this.config.endpointUrl, this.eventCache, this.config);
        if (this.config.identityPoolId && this.config.guestRoleArn) {
            dispatch.setAwsCredentials(new Authentication(this.config).ChainAnonymousCredentialsProvider);
        }
        else if (this.config.identityPoolId) {
            dispatch.setAwsCredentials(new EnhancedAuthentication(this.config)
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
        var pluginManager = new PluginManager(pluginContext);
        // Load page view plugin
        if (!this.config.disableAutoPageView) {
            pluginManager.addPlugin(new PageViewPlugin());
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
                return [new JsErrorPlugin(config)];
            },
            _a[TelemetryEnum.Performance] = function (config) {
                return [
                    new NavigationPlugin(),
                    new ResourcePlugin(config),
                    new WebVitalsPlugin(),
                ];
            },
            _a[TelemetryEnum.Interaction] = function (config) {
                return [new DomEventPlugin(config)];
            },
            _a[TelemetryEnum.Http] = function (config) {
                return [new XhrPlugin(config), new FetchPlugin(config)];
            },
            _a;
    };
    return Orchestration;
}());
export { Orchestration };
