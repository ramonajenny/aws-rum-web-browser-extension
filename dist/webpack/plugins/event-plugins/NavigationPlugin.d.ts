import { InternalPlugin } from '../InternalPlugin';
export declare const NAVIGATION_EVENT_PLUGIN_ID = "navigation";
/**
 * This plugin records performance timing events generated during every page load/re-load activity.
 * Paint, resource and performance event types make sense only if all or none are included.
 * For RUM, these event types are inter-dependent. So they are recorded under one plugin.
 */
export declare class NavigationPlugin extends InternalPlugin {
    constructor();
    enable(): void;
    disable(): void;
    /**
     * Use the loadEventEnd field from window.performance to check if the website
     * has loaded already.
     *
     * @returns boolean
     */
    hasTheWindowLoadEventFired(): boolean;
    /**
     * Use Navigation timing Level 1 for all browsers by default -
     * https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing
     *
     * If browser provides support, use Navigation Timing Level 2 specification -
     * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
     *
     * Only the current document resource is included in the performance timeline;
     * there is only one PerformanceNavigationTiming object in the performance timeline.
     * https://www.w3.org/TR/navigation-timing-2/
     */
    eventListener: () => void;
    /**
     * W3C specification: https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface
     */
    performanceNavigationEventHandlerTimingLevel1: () => void;
    /**
     * W3C specification: https://www.w3.org/TR/navigation-timing-2/#bib-navigation-timing
     */
    performanceNavigationEventHandlerTimingLevel2: (entryData: any) => void;
    /**
     * loadEventEnd is populated as 0 if the web page has not loaded completely, even though LOAD has been fired.
     * As a result, if loadEventEnd is populated, we can ignore eventListener and record the data directly.
     * On the other hand, if not, we have to use eventListener to initializes PerformanceObserver.
     * PerformanceObserver will act as a second check for the final load timings.
     */
    protected onload(): void;
}
