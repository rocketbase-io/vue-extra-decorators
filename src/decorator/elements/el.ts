import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

/**
 * Creates a computed property for {@link Vue#$el#querySelector | this.$el.querySelector}
 * or {@link Vue#$el#querySelectorAll | this.$el.querySelectorAll}
 * @param selector - The css selector to pass to
 * {@link Vue#$el#querySelector | this.$el.querySelector} or {@link Vue#$el#querySelectorAll | this.$el.querySelectorAll}
 * @param multiple - If {@link Vue#$el#querySelectorAll | this.$el.querySelectorAll} should be used
 *
 * @remarks
 * Preferably use {@link Ref}
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><div id="foo"></div></div>` })
 * export default class FooBar extends Vue {
 *   @El("#foo") private foo!: HTMLDivElement;
 * }
 * ```
 *
 * {@link El} {@link DocumentEl} {@link ParentEl}
 * @public
 * @category Decorator
 */
export function El(selector?: string, multiple = false) {
  return createElementDecorator(vue => vue.$el, selector, multiple);
}
