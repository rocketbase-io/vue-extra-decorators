import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createWatch } from "src/vue";
import { WatchOptions } from "vue/types/options";

interface WatchOptionsWithProp extends WatchOptions {
  prop: string;
}

/**
 * Watch a property for changes
 * @param property - The property to watch
 * @remarks
 * You can also pass an options object instead of just a property
 * to set it to watch immediately or deeply.
 * There are also flavors for these uses: {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @example
 * ```typescript
 * @Data({ default: "" }) private value!: string;
 * @Watch("value")
 * private onValueChange(newValue: string, oldValue: string) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function Watch(property: string): TypedPropertyDecorator<AnyFunction>;

/**
 * Watch a property for changes
 * @param opts - The options for the watch, `prop` being the property to watch
 * for, `immediate` being a flag if this watch should be executed immediately
 * and `deep` being a flag if deep mutations to the watched property should
 * trigger the watch
 * @remarks
 * You can also pass a string as a shorthand.
 * There are also flavors for these uses: {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @example
 * ```typescript
 * @Data({ default: "" }) private value!: string;
 * @Watch({ prop: "value", immediate: true })
 * private onValueChange(newValue: string, oldValue: string) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function Watch(opts: WatchOptionsWithProp): TypedPropertyDecorator<AnyFunction>;

/**
 * Watch a property for changes
 * @param opts - The property to watch or the options for the watch, `prop` being
 * the property to watch for, `immediate` being a flag if this watch should be
 * executed immediately and `deep` being a flag if deep mutations to the
 * watched property should trigger the watch
 * @remarks
 * You can also pass a string as a shorthand.
 * There are also flavors for these uses: {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @example
 * ```typescript
 * @Data({ default: "" }) private value!: string;
 * @Watch({ prop: "value", immediate: true })
 * private onValueChange(newValue: string, oldValue: string) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function Watch(opts: string | WatchOptionsWithProp): TypedPropertyDecorator<AnyFunction> {
  if (typeof opts === "string") opts = { prop: opts };
  const { prop } = opts;
  delete opts.prop;
  return createWatch(prop, opts);
}

/**
 * Watch a property for changes, immediately
 * @param property - The property to watch
 * @remarks
 * This decorator is synonymous to using {@link Watch} with `immediate` set to `true`.
 * There are also flavors for these uses: {@link Watch}, {@link DWatch}, {@link IDWatch}
 * @example
 * ```typescript
 * @Data({ default: "" }) private value!: string;
 * @IWatch("value")
 * private onValueChange(newValue: string, oldValue: string) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function IWatch(property: string): TypedPropertyDecorator<AnyFunction> {
  return Watch({ prop: property, immediate: true });
}

/**
 * Watch a property for changes, deeply
 * @param property - The property to watch
 * @remarks
 * This decorator is synonymous to using {@link Watch} with `deep` set to `true`.
 * There are also flavors for these uses: {@link Watch}, {@link IWatch}, {@link IDWatch}
 * @example
 * ```typescript
 * @Data({ default: {} }) private value!: any;
 * @DWatch("value")
 * private onValueChange(newValue: any, oldValue: any) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function DWatch(property: string): TypedPropertyDecorator<AnyFunction> {
  return Watch({ prop: property, deep: true });
}

/**
 * Watch a property for changes, deeply and immediately
 * @param property - The property to watch
 * @remarks
 * This decorator is synonymous to using {@link Watch} with `deep`
 * and `immediate` set to `true`.
 * There are also flavors for these uses: {@link Watch}, {@link IWatch}, {@link DWatch}
 * @example
 * ```typescript
 * @Data({ default: {} }) private value!: any;
 * @IDWatch("value")
 * private onValueChange(newValue: any, oldValue: any) {
 *   // ...Implementation
 * }
 * ```
 * {@link Watch}, {@link IWatch}, {@link DWatch}, {@link IDWatch}
 * @public
 * @category Decorator
 */
export function IDWatch(property: string): TypedPropertyDecorator<AnyFunction> {
  return Watch({ prop: property, deep: true, immediate: true });
}
