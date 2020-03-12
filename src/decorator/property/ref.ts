import { TypedPropertyDecorator } from "src/types";
import { calculatedProp } from "src/vue";

/**
 * Creates an accessor to a Vue reference.
 * @param ref - The reference to bind to.
 *
 * @remarks
 * If you need access to a dom node inside one of the children of this component
 * or one outside of it, you can use {@link El} and its flavours instead.
 *
 * @example
 * ```typescript
 * @Component({ template: `<div><div ref="example">Hello World</div></div>` })
 * class MyVueComponent extends Vue {
 *   @Ref("example") private example!: HTMLDivElement;
 *   private someMethod() {
 *     const {scrollLeft, clientWidth} = this.example;
 *     this.example.scrollTo({ left: scrollLeft + clientWidth * .6, behavior: "smooth" });
 *   }
 * }
 * ```
 *
 * @public
 * @category Decorator
 */
export function Ref(ref: string): TypedPropertyDecorator<any> {
  return calculatedProp(function() {
    return this.$refs[ref as any];
  });
}
