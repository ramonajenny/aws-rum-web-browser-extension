import { MonkeyPatched } from '../plugins/MonkeyPatched';
import { Config } from '../orchestration/Orchestration';
import { RecordEvent } from '../plugins/types';
import { PageManager } from './PageManager';
declare type Patching = Pick<XMLHttpRequest & Window, 'fetch' | 'send'>;
/**
 * Maintains the core logic for virtual page load timing functionality.
 * (1) Holds all virtual page load timing related resources
 * (2) Intercepts outgoing XMLHttpRequests and Fetch requests and listens for DOM changes
 * (3) Records virtual page load
 */
export declare class VirtualPageLoadTimer extends MonkeyPatched<Patching, 'fetch' | 'send'> {
    protected get patches(): ({
        nodule: Patching;
        name: "send";
        wrapper: any;
    } | {
        nodule: Patching;
        name: "fetch";
        wrapper: any;
    })[];
    /** Latest interaction time by user on the document */
    latestInteractionTime: number;
    /** Unique ID of virtual page load periodic checker. */
    private periodicCheckerId;
    /** Unique ID of virtual page load timeout checker. */
    private timeoutCheckerId;
    /** Observer to liten for DOM changes. */
    private domMutationObserver;
    /** Set to hold outgoing XMLHttpRequests for current virtual page. */
    private ongoingRequests;
    /** Buffer to hold outgoing XMLHttpRequests before new page is created. */
    private requestBuffer;
    /** Indicate the number of active Fetch requests. */
    private fetchCounter;
    /** Indicate the status of the current Page */
    private isPageLoaded;
    /** Indicate the current page's load end time value. */
    private latestEndTime;
    private config;
    private pageManager;
    private readonly record;
    constructor(pageManager: PageManager, config: Config, record: RecordEvent);
    /** Initializes timing related resources for current page. */
    startTiming(): void;
    private sendWrapper;
    private recordXhr;
    private removeXhr;
    /**
     * Removes the current event from either requestBuffer or ongoingRequests set.
     *
     * @param event
     */
    private endTracking;
    private fetch;
    /**
     * Increment the fetch counter in PageManager when fetch is beginning
     */
    private fetchWrapper;
    private decrementFetchCounter;
    /**
     * Checks whether the virtual page is still being loaded.
     * If completed:
     * (1) Clear the timers
     * (2) Record data using NavigationEvent
     * (3) Indicate current page has finished loading
     */
    private checkLoadStatus;
    /** Clears timers and disconnects observer to stop page timing. */
    private declareTimeout;
    private resetInterval;
    private moveItemsFromBuffer;
    private recordRouteChangeNavigationEvent;
    private updateLatestInteractionTime;
}
export {};
