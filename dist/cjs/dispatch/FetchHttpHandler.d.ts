import { HttpHandler, HttpRequest, HttpResponse } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions } from '@aws-sdk/types';
/**
 * Represents the http options that can be passed to a browser http client.
 */
export interface FetchHttpHandlerOptions {
    /**
     * The number of milliseconds a request can take before being automatically
     * terminated.
     */
    requestTimeout?: number;
    /**
     * The function to use to execute the fetch request.
     *
     * Defaults to window.fetch if not provided.
     */
    fetchFunction?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
export declare class FetchHttpHandler implements HttpHandler {
    private readonly requestTimeout?;
    private fetchFunction?;
    constructor({ fetchFunction, requestTimeout }?: FetchHttpHandlerOptions);
    destroy(): void;
    handle(request: HttpRequest, { abortSignal }?: HttpHandlerOptions): Promise<{
        response: HttpResponse;
    }>;
}
