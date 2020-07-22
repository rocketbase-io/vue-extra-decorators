import { TFunction, TypedPropertyDecorator } from "src/types";
import { optionsExtension } from "src/vue";
import { Vue } from "vue/types/vue";

/**
 * Parameters of the {@link Data | @Data} decorator and its flavors
 * @public
 */
export interface DataOpts<T> {
  /**
   * A default value or a function constructing a default value.
   * Arrays or objects are supported, if you want to use a literal
   * function as a default value, use literal instead.
   * @public
   */
  default?: T | TFunction<T>;
  /**
   * A default value. If a function is given, it will be passed as a
   * literal value instead of being executed as a factory.
   * @public
   */
  literal?: T;
  /**
   * The name of a vue property to sync this data property with.
   * On update to said property, the value of the decorated property
   * will be changed as well. on changes to the data property, an
   * `update:PROPNAME` event will be emitted, where PROPNAME is the
   * name of the property to sync with.
   */
  sync?: string;
  /**
   * Condition for applying sync changes to the related property,
   * by default negated object equality is used (newVal !== oldVal).
   */
  syncCondition?: (newVal: T, oldVal?: T) => boolean;
}

/**
 * Declares a Vue data property.
 * @param opts - The data property options.
 *
 * @remarks
 * There are various preconfigured flavors of this decorator for different
 * types already available:
 *
 * @example
 * ```TS
 *   @Data()                    private defaultsToNull!: string | null;
 *   @Data({default: 0})        private numberWithDefault!: number;
 *   @Data({literal: parseInt}) private parser!: (str: string) => number;
 *   @Data({sync: "value"})     private syncsWithPropertyValue!: string;
 *   @SProp({default: ""})      private value!: string;
 * ```
 *
 * {@link SProp} {@link NProp} {@link DProp} {@link BProp} {@link Prop}
 * @public
 * @category Decorator
 */
export function Data<T>(opts: DataOpts<T> = {}): TypedPropertyDecorator<T> {
  // If a literal is given, use a function returning that literal
  if (opts.literal != null) opts.default = (() => opts.literal) as any;

  // Initialize values with null so they are reactive
  if (opts.default == null) opts.default = null as any;

  const { default: def, sync, syncCondition } = opts;
  const shouldSync = syncCondition ?? ((a: T, b?: T) => a !== b);

  // Normalize value of default to function always
  if (typeof opts.default !== "function")
    opts.default = function(this: Vue) {
      return def;
    } as any;

  const getter = opts.default as TFunction<T>;

  return optionsExtension((key, options) => {
    const data = function(this: Vue) {
      return { [key]: getter.call(this) };
    };
    if (sync) {
      const event = options.model && options.model.prop === sync ? options.model.event || "change" : `update:${sync}`;
      const block = Symbol(`Sync Block: ${key}`);
      if (!options.watch) options.watch = {};
      if (!Array.isArray(options.watch[key]))
        options.watch[key] = options.watch[key] == null ? ([] as any) : [options.watch[key]];
      (options.watch[key] as any).push({
        async handler(newVal: T, oldVal?: T) {
          if (this[block] && shouldSync.call(this, newVal, oldVal)) return;
          try {
            this[block] = true;
            this.$emit(event, newVal, oldVal);
            await this.$nextTick();
          } finally {
            this[block] = false;
          }
        }
      });
      if (!Array.isArray(options.watch[sync]))
        options.watch[sync] = options.watch[sync] == null ? ([] as any) : [options.watch[sync]];
      (options.watch[sync] as any).push({
        async handler(newVal: T) {
          if (this[block]) return;
          try {
            this[block] = true;
            (this as any)[key] = newVal;
            await this.$nextTick();
          } finally {
            this[block] = false;
          }
        },
        immediate: true
      });
    }
    return { data };
  });
}
