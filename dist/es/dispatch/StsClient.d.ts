import { CognitoIdentityClientConfig } from './CognitoIdentityClient';
export interface STSSendRequest {
    RoleArn: string;
    RoleSessionName: string;
    WebIdentityToken: string;
}
export declare class StsClient {
    private fetchRequestHandler;
    private hostname;
    constructor(config: CognitoIdentityClientConfig);
    assumeRoleWithWebIdentity: (request: STSSendRequest) => Promise<any>;
}
