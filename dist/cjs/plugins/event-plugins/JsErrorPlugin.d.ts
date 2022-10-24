import { InternalPlugin } from '../InternalPlugin';
export declare const JS_ERROR_EVENT_PLUGIN_ID = "js-error";
export declare type PartialJsErrorPluginConfig = {
    stackTraceLength?: number;
    ignore?: (error: ErrorEvent | PromiseRejectionEvent) => boolean;
};
export declare type JsErrorPluginConfig = {
    stackTraceLength: number;
    ignore: (error: ErrorEvent | PromiseRejectionEvent) => boolean;
};
export declare class JsErrorPlugin extends InternalPlugin {
    private config;
    constructor(config?: PartialJsErrorPluginConfig);
    enable(): void;
    disable(): void;
    record(error: any): void;
    protected onload(): void;
    private eventHandler;
    private promiseRejectEventHandler;
    private recordJsErrorEvent;
    private addEventHandler;
    private removeEventHandler;
}
