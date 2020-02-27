import { wrapFunction } from "src/descriptor";
import { FunctionWithContext, TypedPropertyDecorator } from "src/types";
import { isPromiseLike, isThenable, statusOf } from "src/util";
import { Vue } from "vue/types/vue";

function emitIfMatching(cxt: Vue, it: any, codes: number[], event?: string) {
  const status = statusOf(it);
  if (status != null && (codes.length === 0 || codes.includes(status))) {
    cxt.$emit(event || `status:${status}`, it);
    return true;
  }
  return false;
}

export function EmitOnStatusCode(
  code?: number,
  event?: string,
  rethrow?: boolean
): TypedPropertyDecorator<FunctionWithContext<Vue>>;
export function EmitOnStatusCode(
  codes?: number[],
  event?: string,
  rethrow?: boolean
): TypedPropertyDecorator<FunctionWithContext<Vue>>;
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
