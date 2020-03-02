import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

export function WindowEl(selector?: string, multiple = false) {
  return createElementDecorator(() => window as any, selector, multiple);
}
