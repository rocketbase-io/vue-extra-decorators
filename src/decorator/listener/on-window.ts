import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createListenerDecorator } from "src/vue";

/**
 * Registers the decorated method as a dom event listener for the window object.
 * if more than one event is given, it will listen for multiple events
 * All event parameters are passed as arguments to the decorated method.
 *
 * @param events - The events to listen for
 *
 * @remarks
 * If you want to attach to document, use {@link OnDocument} instead.
 *
 * @example
 * ```TS
 *   @OnWindow("resize")
 *   private onToggleFade(ev: Event) {
 *     // Called when window is resized
 *   }
 * ```
 *
 * {@Link On} {@Link OnElement} {@Link OnDocument} {@Link OnWindow} {@Link OnParent} {@Link OnParentElement}
 * @public
 * @category Decorator
 */
export function OnWindow(...events: string[]): TypedPropertyDecorator<AnyFunction> {
  return createListenerDecorator(events, () => window, true);
}
