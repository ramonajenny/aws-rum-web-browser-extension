import { getRandomValues } from '../../utils/random';
// All one-byte hex strings from 0x00 to 0xff.
export var byteToHex = [];
for (var i = 0; i < 256; i++) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
export var X_AMZN_TRACE_ID = 'X-Amzn-Trace-Id';
export var defaultConfig = {
    logicalServiceName: 'rum.aws.amazon.com',
    urlsToInclude: [/.*/],
    urlsToExclude: [
        // Cognito endpoints https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html
        /cognito\-identity\.([^\.]*\.)?amazonaws\.com/,
        // STS endpoints https://docs.aws.amazon.com/general/latest/gr/sts.html
        /sts\.([^\.]*\.)?amazonaws\.com/
    ],
    stackTraceLength: 200,
    recordAllRequests: false,
    addXRayTraceIdHeader: false
};
export var is4xx = function (status) {
    return Math.floor(status / 100) === 4;
};
export var is5xx = function (status) {
    return Math.floor(status / 100) === 5;
};
export var is429 = function (status) {
    return status === 429;
};
export var isUrlAllowed = function (url, config) {
    var include = config.urlsToInclude.some(function (urlPattern) {
        return urlPattern.test(url);
    });
    var exclude = config.urlsToExclude.some(function (urlPattern) {
        return urlPattern.test(url);
    });
    return include && !exclude;
};
/**
 * Returns the current time, in floating point seconds in epoch time, accurate to milliseconds.
 */
export var epochTime = function () {
    return Date.now() / 1000;
};
export var createXRayTraceEventHttp = function (input, init, traced) {
    var http = { request: {} };
    http.request.method = (init === null || init === void 0 ? void 0 : init.method) ? init.method : 'GET';
    http.request.traced = traced;
    http.request.url = resourceToUrlString(input);
    return http;
};
export var createXRayTraceEvent = function (name, startTime, http) {
    var traceEvent = {
        version: '1.0.0',
        name: name,
        origin: 'AWS::RUM::AppMonitor',
        id: generateSegmentId(),
        start_time: startTime,
        trace_id: generateTraceId(),
        end_time: undefined,
        subsegments: [],
        in_progress: false
    };
    if (http) {
        traceEvent.http = http;
    }
    return traceEvent;
};
export var createXRaySubsegment = function (name, startTime, http) {
    var subsegment = {
        id: generateSegmentId(),
        name: name,
        start_time: startTime,
        end_time: undefined,
        in_progress: false,
        namespace: name.endsWith('amazonaws.com') ? 'aws' : 'remote'
    };
    if (http) {
        subsegment.http = http;
    }
    return subsegment;
};
export var requestInfoToHostname = function (request) {
    try {
        if (request.hostname) {
            return request.hostname;
        }
        else if (request.url) {
            return new URL(request.url).hostname;
        }
        else {
            return new URL(request.toString()).hostname;
        }
    }
    catch (e) {
        // The URL could not be parsed. This library's convention is to fail
        // silently to limit the risk of impacting the application being
        // monitored.  We will use the hostname of the current page instead.
        return "".concat(window.location.hostname, ".chrome");
    }
};
export var addAmznTraceIdHeaderToInit = function (init, traceId, segmentId) {
    if (!init.headers) {
        init.headers = {};
    }
    init.headers[X_AMZN_TRACE_ID] = getAmznTraceIdHeaderValue(traceId, segmentId);
};
export var addAmznTraceIdHeaderToHeaders = function (headers, traceId, segmentId) {
    headers.set(X_AMZN_TRACE_ID, getAmznTraceIdHeaderValue(traceId, segmentId));
};
export var getAmznTraceIdHeaderValue = function (traceId, segmentId) {
    return 'Root=' + traceId + ';Parent=' + segmentId + ';Sampled=1';
};
/**
 * Extracts an URL string from the fetch resource parameter.
 */
export var resourceToUrlString = function (resource) {
    return resource.url
        ? resource.url
        : resource.toString();
};
/**
 * Generate a globally unique trace ID.
 *
 * See https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html
 *
 * @returns a trace id with the form '1-[unix epoch time in 8 hex digits]-[random in 24 hex digits]'
 */
var generateTraceId = function () {
    return "1-".concat(hexTime(), "-").concat(guid());
};
/**
 * Generate a segment ID that is unique within a trace.
 *
 * See https://docs.aws.amazon.com/xray/latest/devguide/xray-api-sendingdata.html
 *
 * @returns a segment id, which is 16 random hex digits
 */
var generateSegmentId = function () {
    var randomBytes = new Uint8Array(8);
    getRandomValues(randomBytes);
    return uint8ArrayToHexString(randomBytes);
};
var hexTime = function () {
    return Math.floor(Date.now() / 1000).toString(16);
};
var guid = function () {
    var randomBytes = new Uint8Array(12);
    getRandomValues(randomBytes);
    return uint8ArrayToHexString(randomBytes);
};
var uint8ArrayToHexString = function (bytes) {
    var hexString = '';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (var i = 0; i < bytes.length; i++) {
        hexString += byteToHex[bytes[i]];
    }
    return hexString;
};
