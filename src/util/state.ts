import { getOrSetDefault } from "src/util/get-or-set-default";
import Vue from "vue";

const STATE = Symbol("State");

/**
 * Get some reactive state of an object.
 * @param obj - The object on which the state is/should be defined
 * @param key - The key inside the reactive state object
 * @param def - A default value factory
 * @param realm - The realm ('namespace') of the state.
 * @internal
 */
export function getState(obj: any, key: string | symbol, def: () => any, realm: string | symbol = STATE) {
  const state = getOrSetDefault(obj, realm, () => Vue.observable({ properties: { [key]: def() ?? null } }));
  if (!(key in state.properties)) state.properties = { ...state.properties, [key]: def() ?? null };
  return state.properties[key];
}

/**
 * Set some reactive state of an object.
 * @param obj - The object on which the state is/should be defined
 * @param key - The key inside the reactive state object
 * @param value - the value to set the state to
 * @param realm - The realm ('namespace') of the state.
 * @internal
 */
export function setState(obj: any, key: string | symbol, value: any, realm: string | symbol = STATE) {
  const state = getOrSetDefault(obj, realm, () => Vue.observable({ properties: { [key]: null } }));
  state.properties = { ...state.properties, [key]: value ?? null };
}
