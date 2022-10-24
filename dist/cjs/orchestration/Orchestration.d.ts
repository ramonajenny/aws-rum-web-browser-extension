import { Plugin } from "../plugins/Plugin";
import { TargetDomEvent } from "../plugins/event-plugins/DomEventPlugin";
import { ClientBuilder } from "../dispatch/Dispatch";
import { CredentialProvider, Credentials } from "@aws-sdk/types";
import { PageAttributes } from "../sessions/PageManager";
export declare enum TelemetryEnum {
    Errors = "errors",
    Performance = "performance",
    Interaction = "interaction",
    Http = "http"
}
export declare enum PageIdFormatEnum {
    Path = "PATH",
    Hash = "HASH",
    PathAndHash = "PATH_AND_HASH"
}
export declare type Telemetry = string | (string | object)[];
export declare type PageIdFormat = "PATH" | "HASH" | "PATH_AND_HASH";
export declare type PartialCookieAttributes = {
    unique?: boolean;
    domain?: string;
    path?: string;
    sameSite?: string;
    secure?: boolean;
};
export declare type PartialConfig = {
    allowCookies?: boolean;
    batchLimit?: number;
    clientBuilder?: ClientBuilder;
    cookieAttributes?: PartialCookieAttributes;
    sessionAttributes?: {
        [k: string]: string | number | boolean;
    };
    disableAutoPageView?: boolean;
    dispatchInterval?: number;
    enableRumClient?: boolean;
    enableXRay?: boolean;
    endpoint?: string;
    eventCacheSize?: number;
    eventPluginsToLoad?: Plugin[];
    guestRoleArn?: string;
    identityPoolId?: string;
    pageIdFormat?: PageIdFormat;
    pagesToExclude?: RegExp[];
    pagesToInclude?: RegExp[];
    recordResourceUrl?: boolean;
    routeChangeComplete?: number;
    routeChangeTimeout?: number;
    sessionEventLimit?: number;
    sessionLengthSeconds?: number;
    sessionSampleRate?: number;
    /**
     * Application owners think about data collection in terms of the categories
     * of data being collected. For example, JavaScript errors, page load
     * performance, user journeys and user interactions are data collection
     * categories. However, there is not a 1-1 mapping between data collection
     * categories and plugins.
     *
     * This configuration option allows application owners to define the data
     * categories they want to collect without needing to understand and
     * instantiate each plugin themselves. The toolkit will instantiate the
     * plugins which map to the selected categories.
     */
    telemetries?: Telemetry[];
    useBeacon?: boolean;
    userIdRetentionDays?: number;
};
export declare const defaultCookieAttributes: () => CookieAttributes;
export declare const defaultConfig: (cookieAttributes: CookieAttributes) => Config;
export declare type CookieAttributes = {
    unique: boolean;
    domain: string;
    path: string;
    sameSite: string;
    secure: boolean;
};
export declare type Config = {
    allowCookies: boolean;
    batchLimit: number;
    clientBuilder?: ClientBuilder;
    cookieAttributes: CookieAttributes;
    sessionAttributes: {
        [k: string]: string | number | boolean;
    };
    disableAutoPageView: boolean;
    dispatchInterval: number;
    enableRumClient: boolean;
    enableXRay: boolean;
    endpoint: string;
    endpointUrl: URL;
    eventCacheSize: number;
    eventPluginsToLoad: Plugin[];
    fetchFunction?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    guestRoleArn?: string;
    identityPoolId?: string;
    pageIdFormat: PageIdFormat;
    pagesToExclude: RegExp[];
    pagesToInclude: RegExp[];
    recordResourceUrl: boolean;
    retries: number;
    routeChangeComplete: number;
    routeChangeTimeout: number;
    sessionEventLimit: number;
    sessionLengthSeconds: number;
    sessionSampleRate: number;
    telemetries: Telemetry[];
    useBeacon: boolean;
    userIdRetentionDays: number;
};
/**
 * An orchestrator which (1) initializes cwr components and (2) provides the API for the application to interact
 * with the RUM web client. Depending on how the RUM web client was loaded, this class may be called directly, or
 * indirectly through the CommandQueue:
 * - If the client was loaded by an HTML script tag, Orchestration is called indirectly through the CommandQueue.
 * - If the client was loaded as an NPM module, Orchestration is called directly by the application.
 */
export declare class Orchestration {
    private pluginManager;
    private eventCache;
    private dispatchManager;
    private config;
    /**
     * Instantiate the CloudWatch RUM web client and begin monitoring the
     * application.
     *
     * This constructor may throw a TypeError if not correctly configured. In
     * production code, wrap calls to this constructor in a try/catch block so
     * that this does not impact the application.
     *
     * @param applicationId A globally unique identifier for the CloudWatch RUM
     * app monitor which monitors your application.
     * @param applicationVersion Your application's semantic version. If you do
     * not wish to use this field then add any placeholder, such as '0.0.0'.
     * @param region The AWS region of the app monitor. For example, 'us-east-1'
     * or 'eu-west-2'.
     * @param configCookieAttributes
     * @param partialConfig An application-specific configuration for the web
     * client.
     */
    constructor(applicationId: string, applicationVersion: string, region: string, { cookieAttributes: configCookieAttributes, ...partialConfig }?: PartialConfig);
    /**
     * Set the credential provider that will be used to authenticate with the
     * data plane service (AWS auth).
     *
     * @param credentials A provider of AWS credentials.
     */
    setAwsCredentials(credentials: Credentials | CredentialProvider): void;
    /**
     * Set custom session attributes to add them to all event metadata.
     *
     * @param payload object containing custom attribute data in the form of key, value pairs
     */
    addSessionAttributes(sessionAttributes: {
        [key: string]: string | boolean | number;
    }): void;
    /**
     * Add a telemetry plugin.
     *
     * @param plugin A plugin which adheres to the RUM web client's plugin interface.
     */
    addPlugin(plugin: Plugin): void;
    /**
     * Force the cllient to immediately dispatch events to the collector.
     */
    dispatch(): void;
    /**
     * Force the cllient to immediately dispatch events to the collector using a beacon.
     */
    dispatchBeacon(): void;
    /**
     * When enabled, the client records and dispatches events.
     */
    enable(): void;
    /**
     * When disabled, the client does not record or dispatch events.
     */
    disable(): void;
    /**
     * @param allow when {@code false}, the RUM web client will not store cookies or use localstorage.
     */
    allowCookies(allow: boolean): void;
    /**
     * Update the current page the user is interacting with.
     *
     * @param payload Can be string or PageAttributes object
     * If string, payload is pageId (The unique ID for the page within the application).
     * If PageAttributes, payload contains pageId as well as page attributes to include in events with pageId
     */
    recordPageView(payload: string | PageAttributes): void;
    /**
     * Record an error using the JS error plugin.
     *
     * @param error An ErrorEvent, Error or primitive.
     */
    recordError(error: any): void;
    /**
     * Update DOM plugin to record the (additional) provided DOM events.
     *
     * @param events
     */
    registerDomEvents(events: TargetDomEvent[]): void;
    private initEventCache;
    private initDispatch;
    private initPluginManager;
    private constructBuiltinPlugins;
    private getDataPlaneEndpoint;
    /**
     * Returns a functor which maps data collection categories to
     * instantiated plugins.
     */
    private telemetryFunctor;
}
