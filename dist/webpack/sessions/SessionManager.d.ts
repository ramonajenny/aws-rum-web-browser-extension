import { Config } from "../orchestration/Orchestration";
import { Page, PageManager } from "./PageManager";
import { AppMonitorDetails } from "../dispatch/dataplane";
export declare const NIL_UUID = "00000000-0000-0000-0000-000000000000";
export declare const UNKNOWN = "unknown";
export declare const DESKTOP_DEVICE_TYPE = "desktop";
export declare const WEB_PLATFORM_TYPE = "web";
export declare const SESSION_START_EVENT_TYPE = "com.amazon.rum.session_start_event";
export declare const RUM_SESSION_START = "rum_session_start";
export declare const RUM_SESSION_EXPIRE = "rum_session_expire";
export declare type RecordSessionInitEvent = (session: Session, type: string, eventData: object) => void;
export declare type Session = {
    sessionId: string;
    record: boolean;
    eventCount: number;
    page?: Page;
};
export declare type Attributes = {
    browserLanguage: string;
    browserName: string;
    browserVersion: string;
    osName: string;
    osVersion: string;
    deviceType: string;
    platformType: string;
    domain: string;
    [k: string]: string | number | boolean;
};
/**
 * The session handler handles user id and session id.
 *
 * A session is the {user id, session id} tuple which groups events that occur on a single browser over a continuous
 * period of time. A session begins when no session exists or the last session has expired. If user id does not exist,
 * session handler will assign a new one and store it in cookie. If session id does not exist or has expired, session
 * handler will assign a new one and store it in cookie. Session handler detects user interactions and updates session
 * id expiration time.
 */
export declare class SessionManager {
    private pageManager;
    private appMonitorDetails;
    private userExpiry;
    private sessionExpiry;
    private userId;
    private session;
    private config;
    private record;
    private attributes;
    constructor(appMonitorDetails: AppMonitorDetails, config: Config, record: RecordSessionInitEvent, pageManager: PageManager);
    /**
     * Returns the session ID. If no session ID exists, one will be created.
     */
    getSession(): Session;
    getAttributes(): Attributes;
    /**
     * Adds custom session attributes to the session's attributes
     *
     * @param sessionAttributes object containing custom attribute data in the form of key, value pairs
     */
    addSessionAttributes(sessionAttributes: {
        [k: string]: string | number | boolean;
    }): void;
    getUserId(): string;
    incrementSessionEventCount(): void;
    private initializeUser;
    private createOrRenewSessionCookie;
    private createOrRenewUserCookie;
    private getUserIdCookie;
    private getSessionFromCookie;
    private storeSessionAsCookie;
    private createSession;
    private renewSession;
    private collectAttributes;
    /**
     * Returns true when cookies should be used to store user ID and session ID.
     */
    private useCookies;
    /**
     * Returns {@code true} when the session has been selected to be recorded.
     */
    private sample;
    private sessionCookieName;
}
