/** @typedef {typeof __propDef.props}  TooltipProps */
/** @typedef {typeof __propDef.events}  TooltipEvents */
/** @typedef {typeof __propDef.slots}  TooltipSlots */
export default class Tooltip extends SvelteComponentTyped<{
    width: any;
    data: any;
    colorScale: any;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type TooltipProps = typeof __propDef.props;
export type TooltipEvents = typeof __propDef.events;
export type TooltipSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        width: any;
        data: any;
        colorScale: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
