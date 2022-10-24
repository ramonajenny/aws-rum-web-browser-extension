import { InternalPlugin } from '../InternalPlugin';
export declare const DOM_EVENT_PLUGIN_ID = "dom-event";
export declare type TargetDomEvent = {
    /**
     * DOM event type (e.g., click, scroll, hover, etc.)
     */
    event: string;
    /**
     * DOM element ID.
     */
    elementId?: string;
    /**
     * DOM element map to identify one element attribute and its expected value
     */
    cssLocator?: string;
    /**
     * DOM element
     */
    element?: HTMLElement;
};
export declare type PartialDomEventPluginConfig = {
    interactionId?: (event: Event) => string;
    enableMutationObserver?: boolean;
    events?: TargetDomEvent[];
};
export declare type DomEventPluginConfig = {
    interactionId: (event: Event) => string;
    enableMutationObserver?: boolean;
    events: TargetDomEvent[];
};
export declare type ElementEventListener = {
    element: HTMLElement;
    eventListener: EventListener;
};
export declare class DomEventPlugin<UpdateType extends TargetDomEvent = TargetDomEvent> extends InternalPlugin<UpdateType[]> {
    enabled: boolean;
    private eventListenerMap;
    private config;
    private observer;
    constructor(config?: PartialDomEventPluginConfig);
    private static getElementInfo;
    enable(): void;
    disable(): void;
    update(events: UpdateType[]): void;
    protected onload(): void;
    private removeListeners;
    private addListeners;
    private getEventListener;
    private addEventHandler;
    private removeEventHandler;
    private observeDOMMutation;
}
