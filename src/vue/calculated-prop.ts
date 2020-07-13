import { Getter, Setter, TypedPropertyDecorator } from "src/types";
import { optionsExtension } from "src/vue/options-extension";
import { ComponentInternalInstance } from "vue";

/**
 * Creates a vue calculated property decorator
 * @param get - The property getter
 * @param set - The property setter
 * @internal
 */
export function calculatedProp<T>(
  get: Getter<T, ComponentInternalInstance>,
  set?: Setter<T, ComponentInternalInstance>
): TypedPropertyDecorator<T> {
  return optionsExtension<T>(key => {
    return { computed: { [key]: set ? { get, set } : { get } } };
  });
}
