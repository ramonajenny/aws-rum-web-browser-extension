import { Config } from '../orchestration/Orchestration';
import { Session } from '../sessions/SessionManager';
export declare type RecordEvent = (type: string, eventData: object) => void;
export declare type RecordPageView = (pageId: string) => void;
export declare type GetSession = () => Session | undefined;
export declare type PluginContext = {
    applicationId: string;
    applicationVersion: string;
    config: Config;
    record: RecordEvent;
    recordPageView: RecordPageView;
    getSession: GetSession;
};
