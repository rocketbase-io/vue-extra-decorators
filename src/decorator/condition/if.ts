import { wrapFunction } from "src/descriptor";
import { TFunction } from "src/types";

/**
 * Wraps a function and only calls through if a given set of predicates return truthy
 *
 * @param fns - The predicates to check before executing the decorated function
 *
 * @remarks
 * @example
 * ```TS
 *   @If(wasPrevented)
 *   private doSomething(ev: Event) {
 *     // only executed if wasPrevented returns true
 *   }
 * ```
 * {@link IfNot} {@link or} {@link and} {@link not}
 * @public
 * @category Decorator
 */
export function If(...fns: TFunction<boolean>[]) {
  return (target: any, key: string, desc: TypedPropertyDescriptor<TFunction>) => {
    wrapFunction(desc, function({ args, orig }) {
      if (fns.find(fn => !fn.apply(this, args))) return;
      return orig.apply(this, args);
    });
  };
}
