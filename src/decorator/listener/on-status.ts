import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createListenerDecorator } from "src/vue";

export function OnStatus(status: number): TypedPropertyDecorator<AnyFunction>;
export function OnStatus(...statuses: number[]): TypedPropertyDecorator<AnyFunction> {
  return createListenerDecorator(
    statuses.map(it => `status:${it}`),
    el => el
  );
}
