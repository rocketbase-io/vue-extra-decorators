import { wrapFunction } from "src/descriptor";
import { FunctionWithContext } from "src/types";
import { isPromiseLike } from "src/util";
import { Vue } from "vue/types/vue";

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
