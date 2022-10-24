import { MonkeyPatch, MonkeyPatched } from '../MonkeyPatched';
import { PartialHttpPluginConfig } from '../utils/http-utils';
export declare const XHR_PLUGIN_ID = "xhr";
/**
 * A plugin which initiates and records AWS X-Ray traces for XML HTTP requests (XMLHttpRequest).
 *
 * The XMLHttpRequest API is monkey patched using shimmer so all calls to XMLHttpRequest are intercepted. Only calls
 * to URLs which are on the allowlist and are not on the denylist are traced and recorded.
 *
 * The XHR events we use (i.e., onload, onerror, onabort, ontimeout) are only
 * supported by newer browsers. If we want to support older browsers we will
 * need to detect older browsers and use the onreadystatechange event.
 *
 * For example, the following sequence events occur for each case:
 *
 * Case 1: Request succeeds events
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 2, status = 200)
 * readystatechange (state = 3, status = 200)
 * readystatechange (state = 4, status = 200)
 * load
 * loadend
 *
 * Case 2: Request fails because of invalid domain or CORS failure
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 4, status = 0)
 * error
 * loadend
 *
 * Case 3: Request fails because of timeout
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 4, status = 0)
 * timeout
 * loadend
 *
 * Case 4: Request is aborted
 * -------------------------------
 * readystatechange (state = 1, status = 0)
 * loadstart
 * readystatechange (state = 2, status = 200)
 * readystatechange (state = 3, status = 200)
 * readystatechange (state = 4, status = 0)
 * abort
 * loadend
 *
 * See
 * - https://xhr.spec.whatwg.org/#event-handlers.
 * - https://xhr.spec.whatwg.org/#events
 */
export declare class XhrPlugin extends MonkeyPatched<XMLHttpRequest, 'send' | 'open'> {
    private config;
    private xhrMap;
    constructor(config?: PartialHttpPluginConfig);
    protected onload(): void;
    protected get patches(): MonkeyPatch<XMLHttpRequest, "open" | "send">[];
    private addXRayTraceIdHeader;
    private isTracingEnabled;
    private isSessionRecorded;
    private handleXhrLoadEvent;
    private handleXhrErrorEvent;
    private handleXhrAbortEvent;
    private handleXhrTimeoutEvent;
    private handleXhrDetailsOnError;
    private statusOk;
    private recordHttpEventWithResponse;
    private recordHttpEventWithError;
    private recordTraceEvent;
    private initializeTrace;
    private sendWrapper;
    private openWrapper;
}
