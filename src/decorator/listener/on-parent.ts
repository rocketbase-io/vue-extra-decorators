import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createListenerDecorator } from "src/vue";

/**
 * Registers the decorated method as a vue event listener of the parent vue component.
 * if more than one event is given, it will listen for multiple events
 * All event parameters are passed as arguments to the decorated method.
 *
 * @param events - The events to listen for
 *
 * @remarks
 * This decorator doesn't work for dom events, only for vue events.
 * If you want to attach to dom events, use {@link OnParentElement} instead.
 *
 * @example
 * ```TS
 *   @OnParent("toggle-fade")
 *   private onToggleFade() {
 *     // Called when this.$parent.$emit("toggle-fade") is called
 *   }
 * ```
 *
 * {@Link On} {@Link OnElement} {@Link OnDocument} {@Link OnWindow} {@Link OnParent} {@Link OnParentElement}
 * @public
 * @category Decorator
 */
export function OnParent(...events: string[]): TypedPropertyDecorator<AnyFunction> {
  return createListenerDecorator(events, el => el.$parent);
}
