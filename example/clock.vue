<template>
  <div :class="classes">
    <span class="example-clock__hours" v-text="hours" />
    <span class="example-clock__separator">:</span>
    <span class="example-clock__minutes" v-text="minutes" />
    <span class="example-clock__separator">:</span>
    <span class="example-clock__seconds" v-text="seconds" />
    <span class="example-clock__separator" v-if="ms" >.</span>
    <span class="example-clock__millis" v-if="ms" v-text="millis" />
  </div>
</template>

<script lang="ts">
import { BProp, ClassesKebap, Component, Data, Every, Vue } from "@rocketbase/vue-extra-decorators";

@Component({})
export default class ExampleClock extends Vue {

  // Define a boolean property, defaulting to false
  @BProp()
  private ms!: boolean;

  // Convert class name and returned key names to kebap-case and prefix
  // all returned members with the class name and "--"
  // e.g. { "example-clock": true, "example-clock--ms": false }
  @ClassesKebap()
  private get classes() {
    const { ms } = this;
    return { ms };
  }

  // Define a data property, defaulting to a new Date object.
  @Data({ default: () => new Date() })
  private time!: Date;

  private get hours() {
    return this.time.toString().padStart(2, "0");
  }

  private get minutes() {
    return this.time.toString().padStart(2, "0");
  }

  private get seconds() {
    return this.time.toString().padStart(2, "0");
  }

  private get millis() {
    return this.time.toString().padStart(3, "0");
  }

  // Execute this method every 100 ms until the component is destroyed
  @Every(100)
  private onTick() {
    this.time = new Date();
  }

}
</script>

<style>
.example-clock {
  font-family: monospace;
  color: #333333;
  border: 2px solid #333333;
  font-size: 20px;
  padding: 5px 10px;
}
.example-clock__millis {
  font-size: 16px;
  color: #555555;
}
</style>
