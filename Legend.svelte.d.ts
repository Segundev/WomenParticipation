/** @typedef {typeof __propDef.props}  LegendProps */
/** @typedef {typeof __propDef.events}  LegendEvents */
/** @typedef {typeof __propDef.slots}  LegendSlots */
export default class Legend extends SvelteComponentTyped<{
    colorScale: any;
    hoveredContinent: any;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type LegendProps = typeof __propDef.props;
export type LegendEvents = typeof __propDef.events;
export type LegendSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        colorScale: any;
        hoveredContinent: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
