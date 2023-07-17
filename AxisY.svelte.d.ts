/** @typedef {typeof __propDef.props}  AxisYProps */
/** @typedef {typeof __propDef.events}  AxisYEvents */
/** @typedef {typeof __propDef.slots}  AxisYSlots */
export default class AxisY extends SvelteComponentTyped<{
    yScale: any;
    groupByContinent: any;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type AxisYProps = typeof __propDef.props;
export type AxisYEvents = typeof __propDef.events;
export type AxisYSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        yScale: any;
        groupByContinent: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
