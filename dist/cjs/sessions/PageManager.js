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
exports.PageManager = void 0;
var VirtualPageLoadTimer_1 = require("../sessions/VirtualPageLoadTimer");
var constant_1 = require("../plugins/utils/constant");
/**
 * The page manager keeps the state of the current page and interaction level.
 *
 * A page is a unique view (user interface) of the application. For 'multi page' applications (i.e., 'classic' web
 * applications that have multiple html files), the page changes when the user nagivates to a new web page. For
 * 'single page' applications (i.e., 'ajax' web applications that have a single html file), the page changes when (1)
 * the popstate event emitted, or (2) the application indicates a new page has loaded using the RUM agent API.
 *
 * The interaction level is the order of a page in the sequence of pages sorted by the time they were viewed.
 */
var PageManager = /** @class */ (function () {
    function PageManager(config, record) {
        this.TIMEOUT = 1000;
        this.config = config;
        this.record = record;
        this.page = undefined;
        this.resumed = undefined;
        this.recordInteraction = false;
        this.virtualPageLoadTimer = new VirtualPageLoadTimer_1.VirtualPageLoadTimer(this, config, record);
    }
    PageManager.prototype.getPage = function () {
        return this.page;
    };
    PageManager.prototype.getAttributes = function () {
        return this.attributes;
    };
    PageManager.prototype.resumeSession = function (pageId, interaction) {
        this.recordInteraction = true;
        this.resumed = {
            pageId: pageId,
            interaction: interaction,
            start: 0
        };
    };
    PageManager.prototype.recordPageView = function (payload) {
        var pageId;
        if (typeof payload === 'string') {
            pageId = payload;
        }
        else {
            pageId = payload.pageId;
        }
        if (this.useCookies()) {
            this.recordInteraction = true;
        }
        if (!this.page && this.resumed) {
            this.createResumedPage(pageId, this.resumed);
        }
        else if (!this.page) {
            this.createLandingPage(pageId);
        }
        else if (this.page.pageId !== pageId) {
            this.createNextPage(this.page, pageId);
        }
        else {
            // The view has not changed.
            return;
        }
        // this.page is guaranteed to have been initialized
        // Attributes will be added to all events as meta data
        this.collectAttributes(this.page, typeof payload === 'object' ? payload : undefined);
        // The SessionManager will update its cookie with the new page
        this.recordPageViewEvent(this.page);
    };
    PageManager.prototype.createResumedPage = function (pageId, resumed) {
        this.page = {
            pageId: pageId,
            parentPageId: resumed.pageId,
            interaction: resumed.interaction + 1,
            start: Date.now()
        };
        this.resumed = undefined;
    };
    PageManager.prototype.createNextPage = function (currentPage, pageId) {
        var startTime = Date.now();
        var interactionTime = this.virtualPageLoadTimer.latestInteractionTime;
        // The latest interaction time (latest) is not guaranteed to be the
        // interaction that triggered the route change (actual). There are two
        // cases to consider:
        //
        // 1. Latest is older than actual. This can happen if the user navigates
        // with the browser back/forward button, or if the interaction is not a
        // click/keyup event.
        //
        // 2. Latest is newer than actual. This can happen if the user clicks or
        // types in the time between actual and when recordPageView is called.
        //
        // We believe that case (1) has a high risk of skewing route change
        // timing metrics because (a) browser navigation is common and (b) there
        // is no limit on when the lastest interaction may have occurred. To
        // help mitigate this, if the route change is already longer than 1000ms,
        // then we do not bother timing the route change.
        //
        // We do not believe that case (2) has a high risk of skewing route
        // change timing, and therefore ignore case (2).
        if (startTime - interactionTime <= this.TIMEOUT) {
            startTime = interactionTime;
            this.virtualPageLoadTimer.startTiming();
        }
        this.page = {
            pageId: pageId,
            parentPageId: currentPage.pageId,
            interaction: currentPage.interaction + 1,
            start: startTime
        };
    };
    PageManager.prototype.createLandingPage = function (pageId) {
        this.page = {
            pageId: pageId,
            interaction: 0,
            start: Date.now()
        };
    };
    PageManager.prototype.collectAttributes = function (page, customPageAttributes) {
        this.attributes = {
            title: document.title,
            pageId: page.pageId
        };
        if (this.recordInteraction) {
            this.attributes.interaction = page.interaction;
            if (page.parentPageId !== undefined) {
                this.attributes.parentPageId = page.parentPageId;
            }
        }
        if (customPageAttributes === null || customPageAttributes === void 0 ? void 0 : customPageAttributes.pageTags) {
            this.attributes['pageTags'] =
                customPageAttributes['pageTags'];
        }
        if (customPageAttributes === null || customPageAttributes === void 0 ? void 0 : customPageAttributes.pageAttributes) {
            this.attributes = __assign(__assign({}, customPageAttributes.pageAttributes), this.attributes);
        }
    };
    PageManager.prototype.createPageViewEvent = function (page) {
        var pageViewEvent = {
            version: '1.0.0',
            pageId: page.pageId
        };
        if (this.recordInteraction) {
            pageViewEvent.interaction = page.interaction;
            pageViewEvent.pageInteractionId =
                page.pageId + '-' + page.interaction;
            if (page.parentPageId !== undefined) {
                pageViewEvent.parentPageInteractionId =
                    page.parentPageId + '-' + (page.interaction - 1);
            }
        }
        return pageViewEvent;
    };
    PageManager.prototype.recordPageViewEvent = function (page) {
        this.record(constant_1.PAGE_VIEW_EVENT_TYPE, this.createPageViewEvent(page));
    };
    /**
     * Returns true when cookies should be used to store user ID and session ID.
     */
    PageManager.prototype.useCookies = function () {
        return navigator.cookieEnabled && this.config.allowCookies;
    };
    return PageManager;
}());
exports.PageManager = PageManager;
