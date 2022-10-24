import { CredentialProvider, Credentials, HttpResponse } from '@aws-sdk/types';
import { HttpHandler } from '@aws-sdk/protocol-http';
import { PutRumEventsRequest } from './dataplane';
export declare type DataPlaneClientConfig = {
    fetchRequestHandler: HttpHandler;
    beaconRequestHandler: HttpHandler;
    endpoint: URL;
    region: string;
    credentials: CredentialProvider | Credentials;
};
export declare class DataPlaneClient {
    private config;
    private awsSigV4;
    constructor(config: DataPlaneClientConfig);
    sendFetch: (putRumEventsRequest: PutRumEventsRequest) => Promise<{
        response: HttpResponse;
    }>;
    sendBeacon: (putRumEventsRequest: PutRumEventsRequest) => Promise<{
        response: HttpResponse;
    }>;
}
