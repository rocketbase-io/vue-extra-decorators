import { EntriesOf, TypedPropertyDecorator } from "../types";
import { extendOptionMember } from "./extend-option-member";
import { createDecorator } from "vue-class-component";
import { ComponentOptions } from "vue";

/**
 * Creates a vue decorator extending vue component options by the result of a factory function.
 * @param members - The factory function constructing the properties to merge.
 * @internal
 */
export function optionsExtension<P = any, T extends ComponentOptions = ComponentOptions>(
  members: (key: string, options: T, type: any) => Partial<T>
): TypedPropertyDecorator<P> {
  return ((target: any, key: string) => {
    const theType =
      (Reflect && "getMetadata" in Reflect && (Reflect as any).getMetadata("design:type", target, key)) || undefined;
    return createDecorator((options, key) => {
      for (const [member, value] of Object.entries(members(key, options as T, theType)) as EntriesOf<T>)
        extendOptionMember(options as T, member, value!);
      return options;
    })(target, key);
  }) as TypedPropertyDecorator<P>;
}
