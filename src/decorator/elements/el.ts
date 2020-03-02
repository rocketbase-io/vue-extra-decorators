import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

export function El(selector?: string, multiple = false) {
  return createElementDecorator(vue => vue.$el, selector, multiple);
}
