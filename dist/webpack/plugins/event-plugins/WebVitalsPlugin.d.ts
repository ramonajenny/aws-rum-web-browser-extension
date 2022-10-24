import { InternalPlugin } from '../InternalPlugin';
import { Metric } from 'web-vitals';
export declare const WEB_VITAL_EVENT_PLUGIN_ID = "web-vitals";
export declare class WebVitalsPlugin extends InternalPlugin {
    constructor();
    enable(): void;
    disable(): void;
    configure(config: any): void;
    getWebVitalData(webVitalData: Metric, eventType: string): void;
    protected onload(): void;
}
