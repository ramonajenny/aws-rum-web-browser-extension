import { HttpHandler, HttpRequest, HttpResponse } from '@aws-sdk/protocol-http';
export declare class BeaconHttpHandler implements HttpHandler {
    handle(request: HttpRequest): Promise<{
        response: HttpResponse;
    }>;
    private sendBeacon;
}
