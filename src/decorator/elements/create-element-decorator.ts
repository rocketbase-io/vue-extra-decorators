import { calculatedProp } from "src/vue";
import { Vue } from "vue/types/vue";

/**
 * Creates a vue decorator for accessing dom elements using css selectors
 * Uses querySelector or querySelectorAll depending on if multiple is set to true.
 * If multiple is true, an array of elements will always be bound, even it there was no match
 * @param accessor - A function returning the root dom element
 * @param selector - A css selector to query, if none is set, the root element will be returned
 * @param multiple - If querySelectorAll should be used instead of querySelector
 * @internal
 */
export function createElementDecorator(accessor: (instance: Vue) => Element, selector?: string, multiple = false) {
  return calculatedProp(function() {
    const el = accessor(this);
    return !selector
      ? el
      : (el as any)?.[multiple ? "querySelectorAll" : "querySelector"](selector) || (multiple ? [] : null);
  });
}
