import { wrapFunction } from "src/descriptor";
import { FunctionWithContext } from "src/types";
import { isThenable } from "src/util";
import { Vue } from "vue/types/vue";

/**
 * Emits a given vue event after execution with the return value being the event parameter.
 *
 * @param event - The name of the event to trigger, defaults to the method name
 *
 * @remarks
 * If a promise is returned, it will trigger the event after the promise has completed successfully.
 * Will never emit on error, use {@link EmitError} instead.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @Emit("save-success")
 *   private async saveFooBar() {
 *     // ... Implementation
 *     return { foobar: {} };
 *   }
 * }
 * ```
 *
 * {@link Emit} {@link EmitError} {@link EmitOnStatusCode}
 * @public
 * @category Decorator
 */
export function Emit(event?: string) {
  return (target: any, key: string, desc: TypedPropertyDescriptor<FunctionWithContext<Vue>>) => {
    event = event ?? key;
    wrapFunction(desc, function({ args, orig }) {
      const result = orig.call(this, args);
      if (isThenable(result)) return result.then((it: any) => (this.$emit(event, it), it));
      this.$emit(event, result);
      return result;
    });
  };
}
