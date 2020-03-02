import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

export function ParentEl(selector?: string, multiple = false) {
  return createElementDecorator(vue => vue.$parent?.$el, selector, multiple);
}
