import { PartialConfig } from './orchestration/Orchestration';
export declare type CommandFunction = (payload?: any) => void;
/**
 * An AWS RUM Client command.
 */
export declare type Command = {
    c: string;
    p: any;
};
/**
 * The global configuration object is defined in the loader script, so we cannot trust its types.
 */
export declare type AwsRumClientInit = {
    q: [];
    n: string;
    i: string;
    a?: string;
    r: string;
    v: string;
    c?: PartialConfig;
    u?: string;
};
/**
 * A utility for collecting telemetry from JavaScript applications.
 *
 * For example:
 * - Pages visited (user workflow)
 * - Page load time
 * - DOM events
 */
export declare class CommandQueue {
    private orchestration;
    private commandHandlerMap;
    /**
     * Initialize CWR and execute commands which were queued before initialization.
     *
     * If a URL for a remote config file has been provided, the remote config
     * will first be fetched. If this attempt fails, an exception will be thrown
     * and CWR will not be initialized.
     *
     * @param awsRum The CWR application information and configuration options.
     */
    init(awsRum: AwsRumClientInit): Promise<void>;
    /**
     * Add a command to the command queue.
     */
    push(command: Command): Promise<void>;
    private initCwr;
}
