<template>
  <div :class="classes">
    <div class="example-dialog__body" ref="body">
      <div class="example-dialog__header">
        <slot name="header">
          <h3 v-text="heading" v-if="heading" />
        </slot>
      </div>

      <div class="example-dialog__content">
        <slot />
      </div>

      <div class="example-dialog__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  BProp,
  ClassesKebap,
  Component,
  Data,
  IfNot,
  isInPath,
  OnDocument,
  SProp,
  Vue,
  wasPrevented
} from "@rocketbase/vue-extra-decorators";

@Component({})
export default class ExampleDialog extends Vue {

  // Define a string property, defaulting to null
  @SProp()
  public heading?: string;

  // Define a boolean property, defaulting to false
  @BProp()
  public busy!: boolean;

  // Define a boolean property, defaulting to false
  @BProp()
  public closable!: boolean;

  // Define a boolean data property, defaulting to false
  @Data({ default: false })
  private open!: boolean;

  // Convert class name and returned key names to kebap-case and prefix
  // all returned members with the class name and "--"
  // e.g. { "example-dialog": true, "example-dialog--busy": false, "example-dialog--open": true, "example-dialog--closable": true }
  @ClassesKebap()
  private get classes() {
    const { busy, closable, open } = this;
    return { busy, closable, open };
  }

  // Use mousedown instead of click so the dialog doesn't close on mouseup outside dialog
  // if the initial mousedown was inside
  @OnDocument("mousedown")
  // Only if both predicates return falsy, is the method executed
  // wasPrevented checks if the first parameter (assumed event) was prevented
  // isInPath checks if the vue ref "body" (see template) is inside the composed path of the event
  @IfNot(wasPrevented, isInPath("body"))
  private onClickOutside() {
    if (this.closable) this.open = false;
  }

}
</script>
