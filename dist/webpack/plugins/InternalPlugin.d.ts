import { Plugin } from './Plugin';
import { PluginContext } from './types';
export declare abstract class InternalPlugin<UpdateType = unknown> implements Plugin<UpdateType> {
    static idPrefix: string;
    protected enabled: boolean;
    protected context: PluginContext;
    private readonly pluginId;
    constructor(name: string);
    static generatePluginId(name: string): string;
    load(context: PluginContext): void;
    record?<D>(data: D): void;
    update?(updateWith: UpdateType): void;
    abstract enable(): void;
    abstract disable(): void;
    getPluginId(): string;
    /**
     * Method to be run after the plugin loads the app context
     */
    protected onload?(): void;
}
