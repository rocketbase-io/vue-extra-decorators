import { wrapFunction } from "src/descriptor";
import { AnyFunction } from "src/types";
import { callbackToPromise } from "src/util";

/**
 * Delay function calls by a single browser frame.
 *
 * @remarks
 * If you want to delay by one ms, a specific time or a vue tick, look into
 * {@link NextMs}, {@link Delay} or {@link NextTick} instead.
 *
 * @example
 * ```TS
 *   @NextFrame(500)
 *   delayed() {
 *     // Executed on next animation frame
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
export function NextFrame() {
  return (target: any, key: string, desc: TypedPropertyDescriptor<AnyFunction>) => {
    wrapFunction(desc, function({ args, orig }) {
      return callbackToPromise(requestAnimationFrame, orig.bind(this, ...args));
    });
  };
}
