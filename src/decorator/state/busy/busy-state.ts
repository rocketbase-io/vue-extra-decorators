import { getBusyState, getBusyStateSubscribers } from "src/decorator/state/busy/get-busy-state";
import { TypedPropertyDecorator } from "src/types";
import { Snowflake } from "src/util";
import { optionsExtension } from "src/vue";

export function BusyState(id?: string): TypedPropertyDecorator;
export function BusyState(opts?: { global?: true; id?: string }): TypedPropertyDecorator;
export function BusyState(idOrOpts?: string | { global?: true; id?: string }) {
  if (!idOrOpts) idOrOpts = "";
  if (typeof idOrOpts === "string") idOrOpts = { id: idOrOpts };
  const { id, global } = idOrOpts;
  return optionsExtension(key => {
    const subscriber = Symbol(`Busy State Subscriber: ${key}`);
    return {
      data(this: any) {
        getBusyStateSubscribers(global ? undefined : this, id).push(
          (this[subscriber] = (state: Snowflake[]) => (this[key] = !!state.length))
        );
        return { [key]: !!getBusyState(global ? undefined : this, id).length };
      },
      destroyed(this: any): void {
        const subs = getBusyStateSubscribers(global ? undefined : this, id);
        subs.splice(subs.indexOf(this[subscriber]), 1);
      }
    };
  });
}
