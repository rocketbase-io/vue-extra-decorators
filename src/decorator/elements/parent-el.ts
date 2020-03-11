import { createElementDecorator } from "src/decorator/elements/create-element-decorator";

/**
 * Creates a computed property for {@link Vue#$el#querySelector | this.$parent.$el.querySelector}
 * or {@link Vue#$el#querySelectorAll | this.$parent.$el.querySelectorAll}
 *
 * @param selector - The css selector to pass to
 * {@link Vue#$el#querySelector | this.$parent.$el.querySelector} or {@link Vue#$el#querySelectorAll | this.$parent.$el.querySelectorAll}
 * @param multiple - If {@link Vue#$el#querySelectorAll | this.$parent.$el.querySelectorAll} should be used
 *
 * @remarks
 * Preferably use {@link Ref}
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><div id="foo"></div><foo-bar /></div>` })
 * export class ParentComponent extends Vue {}
 *
 * @Component({})
 * export class FooBar extends Vue {
 *   @ParentEl("#foo") private foo!: HTMLDivElement;
 * }
 * ```
 *
 * {@link El} {@link DocumentEl} {@link ParentEl}
 * @public
 * @category Decorator
 */
export function ParentEl(selector?: string, multiple = false) {
  return createElementDecorator(vue => vue.$parent?.$el, selector, multiple);
}
