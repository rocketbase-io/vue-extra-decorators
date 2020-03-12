import { wrapFunction } from "src/descriptor";
import { FunctionWithContext } from "src/types";
import { isPromiseLike } from "src/util";
import { Vue } from "vue/types/vue";

/**
 * Emits a given vue event after failed execution with the error being the event parameter.
 *
 * @param event - The name of the event to trigger, defaults to `error:METHODNAME`
 * where METHODNAME is the name of the decorated method.
 * @param rethrow - If the error should be re-thrown after emitting the event
 *
 * @remarks
 * If a promise is returned, it will trigger the event after the promise was rejected.
 * Will never emit on success, use {@link Emit} instead.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @EmitError("save-failure")
 *   private async saveFooBar() {
 *     // ... Implementation
 *     throw new Error("Error trying to save foobar");
 *   }
 * }
 * ```
 *
 * {@link Emit} {@link EmitError} {@link EmitOnStatusCode}
 * @public
 * @category Decorator
 */
export function EmitError(event?: string, rethrow = false) {
  return (target: any, key: string, desc: TypedPropertyDescriptor<FunctionWithContext<Vue>>) => {
    event = event ?? `error:${key}`;
    wrapFunction(desc, function({ args, orig }) {
      try {
        const result = orig.call(this, args);
        if (isPromiseLike(result))
          return result.catch((it: any) => {
            this.$emit(event, it);
            if (rethrow) throw it;
          });
        return result;
      } catch (error) {
        this.$emit(event, error);
        if (rethrow) throw error;
      }
    });
  };
}
