/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */
export interface DomEvent {
    /**
     * Schema version.
     */
    version: "1.1.0";
    /**
     * DOM event type (e.g., click, scroll, hover, etc.)
     */
    event: string;
    /**
     * DOM element type.
     */
    element?: string;
    /**
     * DOM element ID.
     */
    elementId?: string;
    /**
     * CSS Locator string.
     */
    cssLocator?: string;
    /**
     * A unique ID for the interaction.
     */
    interactionId?: string;
}
