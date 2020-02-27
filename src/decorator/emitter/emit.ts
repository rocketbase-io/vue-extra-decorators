import { wrapFunction } from "src/descriptor";
import { FunctionWithContext } from "src/types";
import { isThenable } from "src/util";
import { Vue } from "vue/types/vue";

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
