import { Http, Subsegment, XRayTraceEvent } from '../../events/xray-trace-event';
export declare const byteToHex: string[];
export declare const X_AMZN_TRACE_ID = "X-Amzn-Trace-Id";
export declare type PartialHttpPluginConfig = {
    logicalServiceName?: string;
    urlsToInclude?: RegExp[];
    urlsToExclude?: RegExp[];
    stackTraceLength?: number;
    recordAllRequests?: boolean;
    addXRayTraceIdHeader?: boolean;
};
export declare type HttpPluginConfig = {
    logicalServiceName: string;
    urlsToInclude: RegExp[];
    urlsToExclude: RegExp[];
    stackTraceLength: number;
    recordAllRequests: boolean;
    addXRayTraceIdHeader: boolean;
};
export declare const defaultConfig: HttpPluginConfig;
export declare const is4xx: (status: number) => boolean;
export declare const is5xx: (status: number) => boolean;
export declare const is429: (status: number) => boolean;
export declare const isUrlAllowed: (url: string, config: HttpPluginConfig) => boolean;
/**
 * Returns the current time, in floating point seconds in epoch time, accurate to milliseconds.
 */
export declare const epochTime: () => number;
export declare const createXRayTraceEventHttp: (input: RequestInfo | URL | string, init: RequestInit | undefined, traced: boolean) => Http;
export declare const createXRayTraceEvent: (name: string, startTime: number, http?: Http) => XRayTraceEvent;
export declare const createXRaySubsegment: (name: string, startTime: number, http?: Http) => Subsegment;
export declare const requestInfoToHostname: (request: Request | URL | string) => string;
export declare const addAmznTraceIdHeaderToInit: (init: RequestInit, traceId: string, segmentId: string) => void;
export declare const addAmznTraceIdHeaderToHeaders: (headers: Headers, traceId: string, segmentId: string) => void;
export declare const getAmznTraceIdHeaderValue: (traceId: string, segmentId: string) => string;
/**
 * Extracts an URL string from the fetch resource parameter.
 */
export declare const resourceToUrlString: (resource: Request | URL | string) => string;
