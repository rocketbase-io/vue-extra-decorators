import { getState, setState } from "src/util";
import { isPrototype } from "src/util/is-prototype";

/**
 * Creates an observable state for the decorated property.
 * Every decorated property can then be used reactively in a vue context.
 * @param opts - The state options, `default` being the default value or a
 * factory returning it, `literal` being the absolute default value,
 * functions being passed as is.
 *
 * @remarks
 * This is intended to be used outside of vue contexts in separate classes.
 * You can never set a decorated value to undefined, it will always be set to
 * null for reactivity reasons.
 * This is meant to be used when vuex is too much for what you are trying to
 * accomplish but some form of shared state is necessary.
 * For vue components, you should use {@link Data} instead.
 *
 * @example
 * ```typescript
 * export class MySimpleStore {
 *   @State public firstName?: string;
 *   @State public lastName = "foo";
 *   @State({ default: () => new Date() }) public creationDate!: Date;
 *   @State({ literal: parseInt }) public parser!: (str: string) => number;
 * }
 * ```
 *
 * @public
 * @catecory Decorator
 */
export function State<T = any>(opts: { default?: T | (() => T); literal?: T }): PropertyDecorator;

/**
 * Creates an observable state for the decorated property.
 * Every decorated property can then be used reactively in a vue context.
 * @param proto - The decorated properties' prototype object
 * @param key - The decorated property
 *
 * @remarks
 * This is intended to be used outside of vue contexts in separate classes.
 * You can never set a decorated value to undefined, it will always be set to
 * null for reactivity reasons.
 * This is meant to be used when vuex is too much for what you are trying to
 * accomplish but some form of shared state is necessary.
 * For vue components, you should use {@link Data} instead.
 *
 * @example
 * ```typescript
 * export class MySimpleStore {
 *   @State public firstName?: string;
 *   @State public lastName = "foo";
 *   @State({ default: () => new Date() }) public creationDate!: Date;
 *   @State({ literal: parseInt }) public parser!: (str: string) => number;
 * }
 * ```
 *
 * @public
 * @category Decorator
 */
export function State(proto: InstanceType<any>, key: string | symbol): void;

/**
 * Creates an observable state for the decorated property.
 * Every decorated property can then be used reactively in a vue context.
 * @param opts - The state options, `default` being the default value or a
 * factory returning it, `literal` being the absolute default value,
 * functions being passed as is. Or when used as a parameterless decorator,
 * The decorated properties' prototype object
 * @param key - The decorated property, when used as a parameterless decorator
 *
 * @remarks
 * This is intended to be used outside of vue contexts in separate classes.
 * You can never set a decorated value to undefined, it will always be set to
 * null for reactivity reasons.
 * This is meant to be used when vuex is too much for what you are trying to
 * accomplish but some form of shared state is necessary.
 * For vue components, you should use {@link Data} instead.
 *
 * @example
 * ```typescript
 * export class MySimpleStore {
 *   @State public firstName?: string;
 *   @State public lastName = "foo";
 *   @State({ default: () => new Date() }) public creationDate!: Date;
 *   @State({ literal: parseInt }) public parser!: (str: string) => number;
 * }
 * ```
 *
 * @public
 * @category Decorator
 */
export function State<T = any>(
  opts: { default?: T | (() => T); literal?: T } | InstanceType<any>,
  key?: string | symbol
): PropertyDecorator | void {
  // Allow for parameterless usage
  if (opts && opts.constructor && key) return State({ default: null })(opts, key);
  // Default value factory
  const def =
    opts.literal != null
      ? () => opts.literal
      : typeof opts.default === "function"
      ? (opts.default as () => T)
      : () => opts.default;
  return (proto: any, key: string | symbol) => {
    Object.defineProperty(proto, key, {
      get(): T {
        if (isPrototype(this)) throw new Error("Cannot access state on prototype");
        return getState(this, key, def);
      },
      set(value: T) {
        if (isPrototype(this)) throw new Error("Cannot access state on prototype");
        setState(this, key, value);
      }
    });
  };
}
