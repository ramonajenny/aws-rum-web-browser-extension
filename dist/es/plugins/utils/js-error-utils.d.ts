import { JSErrorEvent } from '../../events/js-error-event';
export declare const isErrorPrimitive: (error: any) => boolean;
export declare const errorEventToJsErrorEvent: (errorEvent: ErrorEvent, stackTraceLength: number) => JSErrorEvent;
