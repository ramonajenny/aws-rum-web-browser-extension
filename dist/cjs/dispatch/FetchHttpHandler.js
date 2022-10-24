"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchHttpHandler = void 0;
var protocol_http_1 = require("@aws-sdk/protocol-http");
var querystring_builder_1 = require("@aws-sdk/querystring-builder");
var request_timeout_1 = require("./request-timeout");
var FetchHttpHandler = /** @class */ (function () {
    function FetchHttpHandler(_a) {
        var _b = _a === void 0 ? {} : _a, fetchFunction = _b.fetchFunction, requestTimeout = _b.requestTimeout;
        this.requestTimeout = requestTimeout;
        this.fetchFunction = fetchFunction;
    }
    FetchHttpHandler.prototype.destroy = function () {
        // Do nothing. TLS and HTTP/2 connection pooling is handled by the browser.
    };
    FetchHttpHandler.prototype.handle = function (request, _a) {
        var _b = _a === void 0 ? {} : _a, abortSignal = _b.abortSignal;
        var requestTimeoutInMs = this.requestTimeout;
        // if the request was already aborted, prevent doing extra work
        if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            var abortError = new Error('Request aborted');
            abortError.name = 'AbortError';
            return Promise.reject(abortError);
        }
        var path = request.path;
        if (request.query) {
            var queryString = (0, querystring_builder_1.buildQueryString)(request.query);
            if (queryString) {
                path += "?".concat(queryString);
            }
        }
        var port = request.port, method = request.method;
        var url = "".concat(request.protocol, "//").concat(request.hostname).concat(port ? ":".concat(port) : '').concat(path);
        // Request constructor doesn't allow GET/HEAD request with body
        // ref: https://github.com/whatwg/fetch/issues/551
        var body = method === 'GET' || method === 'HEAD' ? undefined : request.body;
        var requestOptions = {
            body: body,
            headers: new Headers(request.headers),
            method: method
        };
        // some browsers support abort signal
        if (typeof AbortController !== 'undefined') {
            requestOptions.signal = abortSignal;
        }
        var fetchRequest = new Request(url, requestOptions);
        var raceOfPromises = [
            this.fetchFunction.apply(window, [fetchRequest]).then(function (response) {
                var fetchHeaders = response.headers;
                var transformedHeaders = {};
                for (var _i = 0, _a = fetchHeaders.entries(); _i < _a.length; _i++) {
                    var pair = _a[_i];
                    transformedHeaders[pair[0]] = pair[1];
                }
                var hasReadableStream = response.body !== undefined;
                // Return the response with buffered body
                if (!hasReadableStream) {
                    return response.blob().then(function (body) { return ({
                        response: new protocol_http_1.HttpResponse({
                            headers: transformedHeaders,
                            statusCode: response.status,
                            body: body
                        })
                    }); });
                }
                // Return the response with streaming body
                return {
                    response: new protocol_http_1.HttpResponse({
                        headers: transformedHeaders,
                        statusCode: response.status,
                        body: response.body
                    })
                };
            }),
            (0, request_timeout_1.requestTimeout)(requestTimeoutInMs)
        ];
        if (abortSignal) {
            raceOfPromises.push(new Promise(function (resolve, reject) {
                abortSignal.onabort = function () {
                    var abortError = new Error('Request aborted');
                    abortError.name = 'AbortError';
                    reject(abortError);
                };
            }));
        }
        return Promise.race(raceOfPromises);
    };
    return FetchHttpHandler;
}());
exports.FetchHttpHandler = FetchHttpHandler;
