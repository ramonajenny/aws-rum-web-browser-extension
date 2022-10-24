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
exports.RetryHttpHandler = void 0;
/**
 * An HttpHandler which wraps other HttpHandlers to retry requests.
 *
 * Requests will be retried if (1) there is an error (e.g., with the network or
 * credentials) and the promise rejects, or (2) the response status is not 2xx.
 */
var RetryHttpHandler = /** @class */ (function () {
    function RetryHttpHandler(handler, retries, backoff) {
        if (backoff === void 0) { backoff = function (n) { return n * 2000; }; }
        this.isStatusCode2xx = function (statusCode) {
            return statusCode >= 200 && statusCode < 300;
        };
        this.handler = handler;
        this.retries = retries;
        this.backoff = backoff;
    }
    RetryHttpHandler.prototype.handle = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var retriesLeft, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retriesLeft = this.retries;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.handler.handle(request)];
                    case 3:
                        response = _a.sent();
                        if (this.isStatusCode2xx(response.response.statusCode)) {
                            return [2 /*return*/, response];
                        }
                        throw new Error("".concat(response.response.statusCode));
                    case 4:
                        e_1 = _a.sent();
                        if (!retriesLeft) {
                            throw e_1;
                        }
                        retriesLeft--;
                        return [4 /*yield*/, this.sleep(this.backoff(this.retries - retriesLeft))];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RetryHttpHandler.prototype.sleep = function (milliseconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        return setTimeout(resolve, milliseconds);
                    })];
            });
        });
    };
    return RetryHttpHandler;
}());
exports.RetryHttpHandler = RetryHttpHandler;
