import { HttpHandler, HttpRequest, HttpResponse } from '@aws-sdk/protocol-http';
export declare type BackoffFunction = (retry: number) => number;
/**
 * An HttpHandler which wraps other HttpHandlers to retry requests.
 *
 * Requests will be retried if (1) there is an error (e.g., with the network or
 * credentials) and the promise rejects, or (2) the response status is not 2xx.
 */
export declare class RetryHttpHandler implements HttpHandler {
    private handler;
    private retries;
    private backoff;
    constructor(handler: HttpHandler, retries: number, backoff?: BackoffFunction);
    handle(request: HttpRequest): Promise<{
        response: HttpResponse;
    }>;
    private sleep;
    private isStatusCode2xx;
}
