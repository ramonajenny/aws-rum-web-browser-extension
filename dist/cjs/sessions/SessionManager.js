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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = exports.RUM_SESSION_EXPIRE = exports.RUM_SESSION_START = exports.SESSION_START_EVENT_TYPE = exports.WEB_PLATFORM_TYPE = exports.DESKTOP_DEVICE_TYPE = exports.UNKNOWN = exports.NIL_UUID = void 0;
var cookies_utils_1 = require("../utils/cookies-utils");
var uuid_1 = require("uuid");
var ua_parser_js_1 = require("ua-parser-js");
var constants_1 = require("../utils/constants");
exports.NIL_UUID = "00000000-0000-0000-0000-000000000000";
exports.UNKNOWN = "unknown";
exports.DESKTOP_DEVICE_TYPE = "desktop";
exports.WEB_PLATFORM_TYPE = "web";
exports.SESSION_START_EVENT_TYPE = "com.amazon.rum.session_start_event";
exports.RUM_SESSION_START = "rum_session_start";
exports.RUM_SESSION_EXPIRE = "rum_session_expire";
/**
 * The session handler handles user id and session id.
 *
 * A session is the {user id, session id} tuple which groups events that occur on a single browser over a continuous
 * period of time. A session begins when no session exists or the last session has expired. If user id does not exist,
 * session handler will assign a new one and store it in cookie. If session id does not exist or has expired, session
 * handler will assign a new one and store it in cookie. Session handler detects user interactions and updates session
 * id expiration time.
 */
var SessionManager = /** @class */ (function () {
    function SessionManager(appMonitorDetails, config, record, pageManager) {
        this.appMonitorDetails = appMonitorDetails;
        this.config = config;
        this.record = record;
        this.pageManager = pageManager;
        // Initialize the session to the nil session
        this.session = {
            sessionId: exports.NIL_UUID,
            record: this.sample(),
            eventCount: 0,
        };
        // Initialize or restore the user
        this.initializeUser();
        // Collect the user agent and domain
        this.collectAttributes();
        // Set custom session attributes
        this.addSessionAttributes(this.config.sessionAttributes);
        // Attempt to restore the previous session
        this.getSessionFromCookie();
    }
    /**
     * Returns the session ID. If no session ID exists, one will be created.
     */
    SessionManager.prototype.getSession = function () {
        if (this.session.sessionId !== exports.NIL_UUID && !this.useCookies()) {
            // Cookie access has been revoked. Revert to nil session.
            this.session = {
                sessionId: exports.NIL_UUID,
                record: this.sample(),
                eventCount: 0,
                page: this.session.page,
            };
        }
        else if (this.session.sessionId === exports.NIL_UUID && this.useCookies()) {
            // The session does not exist. Create a new one.
            this.createSession();
        }
        else if (this.session.sessionId !== exports.NIL_UUID &&
            new Date() > this.sessionExpiry) {
            // The session has expired. Create a new one.
            this.createSession();
        }
        return this.session;
    };
    SessionManager.prototype.getAttributes = function () {
        return this.attributes;
    };
    /**
     * Adds custom session attributes to the session's attributes
     *
     * @param sessionAttributes object containing custom attribute data in the form of key, value pairs
     */
    SessionManager.prototype.addSessionAttributes = function (sessionAttributes) {
        this.attributes = __assign(__assign({}, sessionAttributes), this.attributes);
    };
    SessionManager.prototype.getUserId = function () {
        if (this.useCookies()) {
            return this.userId;
        }
        return exports.NIL_UUID;
    };
    SessionManager.prototype.incrementSessionEventCount = function () {
        this.session.eventCount++;
        this.renewSession();
    };
    SessionManager.prototype.initializeUser = function () {
        var userId = "";
        this.userExpiry = new Date();
        this.userExpiry.setDate(this.userExpiry.getDate() + this.config.userIdRetentionDays);
        if (this.config.userIdRetentionDays <= 0) {
            // Use the 'nil' UUID when the user ID will not be retained
            this.userId = "00000000-0000-0000-0000-000000000000";
        }
        else if (this.useCookies()) {
            userId = this.getUserIdCookie();
            this.userId = userId ? userId : (0, uuid_1.v4)();
            this.createOrRenewUserCookie(userId, this.userExpiry);
        }
        else {
            this.userId = (0, uuid_1.v4)();
        }
    };
    SessionManager.prototype.createOrRenewSessionCookie = function (session, expires) {
        if (btoa) {
            (0, cookies_utils_1.storeCookie)(this.sessionCookieName(), btoa(JSON.stringify(session)), this.config.cookieAttributes, undefined, expires);
        }
    };
    SessionManager.prototype.createOrRenewUserCookie = function (userId, expires) {
        (0, cookies_utils_1.storeCookie)(constants_1.USER_COOKIE_NAME, userId, this.config.cookieAttributes, undefined, expires);
    };
    SessionManager.prototype.getUserIdCookie = function () {
        return (0, cookies_utils_1.getCookie)(constants_1.USER_COOKIE_NAME);
    };
    SessionManager.prototype.getSessionFromCookie = function () {
        if (this.useCookies()) {
            var cookie = (0, cookies_utils_1.getCookie)(this.sessionCookieName());
            if (cookie && atob) {
                try {
                    this.session = JSON.parse(atob(cookie));
                    this.pageManager.resumeSession(this.session.page.pageId, this.session.page.interaction);
                }
                catch (e) {
                    // Error decoding or parsing the cookie -- ignore
                }
            }
        }
    };
    SessionManager.prototype.storeSessionAsCookie = function () {
        if (this.useCookies() && this.config.userIdRetentionDays > 0) {
            this.createOrRenewUserCookie(this.userId, this.userExpiry);
        }
        if (this.useCookies()) {
            // Set the user cookie in case useCookies() has changed from false to true.
            this.createOrRenewSessionCookie(this.session, this.sessionExpiry);
        }
    };
    SessionManager.prototype.createSession = function () {
        this.session = {
            sessionId: (0, uuid_1.v4)(),
            record: this.sample(),
            eventCount: 0,
        };
        this.session.page = this.pageManager.getPage();
        this.sessionExpiry = new Date(new Date().getTime() + this.config.sessionLengthSeconds * 1000);
        this.storeSessionAsCookie();
        this.record(this.session, exports.SESSION_START_EVENT_TYPE, {
            version: "1.0.0",
        });
    };
    SessionManager.prototype.renewSession = function () {
        this.sessionExpiry = new Date(new Date().getTime() + this.config.sessionLengthSeconds * 1000);
        this.session.page = this.pageManager.getPage();
        this.storeSessionAsCookie();
    };
    SessionManager.prototype.collectAttributes = function () {
        var ua = new ua_parser_js_1.UAParser(navigator.userAgent).getResult();
        this.attributes = {
            browserLanguage: navigator.language,
            browserName: ua.browser.name ? ua.browser.name : exports.UNKNOWN,
            browserVersion: ua.browser.version ? ua.browser.version : exports.UNKNOWN,
            osName: ua.os.name ? ua.os.name : exports.UNKNOWN,
            osVersion: ua.os.version ? ua.os.version : exports.UNKNOWN,
            // Possible device types include {console, mobile, tablet, smarttv, wearable, embedded}. If the device
            // type is undefined, there was no information indicating the device is anything other than a desktop,
            // so we assume the device is a desktop.
            deviceType: ua.device.type ? ua.device.type : exports.DESKTOP_DEVICE_TYPE,
            // This client is used exclusively in web applications.
            platformType: exports.WEB_PLATFORM_TYPE,
            domain: "".concat(window.location.hostname, ".chrome"),
        };
    };
    /**
     * Returns true when cookies should be used to store user ID and session ID.
     */
    SessionManager.prototype.useCookies = function () {
        return navigator.cookieEnabled && this.config.allowCookies;
    };
    /**
     * Returns {@code true} when the session has been selected to be recorded.
     */
    SessionManager.prototype.sample = function () {
        return Math.random() < this.config.sessionSampleRate;
    };
    SessionManager.prototype.sessionCookieName = function () {
        if (this.config.cookieAttributes.unique) {
            return "".concat(constants_1.SESSION_COOKIE_NAME, "_").concat(this.appMonitorDetails.id);
        }
        return constants_1.SESSION_COOKIE_NAME;
    };
    return SessionManager;
}());
exports.SessionManager = SessionManager;
