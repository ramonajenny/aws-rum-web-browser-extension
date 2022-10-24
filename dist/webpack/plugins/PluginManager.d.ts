import { Plugin } from './Plugin';
import { PluginContext } from './types';
/**
 * The plugin manager maintains a list of plugins
 * and notifies plugins of configuration or lifecycle changes.
 */
export declare class PluginManager {
    private readonly context;
    private plugins;
    constructor(context: PluginContext);
    /**
     * Add an event plugin to PluginManager and initialize the plugin.
     *
     * @param plugin The plugin which adheres to the RUM web client's plugin interface.
     */
    addPlugin(plugin: Plugin): void;
    /**
     * Update an event plugin
     *
     * @param pluginId
     * @param updateWith The config to update the plugin with.
     */
    updatePlugin<O>(pluginId: string, updateWith: O): void;
    /**
     * Enable all event plugins.
     */
    enable(): void;
    /**
     * Disable all event plugins.
     */
    disable(): void;
    /**
     * Return if a plugin exists.
     *
     * @param pluginId a unique identifier for the plugin
     */
    hasPlugin(pluginId: string): boolean;
    /**
     * Manually record data using a plugin.
     *
     * @param pluginId The unique identifier for the plugin being configured.
     * @param data The data to be recorded by the plugin.
     */
    record(pluginId: string, data: any): void;
    private getPlugin;
}
