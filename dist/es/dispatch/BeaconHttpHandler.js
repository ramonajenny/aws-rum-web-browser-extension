import { HttpResponse } from '@aws-sdk/protocol-http';
import { buildQueryString } from '@aws-sdk/querystring-builder';
var BeaconHttpHandler = /** @class */ (function () {
    function BeaconHttpHandler() {
    }
    BeaconHttpHandler.prototype.handle = function (request) {
        var queued = this.sendBeacon(request);
        return new Promise(function (resolve, reject) {
            if (queued) {
                resolve({
                    response: new HttpResponse({ statusCode: 200 })
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
            var queryString = buildQueryString(signedRequest.query);
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
export { BeaconHttpHandler };
