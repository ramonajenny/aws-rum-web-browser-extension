"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
var InternalPlugin_1 = require("./InternalPlugin");
/**
 * The plugin manager maintains a list of plugins
 * and notifies plugins of configuration or lifecycle changes.
 */
var PluginManager = /** @class */ (function () {
    function PluginManager(context) {
        this.context = context;
        this.plugins = new Map();
    }
    /**
     * Add an event plugin to PluginManager and initialize the plugin.
     *
     * @param plugin The plugin which adheres to the RUM web client's plugin interface.
     */
    PluginManager.prototype.addPlugin = function (plugin) {
        var pluginId = plugin.getPluginId();
        if (this.hasPlugin(pluginId)) {
            throw new Error("Plugin \"".concat(pluginId, "\" already defined in the PluginManager"));
        }
        this.plugins.set(pluginId, plugin);
        // initialize plugin
        plugin.load(this.context);
    };
    /**
     * Update an event plugin
     *
     * @param pluginId
     * @param updateWith The config to update the plugin with.
     */
    PluginManager.prototype.updatePlugin = function (pluginId, updateWith) {
        var _a;
        var plugin = this.getPlugin(pluginId);
        (_a = plugin === null || plugin === void 0 ? void 0 : plugin.update) === null || _a === void 0 ? void 0 : _a.call(plugin, updateWith);
    };
    /**
     * Enable all event plugins.
     */
    PluginManager.prototype.enable = function () {
        this.plugins.forEach(function (p) { return p.enable(); });
    };
    /**
     * Disable all event plugins.
     */
    PluginManager.prototype.disable = function () {
        this.plugins.forEach(function (p) { return p.disable(); });
    };
    /**
     * Return if a plugin exists.
     *
     * @param pluginId a unique identifier for the plugin
     */
    PluginManager.prototype.hasPlugin = function (pluginId) {
        return Boolean(this.getPlugin(pluginId));
    };
    /**
     * Manually record data using a plugin.
     *
     * @param pluginId The unique identifier for the plugin being configured.
     * @param data The data to be recorded by the plugin.
     */
    PluginManager.prototype.record = function (pluginId, data) {
        var plugin = this.getPlugin(pluginId);
        if ((plugin === null || plugin === void 0 ? void 0 : plugin.record) instanceof Function) {
            plugin.record(data);
        }
        else {
            throw new Error('AWS RUM Client record: Invalid plugin ID');
        }
    };
    PluginManager.prototype.getPlugin = function (id) {
        var _a;
        return ((_a = this.plugins.get(id)) !== null && _a !== void 0 ? _a : this.plugins.get(InternalPlugin_1.InternalPlugin.generatePluginId(id)));
    };
    return PluginManager;
}());
exports.PluginManager = PluginManager;
