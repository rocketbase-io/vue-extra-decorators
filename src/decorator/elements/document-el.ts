import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

export function DocumentEl(selector?: string, multiple = false) {
  return createElementDecorator(() => document as any, selector, multiple);
}
