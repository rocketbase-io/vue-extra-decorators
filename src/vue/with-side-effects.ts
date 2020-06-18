import { append } from "../function";
import { TypedPropertyDecorator } from "../types";
import { createDecorator } from "vue-class-component";

/**
 * Creates a vue decorator that requires setup and teardown
 * @param on - The setup of the decorator
 * @param off - The teardown of the decorator
 * @param dom - Whether the side effects depend on the rendered dom elements
 * @internal
 */
export function withSideEffects(
  on: (cxt: any, key: string) => any,
  off: (cxt: any, key: string) => any,
  dom?: boolean
): TypedPropertyDecorator<any> {
  return createDecorator((options, key) => {
    const onHandler = function(this: any) {
      on.call(this, this, key);
    };
    const offHandler = function(this: any) {
      off.call(this, this, key);
    };
    if (dom) {
      options.mounted = append(options.mounted, onHandler);
      options.updated = append(options.updated, onHandler);
      options.beforeUpdate = append(options.beforeUpdate, offHandler);
      options.beforeDestroy = append(options.beforeDestroy, offHandler);
    } else {
      options.created = append(options.created, onHandler);
      options.destroyed = append(options.destroyed, offHandler);
    }
    return options;
  });
}
