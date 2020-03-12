import { getOrSetDefault } from "src/util/get-or-set-default";
import { isPrototype } from "src/util/is-prototype";
import { Snowflake } from "src/util/snowflake";

const BUSY_STATE = Symbol("Busy State");

/**
 * @internal
 */
export interface BusyStateWrapper {
  state: Snowflake[];
  subscribers: BusyStateSubscriber[];
}

/**
 * @internal
 */
export interface BusyStateSubscriber {
  (state: Snowflake[]): void;
}

/**
 * @internal
 */
export type BusyStateMap = Record<string, BusyStateWrapper>;

const globalBusyState: Record<string, BusyStateWrapper> = {};

/**
 * @internal
 */
export function getBusyStateWrapper(instance: any, key = ""): BusyStateWrapper {
  if (isPrototype(instance)) throw new Error("Cannot create busy state on prototype objects");
  const states: BusyStateMap = instance ? getOrSetDefault(instance, BUSY_STATE, () => ({})) : globalBusyState;
  return getOrSetDefault(states, key, () => ({ state: [], subscribers: [] }));
}

/**
 * @internal
 */
export function getBusyStateSubscribers(instance: any, key = ""): BusyStateSubscriber[] {
  return getBusyStateWrapper(instance, key).subscribers;
}

/**
 * @internal
 */
export function getBusyState(instance: any, key = ""): Snowflake[] {
  return getBusyStateWrapper(instance, key).state;
}

/**
 * @internal
 */
export function setBusyState(state: Snowflake[], instance: any, key = "") {
  if (isPrototype(instance)) throw new Error("Cannot create busy state on prototype objects");
  const before = getBusyState(instance, key);
  if (before !== state) before.splice(0, before.length, ...state);
  getBusyStateSubscribers(instance, key).forEach(subscriber => subscriber(state));
}
