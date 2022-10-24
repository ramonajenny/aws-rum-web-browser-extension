import { MonkeyPatched } from '../MonkeyPatched';
export declare const PAGE_EVENT_PLUGIN_ID = "page-view";
export declare type Push = (data: any, title: string, url?: string | null) => void;
export declare type Replace = (data: any, title: string, url?: string | null) => void;
/**
 * A plugin which records page view transitions.
 *
 * When a session is initialized, the PageManager records the landing page. When
 * subsequent pages are viewed, this plugin updates the page.
 */
export declare class PageViewPlugin extends MonkeyPatched<History, 'pushState' | 'replaceState'> {
    constructor();
    protected onload(): void;
    protected get patches(): ({
        nodule: History;
        name: "pushState";
        wrapper: () => (original: Push) => Push;
    } | {
        nodule: History;
        name: "replaceState";
        wrapper: () => (original: Replace) => Replace;
    })[];
    private pushState;
    private replaceState;
    private addListener;
    private popstateListener;
    private recordPageView;
    private createIdForCurrentPage;
}
