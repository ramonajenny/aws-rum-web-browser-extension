import { MonkeyPatched } from '../MonkeyPatched';
import { PartialHttpPluginConfig } from '../utils/http-utils';
export declare const FETCH_PLUGIN_ID = "fetch";
/**
 * A plugin which initiates and records AWS X-Ray traces for fetch HTTP requests.
 *
 * The fetch API is monkey patched using shimmer so all calls to fetch are intercepted. Only calls to URLs which are
 * on the allowlist and are not on the denylist are traced and recorded.
 */
export declare class FetchPlugin extends MonkeyPatched<Window, 'fetch'> {
    private readonly config;
    constructor(config?: PartialHttpPluginConfig);
    protected get patches(): {
        nodule: Window;
        name: "fetch";
        wrapper: () => (original: typeof fetch) => typeof fetch;
    }[];
    protected onload(): void;
    private isTracingEnabled;
    private isSessionRecorded;
    private beginTrace;
    private addXRayTraceIdHeader;
    private endTrace;
    private appendErrorCauseFromPrimitive;
    private appendErrorCauseFromObject;
    private createHttpEvent;
    private recordHttpEventWithResponse;
    private recordHttpEventWithError;
    private fetch;
    private fetchWrapper;
}
