import { getBusyState, getBusyStateSubscribers } from "src/util/get-busy-state";
import { TypedPropertyDecorator } from "src/types";
import { getState, setState, Snowflake } from "src/util";
import { isPrototype } from "src/util/is-prototype";
import { optionsExtension } from "src/vue";

/**
 * Binds a busy state used by {@link Blocking} methods to a vue reactive variable.
 * @param id - The identifier of a block state, if multiple exist.
 *
 * @remarks
 * Calling this method with an options object allows for global / shared processes.
 * The busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><span v-if="busy">Loading...</span></div>` })
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
 * {@link Blocking}
 * @public
 * @category Decorator
 */
export function BusyState(id?: string): TypedPropertyDecorator;

/**
 * Binds a busy state used by {@link Blocking} methods to a vue reactive variable.
 * @param opts - The block state options, `id` being the identifier of the block state,
 * `global` being a flag signifying if a global busy state should be bound instead.
 *
 * @remarks
 * The busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><span v-if="busy">Loading...</span></div>` })
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
 * {@link Blocking}
 * @public
 * @category Decorator
 */
export function BusyState(opts?: { global?: true; id?: string }): TypedPropertyDecorator;

/**
 * Binds a busy state used by {@link Blocking} methods to a vue reactive variable.
 * @param idOrOpts - The id of the block state or the block state options,
 * `id` being the identifier of the block state, `global` being a flag
 * signifying if a global busy state should be bound instead.
 *
 * @remarks
 * The busy state, in case of parallel execution,
 * will only be false if ALL started processes have finished.
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><span v-if="busy">Loading...</span></div>` })
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
 * {@link Blocking}
 * @public
 * @category Decorator
 */
export function BusyState(idOrOpts?: string | { global?: true; id?: string }) {
  if (!idOrOpts) idOrOpts = "";
  if (typeof idOrOpts === "string") idOrOpts = { id: idOrOpts };
  const { id, global } = idOrOpts;
  return (proto: any, key: string | symbol) => {
    Object.defineProperty(proto, key, {
      get(): boolean {
        if (isPrototype(this)) throw new Error("Cannot access state on prototype");
        return !!getBusyState(global ? undefined : this, id).length;
      }
    });
  };
}
