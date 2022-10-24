import { HttpHandler } from '@aws-sdk/protocol-http';
import { Credentials } from '@aws-sdk/types';
interface CognitoProviderParameters {
    /**
     * The unique identifier for the identity pool from which an identity should
     * be retrieved or generated.
     */
    identityPoolId: string;
    /**
     * The SDK client with which the credential provider will contact the Amazon
     * Cognito service.
     */
    client: CognitoIdentityClient;
}
export declare const fromCognitoIdentityPool: (params: CognitoProviderParameters) => (() => Promise<Credentials>);
export declare type CognitoIdentityClientConfig = {
    fetchRequestHandler: HttpHandler;
    region?: string;
};
export declare class CognitoIdentityClient {
    private fetchRequestHandler;
    private hostname;
    constructor(config: CognitoIdentityClientConfig);
    getId: (request: {
        IdentityPoolId: string;
    }) => Promise<any>;
    getOpenIdToken: (request: {
        IdentityId: string;
    }) => Promise<any>;
    getCredentialsForIdentity: (identityId: string) => Promise<Credentials>;
    private getHttpRequest;
}
export {};
