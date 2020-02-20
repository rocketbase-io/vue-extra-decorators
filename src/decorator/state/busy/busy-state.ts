import { getBusyState, getBusyStateSubscribers } from "src/decorator/state/busy/get-busy-state";
import { Snowflake } from "src/util";
import { optionsExtension } from "src/vue";

export function BusyState(id?: string) {
  return optionsExtension(key => {
    const subscriber = Symbol(`Busy State Subscriber: ${key}`);
    return {
      data(this: any) {
        getBusyStateSubscribers(this, id).push(
          (this[subscriber] = (state: Snowflake[]) => (this[key] = !!state.length))
        );
        return { [key]: getBusyState(this, id) };
      },
      destroyed(this: any): void {
        const subs = getBusyStateSubscribers(this, id);
        subs.splice(subs.indexOf(this[subscriber]), 1);
      }
    };
  });
}
