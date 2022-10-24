import { InternalPlugin } from './InternalPlugin';
declare type Wrapper<W> = () => W;
export interface MonkeyPatch<Nodule extends object, FieldName extends keyof Nodule> {
    nodule: Nodule;
    name: FieldName;
    wrapper: Wrapper<(original: Nodule[FieldName]) => Nodule[FieldName]>;
}
export declare abstract class MonkeyPatched<Nodule extends object, FieldName extends keyof Nodule> extends InternalPlugin {
    enable: () => void;
    disable: () => void;
    protected enabled: boolean;
    protected abstract patches: MonkeyPatch<Nodule, FieldName>[];
    private patchAll;
    private unpatchAll;
    private patch;
}
export {};
