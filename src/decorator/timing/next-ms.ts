import { wrapFunction } from "src/descriptor";
import { AnyFunction } from "src/types";
import { callbackToPromise } from "src/util";

/**
 * Delay function calls by a millisecond.
 *
 * @remarks
 * If you want to delay by a specific amout of time, a browser frame or a vue tick, look into
 * {@link Delay}, {@link NextFrame} or {@link NextTick} instead.
 *
 * @example
 * ```TS
 *   @NextMs
 *   delayed() {
 *     // Executed 1 ms after invocation
 *   }
 * ```
 *
 * Call limiting decorators:
 * {@link Debounce} {@link Debuffer} {@link LimitToFrames}
 *
 * Delaying decorators:
 * {@link Delay} {@link NextFrame} {@link NextTick} {@link NextMs}
 *
 * Interval decorators:
 * {@link Every} {@link EveryFrame}
 *
 * @public
 * @category Decorator
 */
export function NextMs() {
  return (target: any, key: string, desc: TypedPropertyDescriptor<AnyFunction>) => {
    wrapFunction(desc, function({ args, orig }) {
      return callbackToPromise(setTimeout, orig.bind(this, ...args), 0);
    });
  };
}
