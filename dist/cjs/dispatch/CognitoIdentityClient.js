"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoIdentityClient = exports.fromCognitoIdentityPool = void 0;
var protocol_http_1 = require("@aws-sdk/protocol-http");
var METHOD = 'POST';
var CONTENT_TYPE = 'application/x-amz-json-1.1';
var PROTOCOL = 'https:';
// Targets
var GET_ID_TARGET = 'AWSCognitoIdentityService.GetId';
var GET_TOKEN_TARGET = 'AWSCognitoIdentityService.GetOpenIdToken';
var GET_CREDENTIALS_TARGET = 'AWSCognitoIdentityService.GetCredentialsForIdentity';
var fromCognitoIdentityPool = function (params) {
    return function () { return params.client.getCredentialsForIdentity(params.identityPoolId); };
};
exports.fromCognitoIdentityPool = fromCognitoIdentityPool;
var CognitoIdentityClient = /** @class */ (function () {
    function CognitoIdentityClient(config) {
        var _this = this;
        this.getId = function (request) { return __awaiter(_this, void 0, void 0, function () {
            var requestPayload, idRequest;
            return __generator(this, function (_a) {
                requestPayload = JSON.stringify(request);
                idRequest = this.getHttpRequest(GET_ID_TARGET, requestPayload);
                return [2 /*return*/, this.fetchRequestHandler
                        .handle(idRequest)
                        .then(function (_a) {
                        var response = _a.response;
                        return response.body
                            .getReader()
                            .read()
                            .then(function (_a) {
                            var value = _a.value;
                            return JSON.parse(String.fromCharCode.apply(null, value));
                        });
                    })
                        .catch(function () {
                        throw new Error('CWR: Failed to retrieve Cognito identity');
                    })];
            });
        }); };
        this.getOpenIdToken = function (request) { return __awaiter(_this, void 0, void 0, function () {
            var requestPayload, tokenRequest;
            return __generator(this, function (_a) {
                requestPayload = JSON.stringify(request);
                tokenRequest = this.getHttpRequest(GET_TOKEN_TARGET, requestPayload);
                return [2 /*return*/, this.fetchRequestHandler
                        .handle(tokenRequest)
                        .then(function (_a) {
                        var response = _a.response;
                        return response.body
                            .getReader()
                            .read()
                            .then(function (_a) {
                            var value = _a.value;
                            return JSON.parse(String.fromCharCode.apply(null, value));
                        });
                    })
                        .catch(function () {
                        throw new Error('CWR: Failed to retrieve Cognito OpenId token');
                    })];
            });
        }); };
        this.getCredentialsForIdentity = function (identityId) { return __awaiter(_this, void 0, void 0, function () {
            var requestPayload, credentialRequest;
            return __generator(this, function (_a) {
                requestPayload = JSON.stringify({ IdentityId: identityId });
                credentialRequest = this.getHttpRequest(GET_CREDENTIALS_TARGET, requestPayload);
                return [2 /*return*/, this.fetchRequestHandler
                        .handle(credentialRequest)
                        .then(function (_a) {
                        var response = _a.response;
                        return response.body
                            .getReader()
                            .read()
                            .then(function (_a) {
                            var value = _a.value;
                            var _b = JSON.parse(String.fromCharCode.apply(null, value)), IdentityId = _b.IdentityId, Credentials = _b.Credentials;
                            var AccessKeyId = Credentials.AccessKeyId, Expiration = Credentials.Expiration, SecretAccessKey = Credentials.SecretAccessKey, SessionToken = Credentials.SessionToken;
                            return {
                                identityId: IdentityId,
                                accessKeyId: AccessKeyId,
                                secretAccessKey: SecretAccessKey,
                                sessionToken: SessionToken,
                                expiration: new Date(Expiration * 1000)
                            };
                        });
                    })
                        .catch(function () {
                        throw new Error('CWR: Failed to retrieve credentials for Cognito identity');
                    })];
            });
        }); };
        this.getHttpRequest = function (target, payload) {
            return new protocol_http_1.HttpRequest({
                method: METHOD,
                headers: {
                    'content-type': CONTENT_TYPE,
                    'x-amz-target': target
                },
                protocol: PROTOCOL,
                hostname: _this.hostname,
                body: payload
            });
        };
        this.hostname = "cognito-identity.".concat(config.region, ".amazonaws.com");
        this.fetchRequestHandler = config.fetchRequestHandler;
    }
    return CognitoIdentityClient;
}());
exports.CognitoIdentityClient = CognitoIdentityClient;
