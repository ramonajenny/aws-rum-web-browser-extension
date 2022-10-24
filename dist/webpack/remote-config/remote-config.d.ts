import { AwsRumClientInit as RemoteConfig } from '../CommandQueue';
import { PartialConfig } from '../orchestration/Orchestration';
export declare type FileConfig = {
    clientConfig?: ClientConfig;
};
declare type ClientConfig = {
    identityPoolId?: string;
    telemetries?: string[];
    enableRumClient?: boolean;
    sessionSampleRate?: number;
    guestRoleArn?: string;
    allowCookies?: boolean;
};
export declare const getRemoteConfig: (awsRum: RemoteConfig) => Promise<PartialConfig>;
export {};
