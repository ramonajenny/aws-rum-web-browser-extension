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
import { CognitoIdentityClient, fromCognitoIdentityPool } from './CognitoIdentityClient';
import { FetchHttpHandler } from '@aws-sdk/fetch-http-handler';
import { CRED_KEY, CRED_RENEW_MS } from '../utils/constants';
var EnhancedAuthentication = /** @class */ (function () {
    function EnhancedAuthentication(config) {
        var _this = this;
        /**
         * A credential provider which provides AWS credentials for an anonymous
         * (guest) user. These credentials are retrieved from the first successful
         * provider in a chain.
         *
         * Credentials are stored in and retrieved from localStorage. This prevents the client from having to
         * re-authenticate every time the client loads, which (1) improves the performance of the RUM web client and (2)
         * reduces the load on AWS services Cognito and STS.
         *
         * While storing credentials in localStorage puts the credential at greater risk of being leaked through an
         * XSS attack, there is no impact if the credentials were to be leaked. This is because (1) the identity pool ID
         * and role ARN are public and (2) the credentials are for an anonymous (guest) user.
         *
         * Regarding (1), the identity pool ID and role ARN are, by necessity, public. These identifiers are shipped with
         * each application as part of Cognito's Basic (Classic) authentication flow. The identity pool ID and role ARN
         * are not secret.
         *
         * Regarding (2), the authentication chain implemented in this file only supports anonymous (guest)
         * authentication. When the Cognito authentication flow is executed, {@code AnonymousCognitoCredentialsProvider}
         * does not communicate with a login provider such as Amazon, Facebook or Google. Instead, it relies on (a) the
         * identity pool supporting unauthenticated identities and (b) the IAM role policy enabling login through the
         * identity pool. If the identity pool does not support unauthenticated identities, this authentication chain
         * will not succeed.
         *
         * Taken together, (1) and (2) mean that if these temporary credentials were to be leaked, the leaked credentials
         * would not allow a bad actor to gain access to anything which they did not already have public access to.
         *
         * Implements CredentialsProvider = Provider<Credentials>
         */
        this.ChainAnonymousCredentialsProvider = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.AnonymousCredentialsProvider()
                        .catch(this.AnonymousStorageCredentialsProvider)
                        .catch(this.AnonymousCognitoCredentialsProvider)];
            });
        }); };
        /**
         * Provides credentials for an anonymous (guest) user. These credentials are read from a member variable.
         *
         * Implements CredentialsProvider = Provider<Credentials>
         */
        this.AnonymousCredentialsProvider = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.renewCredentials()) {
                            // The credentials have expired.
                            return reject();
                        }
                        resolve(_this.credentials);
                    })];
            });
        }); };
        /**
         * Provides credentials for an anonymous (guest) user. These credentials are read from localStorage.
         *
         * Implements CredentialsProvider = Provider<Credentials>
         */
        this.AnonymousStorageCredentialsProvider = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var credentials;
                        try {
                            credentials = JSON.parse(localStorage.getItem(CRED_KEY));
                        }
                        catch (e) {
                            // Error decoding or parsing the cookie -- abort
                            reject();
                        }
                        // The expiration property of Credentials has a date type. Because the date was serialized as a string,
                        // we need to convert it back into a date, otherwise the AWS SDK signing middleware
                        // (@aws-sdk/middleware-signing) will throw an exception and no credentials will be returned.
                        credentials.expiration = new Date(credentials.expiration);
                        _this.credentials = credentials;
                        if (_this.renewCredentials()) {
                            // The credentials have expired.
                            return reject();
                        }
                        _this.credentials = credentials;
                        resolve(credentials);
                    })];
            });
        }); };
        /**
         * Provides credentials for an anonymous (guest) user. These credentials are retrieved from Cognito's enhanced
         * authflow.
         *
         * See https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
         *
         * Implements CredentialsProvider = Provider<Credentials>
         */
        this.AnonymousCognitoCredentialsProvider = function () { return __awaiter(_this, void 0, void 0, function () {
            var credentialProvider;
            var _this = this;
            return __generator(this, function (_a) {
                credentialProvider = fromCognitoIdentityPool({
                    client: this.cognitoIdentityClient,
                    identityPoolId: this.config.identityPoolId
                });
                return [2 /*return*/, credentialProvider().then(function (credentials) {
                        _this.credentials = credentials;
                        try {
                            localStorage.setItem(CRED_KEY, JSON.stringify(credentials));
                        }
                        catch (e) {
                            // Ignore
                        }
                        return credentials;
                    })];
            });
        }); };
        var region = config.identityPoolId.split(':')[0];
        this.config = config;
        this.cognitoIdentityClient = new CognitoIdentityClient({
            fetchRequestHandler: new FetchHttpHandler(),
            region: region
        });
    }
    EnhancedAuthentication.prototype.renewCredentials = function () {
        if (!this.credentials || !this.credentials.expiration) {
            return true;
        }
        var renewalTime = new Date(this.credentials.expiration.getTime() - CRED_RENEW_MS);
        return new Date() > renewalTime;
    };
    return EnhancedAuthentication;
}());
export { EnhancedAuthentication };
