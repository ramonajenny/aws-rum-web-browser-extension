"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconHttpHandler = void 0;
var protocol_http_1 = require("@aws-sdk/protocol-http");
var querystring_builder_1 = require("@aws-sdk/querystring-builder");
var BeaconHttpHandler = /** @class */ (function () {
    function BeaconHttpHandler() {
    }
    BeaconHttpHandler.prototype.handle = function (request) {
        var queued = this.sendBeacon(request);
        return new Promise(function (resolve, reject) {
            if (queued) {
                resolve({
                    response: new protocol_http_1.HttpResponse({ statusCode: 200 })
                });
            }
            else {
                reject();
            }
        });
    };
    BeaconHttpHandler.prototype.sendBeacon = function (signedRequest) {
        var path = signedRequest.path;
        if (signedRequest.query) {
            var queryString = (0, querystring_builder_1.buildQueryString)(signedRequest.query);
            if (queryString) {
                path += "?".concat(queryString);
            }
        }
        var port = signedRequest.port;
        var url = "".concat(signedRequest.protocol, "//").concat(signedRequest.hostname).concat(port ? ":".concat(port) : '').concat(path);
        return navigator.sendBeacon(url, signedRequest.body);
    };
    return BeaconHttpHandler;
}());
exports.BeaconHttpHandler = BeaconHttpHandler;
