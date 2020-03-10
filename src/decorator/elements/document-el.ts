import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

/**
 * Creates a computed property for {@link Document#querySelector} or {@link Document#querySelectorAll}
 *
 * @param selector - The css selector to pass to {@link Document#querySelector} or {@link Document#querySelectorAll}
 * @param multiple - If {@link Document#querySelectorAll} should be used
 *
 * @remarks
 * Preferably use {@link Ref}
 *
 * @example
 * ```html
 * <html><body><div id="foo"></div></body></html>
 * ```
 * ```typescript
 * @Component({})
 * export default class FooBar extends Vue {
 *   @DocumentEl("#foo") private foo!: HTMLDivElement;
 * }
 * ```
 *
 * {@link El} {@link DocumentEl} {@link ParentEl}
 * @public
 */
export function DocumentEl(selector?: string, multiple = false) {
  return createElementDecorator(() => document as any, selector, multiple);
}
