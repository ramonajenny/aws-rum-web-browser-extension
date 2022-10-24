import { CredentialProvider, Credentials, HttpResponse } from '@aws-sdk/types';
import { EventCache } from '../event-cache/EventCache';
import { DataPlaneClient } from './DataPlaneClient';
import { Config } from '../orchestration/Orchestration';
export declare type ClientBuilder = (endpoint: URL, region: string, credentials: CredentialProvider | Credentials) => DataPlaneClient;
export declare class Dispatch {
    private region;
    private endpoint;
    private eventCache;
    private rum;
    private enabled;
    private dispatchTimerId;
    private buildClient;
    private config;
    constructor(region: string, endpoint: URL, eventCache: EventCache, config: Config);
    /**
     * Dispatch will send requests to data plane.
     */
    enable(): void;
    /**
     * Dispatch will not send requests to data plane.
     */
    disable(): void;
    /**
     * Set the authentication token that will be used to authenticate with the
     * data plane service (AWS auth).
     *
     * @param credentials A set of AWS credentials from the application's authflow.
     */
    setAwsCredentials(credentialProvider: Credentials | CredentialProvider): void;
    /**
     * Send meta data and events to the AWS RUM data plane service via fetch.
     */
    dispatchFetch: () => Promise<{
        response: HttpResponse;
    } | undefined>;
    /**
     * Send meta data and events to the AWS RUM data plane service via beacon.
     */
    dispatchBeacon: () => Promise<{
        response: HttpResponse;
    } | undefined>;
    /**
     * Send meta data and events to the AWS RUM data plane service via fetch.
     *
     * Returns undefined on failure.
     */
    dispatchFetchFailSilent: () => Promise<{
        response: HttpResponse;
    } | void>;
    /**
     * Send meta data and events to the AWS RUM data plane service via beacon.
     *
     * Returns undefined on failure.
     */
    dispatchBeaconFailSilent: () => Promise<{
        response: HttpResponse;
    } | void>;
    /**
     * Automatically dispatch cached events.
     */
    startDispatchTimer(): void;
    /**
     * Stop automatically dispatching cached events.
     */
    stopDispatchTimer(): void;
    private doRequest;
    private createRequest;
    private handleReject;
    /**
     * The default method for creating data plane service clients.
     *
     * @param endpoint Service endpoint.
     * @param region  Service region.
     * @param credentials AWS credentials.
     */
    private defaultClientBuilder;
}
