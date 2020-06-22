import { WatchHandler, WatchOptions } from "vue";
import { createDecorator } from "vue-class-component";

/**
 * Creates a vue watch decorator
 * @param prop - The vue property to watch for changes to, if none are give, the decorated property will be used
 * @param opts - The vue watch options, e.g. deep or immediate
 * @param handler - The handler function or property, if none are given, the decorated property will be used
 * @internal
 */
export function createWatch(prop?: string, opts?: WatchOptions, handler?: string | WatchHandler<any>) {
  return createDecorator((options, key) => {
    const actualHandler = handler ?? key;
    const actualProp = prop ?? key;
    if (!options.watch) options.watch = {};
    if (!Array.isArray(options.watch[actualProp]))
      options.watch[actualProp] = options.watch[actualProp] == null ? ([] as any) : [options.watch[actualProp]];
    (options.watch[actualProp] as any).push({ ...(opts as any), handler: actualHandler });
  });
}
