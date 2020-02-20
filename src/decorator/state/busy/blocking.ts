import { getBusyState, setBusyState } from "src/decorator/state/busy/get-busy-state";
import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { snowflake } from "src/util";

export function Blocking(id?: string): TypedPropertyDecorator<AnyFunction>;
export function Blocking(opts?: {
  id?: string;
  parallel?: boolean;
  global?: boolean;
}): TypedPropertyDecorator<AnyFunction>;
export function Blocking(
  idOrOpts?: string | { id?: string; parallel?: boolean; global?: boolean }
): TypedPropertyDecorator<AnyFunction> {
  if (!idOrOpts) idOrOpts = "";
  if (typeof idOrOpts === "string") idOrOpts = { id: idOrOpts };
  const { id, parallel, global } = idOrOpts;
  return (prototype, key, desc) => {
    const { value } = desc!;
    desc!.value = async function(...args: any[]) {
      const state = getBusyState(global ? undefined : this, id);
      if (state.length && !parallel) return;
      const flake = snowflake();
      state.push(flake);
      setBusyState(state, global ? undefined : this, id);
      try {
        return await value!.call(this, ...args);
      } finally {
        const state = getBusyState(global ? undefined : this, id);
        state.splice(state.indexOf(flake), 1);
        setBusyState(state, global ? undefined : this, id);
      }
    };
  };
}
