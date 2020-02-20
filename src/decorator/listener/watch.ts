import { AnyFunction, TypedPropertyDecorator } from "../../types";
import { WatchOptions } from "vue/types/options";
import { createDecorator } from "vue-class-component";

interface WatchOptionsWithProp extends WatchOptions {
  prop: string;
}

export function Watch(property: string): TypedPropertyDecorator<AnyFunction>;
export function Watch(opts: WatchOptionsWithProp): TypedPropertyDecorator<AnyFunction>;
export function Watch(opts: string | WatchOptionsWithProp): TypedPropertyDecorator<AnyFunction> {
  if (typeof opts === "string") opts = { prop: opts };
  const { prop } = opts;
  delete opts.prop;
  return createDecorator((options, handler) => {
    if (!options.watch) options.watch = {};
    if (!Array.isArray(options.watch[prop]))
      options.watch[prop] = options.watch[prop] == null ? ([] as any) : [options.watch[prop]];
    (options.watch[prop] as any).push({ ...(opts as any), handler });
  });
}
