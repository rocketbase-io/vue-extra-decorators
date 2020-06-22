import { getBusyState, setBusyState } from "src/util/get-busy-state";
import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { snowflake } from "src/util";

/**
 * Marks a function as blocking, setting a {@link BusyState} while in execution and
 * automatically blocking other functions marked with {@Blocking},
 * supports both synchronous and asynchronous processes.
 *
 * @param id - The id of the blocking process, if there are multiple non-conflicting processes.
 *
 * @remarks
 * Calling this method with an options object allows for parallel execution of otherwise conflicting
 * processes. It also allows for global / shared processes.
 * The corresponding busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @BusyState() private busy!: boolean;
 *   @Blocking()
 *   private async saveFoo() {
 *     // ... Implementation
 *   }
 *   @Blocking()
 *   private async resetFoo() {
 *     // ... Implementation
 *   }
 * }
 * ```
 *
 * {@link BusyState}
 * @public
 * @category Decorator
 */
export function Blocking(id?: string): TypedPropertyDecorator<AnyFunction>;

/**
 * Marks a function as blocking, setting a {@link BusyState} while in execution and
 * automatically blocking other functions marked with {@Blocking},
 * supports both synchronous and asynchronous processes.
 *
 * @param opts - The Blocking options, `id` being the identifier of the block state,
 * `global` being a flag to indicate that the state is global and `parallel` being a
 * flag to signify that multiple blocking methods with the same id can be executed in parallel
 *
 * @remarks
 * Calling this method with an options object allows for parallel execution of otherwise conflicting
 * processes. It also allows for global / shared processes.
 * The corresponding busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @BusyState() private busy!: boolean;
 *   @Blocking()
 *   private async saveFoo() {
 *     // ... Implementation
 *   }
 *   @Blocking()
 *   private async resetFoo() {
 *     // ... Implementation
 *   }
 * }
 * ```
 *
 * {@link BusyState}
 * @public
 * @category Decorator
 */
export function Blocking(opts?: {
  id?: string;
  parallel?: boolean;
  global?: boolean;
}): TypedPropertyDecorator<AnyFunction>;

/**
 * Marks a function as blocking, setting a {@link BusyState} while in execution and
 * automatically blocking other functions marked with {@Blocking},
 * supports both synchronous and asynchronous processes.
 *
 * @param idOrOpts - The block state identifier or options, `id` being the identifier of the block state,
 * `global` being a flag to indicate that the state is global and `parallel` being a
 * flag to signify that multiple blocking methods with the same id can be executed in parallel
 *
 * @remarks
 * Calling this method with an options object allows for parallel execution of otherwise conflicting
 * processes. It also allows for global / shared processes.
 * The corresponding busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @BusyState() private busy!: boolean;
 *   @Blocking()
 *   private async saveFoo() {
 *     // ... Implementation
 *   }
 *   @Blocking()
 *   private async resetFoo() {
 *     // ... Implementation
 *   }
 * }
 * ```
 *
 * {@link BusyState}
 * @public
 * @category Decorator
 */
export function Blocking(
  idOrOpts?: string | { id?: string; parallel?: boolean; global?: boolean }
): TypedPropertyDecorator<AnyFunction> {
  if (!idOrOpts) idOrOpts = "";
  if (typeof idOrOpts === "string") idOrOpts = { id: idOrOpts };
  const { id, parallel, global } = idOrOpts;
  return (prototype, key, desc) => {
    const { value } = desc!;
    desc!.value = async function(...args: any[]) {
      const state = getBusyState(global ? undefined : this, id).slice();
      if (state.length && !parallel) return;
      const flake = snowflake();
      state.push(flake);
      setBusyState(state, global ? undefined : this, id);
      try {
        return await value!.call(this, ...args);
      } finally {
        const state = getBusyState(global ? undefined : this, id).slice();
        state.splice(state.indexOf(flake), 1);
        setBusyState(state, global ? undefined : this, id);
      }
    };
  };
}
