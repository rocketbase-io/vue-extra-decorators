import { Snowflake } from "src/util/snowflake";

export const BUSY_STATE = Symbol("Busy State");

export interface BusyStateWrapper {
  state: Snowflake[];
  subscribers: BusyStateSubscriber[];
}

export interface BusyStateSubscriber {
  (state: Snowflake[]): void;
}

export type BusyStateMap = Record<string, BusyStateWrapper>;

const globalBusyState: Record<string, BusyStateWrapper> = {};

export function getBusyStateWrapper(instance: any, key = ""): BusyStateWrapper {
  if (instance && instance.constructor && instance.constructor.prototype === instance)
    throw new Error("Cannot create busy state on prototype objects");
  const states: BusyStateMap = instance ? instance[BUSY_STATE] || (instance[BUSY_STATE] = {}) : globalBusyState;
  if (states[key] == null) states[key] = { state: [], subscribers: [] };
  return states[key];
}

export function getBusyStateSubscribers(instance: any, key = ""): BusyStateSubscriber[] {
  return getBusyStateWrapper(instance, key).subscribers;
}

export function getBusyState(instance: any, key = ""): Snowflake[] {
  return getBusyStateWrapper(instance, key).state;
}

export function setBusyState(state: Snowflake[], instance: any, key = "") {
  if (instance && instance.constructor && instance.constructor.prototype === instance)
    throw new Error("Cannot create busy state on prototype objects");
  const before = getBusyState(instance, key);
  if (before !== state) before.splice(0, before.length, ...state);
  getBusyStateSubscribers(instance, key).forEach(subscriber => subscriber(state));
}
