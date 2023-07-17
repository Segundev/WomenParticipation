/** @typedef {typeof __propDef.props}  AxisXProps */
/** @typedef {typeof __propDef.events}  AxisXEvents */
/** @typedef {typeof __propDef.slots}  AxisXSlots */
export default class AxisX extends SvelteComponentTyped<{
    xScale: any;
    width: any;
    height: any;
    margin: any;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type AxisXProps = typeof __propDef.props;
export type AxisXEvents = typeof __propDef.events;
export type AxisXSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        xScale: any;
        width: any;
        height: any;
        margin: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
