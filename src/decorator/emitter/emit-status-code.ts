import { wrapFunction } from "src/descriptor";
import { FunctionWithContext, TypedPropertyDecorator } from "src/types";
import { isPromiseLike, statusOf } from "src/util";
import { Vue } from "vue/types/vue";

/**
 * Emits a status code event on `cxt` if the status of `it` matches any of the given `codes`.
 * @param cxt - The vue context to trigger the event on
 * @param it - The value to convert into a status code or extract a status code from
 * @param codes - The codes that should trigger an event
 * @param event - The event that should be triggered, defaults to `status:STATUSCODE` where STATUSCODE is the extracted status code.
 * @internal
 */
function emitIfMatching(cxt: Vue, it: any, codes: number[], event?: string) {
  const status = statusOf(it);
  if (status != null && (codes.length === 0 || codes.includes(status))) {
    cxt.$emit(event || `status:${status}`, it);
    return true;
  }
  return false;
}

/**
 * Emits a given vue event after the execution of the decorated method,
 * if a status code can be extracted from its return value or error.
 *
 * @param code - The status code to match, if none is given, it will emit on every status code
 * @param event - The name of the event to trigger, defaults to `status:STATUSCODE`
 * where STATUSCODE is the status code extracted from the return value or error of the decorated method.
 * @param rethrow - If the error should be re-thrown after emitting the event
 *
 * @remarks
 * If a promise is returned, it will trigger the event after the promise was rejected or resolved.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @EmitOnStatusCode(200, "success")
 *   @EmitOnStatusCode([400, 500], "failure")
 *   private async saveFooBar() {
 *     // ... Implementation
 *     return axios.get("/foo/bar");
 *   }
 * }
 * ```
 *
 * {@link Emit} {@link EmitError} {@link EmitOnStatusCode}
 * @public
 */
export function EmitOnStatusCode(
  code?: number,
  event?: string,
  rethrow?: boolean
): TypedPropertyDecorator<FunctionWithContext<Vue>>;

/**
 * Emits a given vue event after the execution of the decorated method,
 * if a status code can be extracted from its return value or error.
 *
 * @param codes - The status codes to match, if none are given, it will emit on every status code
 * @param event - The name of the event to trigger, defaults to `status:STATUSCODE`
 * where STATUSCODE is the status code extracted from the return value or error of the decorated method.
 * @param rethrow - If the error should be re-thrown after emitting the event
 *
 * @remarks
 * If a promise is returned, it will trigger the event after the promise was rejected or resolved.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @EmitOnStatusCode(200, "success")
 *   @EmitOnStatusCode([400, 500], "failure")
 *   private async saveFooBar() {
 *     // ... Implementation
 *     return axios.get("/foo/bar");
 *   }
 * }
 * ```
 *
 * {@link Emit} {@link EmitError} {@link EmitOnStatusCode}
 * @public
 */
export function EmitOnStatusCode(
  codes?: number[],
  event?: string,
  rethrow?: boolean
): TypedPropertyDecorator<FunctionWithContext<Vue>>;

/**
 * Emits a given vue event after the execution of the decorated method,
 * if a status code can be extracted from its return value or error.
 *
 * @param codes - The status codes to match, if none are given, it will emit on every status code
 * @param event - The name of the event to trigger, defaults to `status:STATUSCODE`
 * where STATUSCODE is the status code extracted from the return value or error of the decorated method.
 * @param rethrow - If the error should be re-thrown after emitting the event
 *
 * @remarks
 * If a promise is returned, it will trigger the event after the promise was rejected or resolved.
 *
 * @example
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @EmitOnStatusCode(200, "success")
 *   @EmitOnStatusCode([400, 500], "failure")
 *   private async saveFooBar() {
 *     // ... Implementation
 *     return axios.get("/foo/bar");
 *   }
 * }
 * ```
 *
 * {@link Emit} {@link EmitError} {@link EmitOnStatusCode}
 * @public
 */
export function EmitOnStatusCode(codes?: number | number[], event?: string, rethrow = false) {
  const codeArray = codes == null ? [] : Array.isArray(codes) ? codes : [codes];
  return (target: any, key: string, desc: TypedPropertyDescriptor<FunctionWithContext<Vue>>) => {
    wrapFunction(desc, function({ args, orig }) {
      try {
        const result = orig.call(this, args);
        if (isPromiseLike(result))
          return result
            .then(it => (emitIfMatching(this, it, codeArray, event), it))
            .catch(it => {
              if (emitIfMatching(this, it, codeArray, event) && !rethrow) return;
              throw it;
            });
        emitIfMatching(this, result, codeArray, event);
        return result;
      } catch (ex) {
        if (emitIfMatching(this, ex, codeArray, event) && !rethrow) return;
        throw ex;
      }
    });
  };
}
