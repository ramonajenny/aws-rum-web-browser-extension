import { Config } from '../orchestration/Orchestration';
import { RecordEvent } from '../plugins/types';
export declare type Page = {
    pageId: string;
    interaction: number;
    parentPageId?: string;
    start: number;
};
export declare type Attributes = {
    title: string;
    pageId: string;
    parentPageId?: string;
    interaction?: number;
    pageTags?: string[];
    [key: string]: string | number | boolean | string[] | undefined;
};
export declare type PageAttributes = {
    pageId: string;
    pageTags?: string[];
    pageAttributes?: {
        [key: string]: string | number | boolean | undefined;
    };
};
/**
 * The page manager keeps the state of the current page and interaction level.
 *
 * A page is a unique view (user interface) of the application. For 'multi page' applications (i.e., 'classic' web
 * applications that have multiple html files), the page changes when the user nagivates to a new web page. For
 * 'single page' applications (i.e., 'ajax' web applications that have a single html file), the page changes when (1)
 * the popstate event emitted, or (2) the application indicates a new page has loaded using the RUM agent API.
 *
 * The interaction level is the order of a page in the sequence of pages sorted by the time they were viewed.
 */
export declare class PageManager {
    private config;
    private record;
    private page;
    private resumed;
    private attributes;
    private virtualPageLoadTimer;
    private TIMEOUT;
    /**
     * A flag which keeps track of whether or not cookies have been enabled.
     *
     * We will only record the interaction (i.e., depth and parent) after
     * cookies have been enabled once.
     */
    private recordInteraction;
    constructor(config: Config, record: RecordEvent);
    getPage(): Page | undefined;
    getAttributes(): Attributes | undefined;
    resumeSession(pageId: string, interaction: number): void;
    recordPageView(payload: string | PageAttributes): void;
    private createResumedPage;
    private createNextPage;
    private createLandingPage;
    private collectAttributes;
    private createPageViewEvent;
    private recordPageViewEvent;
    /**
     * Returns true when cookies should be used to store user ID and session ID.
     */
    private useCookies;
}
