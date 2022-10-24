import { AwsRumClientInit } from './CommandQueue';
declare global {
    interface Window {
        AwsNexusTelemetry: AwsRumClientInit;
        AwsRumClient: AwsRumClientInit;
    }
}
