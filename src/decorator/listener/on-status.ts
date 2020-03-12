import { AnyFunction, TypedPropertyDecorator } from "src/types";
import { createListenerDecorator } from "src/vue";

/**
 * Add an event listener to a status event (`status:STATUSCODE`) where
 * STATUSCODE is the statuscode to listen for.
 *
 * @param status - The status to listen for
 *
 * @remarks
 * For Use in conjunction with {@link EmitOnStatusCode}.
 * You can also call this decorator with more than one status code.
 *
 * @example
 * ```typescript
 * @EmitOnStatusCode()
 * private async doSomeRequest() {
 *   // ...Implementation
 *   return await axios.get("http://example.com");
 * }
 *
 * @OnStatus(200)
 * onSomeRequestSuccess() {
 *   // ...Implementation
 * }
 * ```
 *
 * @public
 * @category Decorator
 */
export function OnStatus(status: number): TypedPropertyDecorator<AnyFunction>;

/**
 * Add an event listener to a status event (`status:STATUSCODE`) where
 * STATUSCODE is the status code to listen for.
 *
 * @param statuses - The status codes to listen for
 *
 * @remarks
 * For Use in conjunction with {@link EmitOnStatusCode}.
 *
 * @example
 * ```typescript
 * @EmitOnStatusCode()
 * private async doSomeRequest() {
 *   // ...Implementation
 *   return await axios.get("http://example.com");
 * }
 *
 * @OnStatus(401, 403)
 * onSomeRequestPermissionFailure() {
 *   // ...Implementation
 * }
 * ```
 *
 * @public
 * @category Decorator
 */
export function OnStatus(...statuses: number[]): TypedPropertyDecorator<AnyFunction> {
  return createListenerDecorator(
    statuses.map(it => `status:${it}`),
    el => el
  );
}
