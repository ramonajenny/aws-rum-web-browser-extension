"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatch = void 0;
var DataPlaneClient_1 = require("./DataPlaneClient");
var BeaconHttpHandler_1 = require("./BeaconHttpHandler");
var FetchHttpHandler_1 = require("./FetchHttpHandler");
var uuid_1 = require("uuid");
var RetryHttpHandler_1 = require("./RetryHttpHandler");
var NO_CRED_MSG = 'CWR: Cannot dispatch; no AWS credentials.';
var Dispatch = /** @class */ (function () {
    function Dispatch(region, endpoint, eventCache, config) {
        var _this = this;
        /**
         * Send meta data and events to the AWS RUM data plane service via fetch.
         */
        this.dispatchFetch = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.doRequest()) {
                    return [2 /*return*/, this.rum
                            .sendFetch(this.createRequest())
                            .catch(this.handleReject)];
                }
                return [2 /*return*/];
            });
        }); };
        /**
         * Send meta data and events to the AWS RUM data plane service via beacon.
         */
        this.dispatchBeacon = function () { return __awaiter(_this, void 0, void 0, function () {
            var request_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.doRequest()) {
                    request_1 = this.createRequest();
                    return [2 /*return*/, this.rum
                            .sendBeacon(request_1)
                            .catch(function () { return _this.rum.sendFetch(request_1); })];
                }
                return [2 /*return*/];
            });
        }); };
        /**
         * Send meta data and events to the AWS RUM data plane service via fetch.
         *
         * Returns undefined on failure.
         */
        this.dispatchFetchFailSilent = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return [2 /*return*/, this.dispatchFetch().catch(function () { })];
            });
        }); };
        /**
         * Send meta data and events to the AWS RUM data plane service via beacon.
         *
         * Returns undefined on failure.
         */
        this.dispatchBeaconFailSilent = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return [2 /*return*/, this.dispatchBeacon().catch(function () { })];
            });
        }); };
        this.handleReject = function (e) {
            // The handler has run out of retries. We adhere to our convention to
            // fail safe by disabling dispatch. This ensures that we will not
            // continue to attempt requests when the problem is not recoverable.
            _this.disable();
            throw e;
        };
        /**
         * The default method for creating data plane service clients.
         *
         * @param endpoint Service endpoint.
         * @param region  Service region.
         * @param credentials AWS credentials.
         */
        this.defaultClientBuilder = function (endpoint, region, credentials) {
            return new DataPlaneClient_1.DataPlaneClient({
                fetchRequestHandler: new RetryHttpHandler_1.RetryHttpHandler(new FetchHttpHandler_1.FetchHttpHandler({
                    fetchFunction: _this.config.fetchFunction
                }), _this.config.retries),
                beaconRequestHandler: new BeaconHttpHandler_1.BeaconHttpHandler(),
                endpoint: endpoint,
                region: region,
                credentials: credentials
            });
        };
        this.region = region;
        this.endpoint = endpoint;
        this.eventCache = eventCache;
        this.enabled = true;
        this.buildClient = config.clientBuilder || this.defaultClientBuilder;
        this.config = config;
        this.startDispatchTimer();
        this.rum = {
            sendFetch: function () {
                return Promise.reject(new Error(NO_CRED_MSG));
            },
            sendBeacon: function () {
                return Promise.reject(new Error(NO_CRED_MSG));
            }
        };
    }
    /**
     * Dispatch will send requests to data plane.
     */
    Dispatch.prototype.enable = function () {
        this.enabled = true;
        this.startDispatchTimer();
    };
    /**
     * Dispatch will not send requests to data plane.
     */
    Dispatch.prototype.disable = function () {
        this.stopDispatchTimer();
        this.enabled = false;
    };
    /**
     * Set the authentication token that will be used to authenticate with the
     * data plane service (AWS auth).
     *
     * @param credentials A set of AWS credentials from the application's authflow.
     */
    Dispatch.prototype.setAwsCredentials = function (credentialProvider) {
        this.rum = this.buildClient(this.endpoint, this.region, credentialProvider);
        if (typeof credentialProvider === 'function') {
            // In case a beacon in the first dispatch, we must pre-fetch credentials into a cookie so there is no delay
            // to fetch credentials while the page is closing.
            credentialProvider();
        }
    };
    /**
     * Automatically dispatch cached events.
     */
    Dispatch.prototype.startDispatchTimer = function () {
        document.addEventListener('visibilitychange', 
        // The page is moving to the hidden state, which means it may be
        // unloaded. The sendBeacon API would typically be used in this
        // case. However, ad-blockers prevent sendBeacon from functioning.
        // We therefore have two bad options:
        //
        // (1) Use sendBeacon. Data will be lost when ad blockers are
        //     used and the page loses visibility
        // (2) Use fetch. Data will be lost when the page is unloaded
        //     before fetch completes
        //
        // A third option is to send both, however this would increase
        // bandwitch and require deduping server side.
        this.config.useBeacon
            ? this.dispatchBeaconFailSilent
            : this.dispatchFetchFailSilent);
        // Using 'pagehide' is redundant most of the time (visibilitychange is
        // always fired before pagehide) but older browsers may support
        // 'pagehide' but not 'visibilitychange'.
        document.addEventListener('pagehide', this.config.useBeacon
            ? this.dispatchBeaconFailSilent
            : this.dispatchFetchFailSilent);
        if (this.config.dispatchInterval <= 0 || this.dispatchTimerId) {
            return;
        }
        this.dispatchTimerId = window.setInterval(this.dispatchFetchFailSilent, this.config.dispatchInterval);
    };
    /**
     * Stop automatically dispatching cached events.
     */
    Dispatch.prototype.stopDispatchTimer = function () {
        document.removeEventListener('visibilitychange', this.config.useBeacon
            ? this.dispatchBeaconFailSilent
            : this.dispatchFetchFailSilent);
        document.removeEventListener('pagehide', this.config.useBeacon
            ? this.dispatchBeaconFailSilent
            : this.dispatchFetchFailSilent);
        if (this.dispatchTimerId) {
            window.clearInterval(this.dispatchTimerId);
            this.dispatchTimerId = undefined;
        }
    };
    Dispatch.prototype.doRequest = function () {
        return this.enabled && this.eventCache.hasEvents();
    };
    Dispatch.prototype.createRequest = function () {
        return {
            BatchId: (0, uuid_1.v4)(),
            AppMonitorDetails: this.eventCache.getAppMonitorDetails(),
            UserDetails: this.eventCache.getUserDetails(),
            RumEvents: this.eventCache.getEventBatch()
        };
    };
    return Dispatch;
}());
exports.Dispatch = Dispatch;
