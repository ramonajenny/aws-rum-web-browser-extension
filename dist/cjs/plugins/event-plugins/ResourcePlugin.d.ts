import { InternalPlugin } from '../InternalPlugin';
import { ResourceType } from '../../utils/common-utils';
export declare const RESOURCE_EVENT_PLUGIN_ID = "resource";
export declare type PartialResourcePluginConfig = {
    eventLimit?: number;
    recordAllTypes?: ResourceType[];
    sampleTypes?: ResourceType[];
};
export declare type ResourcePluginConfig = {
    eventLimit: number;
    recordAllTypes: ResourceType[];
    sampleTypes: ResourceType[];
};
export declare const defaultConfig: {
    eventLimit: number;
    recordAllTypes: ResourceType[];
    sampleTypes: ResourceType[];
};
/**
 * This plugin records resource performance timing events generated during every page load/re-load.
 */
export declare class ResourcePlugin extends InternalPlugin {
    private config;
    constructor(config?: PartialResourcePluginConfig);
    enable(): void;
    disable(): void;
    resourceEventListener: (event: Event) => void;
    recordResourceEvent: (entryData: PerformanceResourceTiming) => void;
    protected onload(): void;
}
