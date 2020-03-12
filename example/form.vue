<template>
  <form :class="classes" @submit.prevent="onSave">
    <h3>Register</h3>

    <label class="example-form__label" for="username">Username</label>
    <input class="example-form__input" name="username" id="username" v-model="data.username" :disabled="busy">

    <label class="example-form__label" for="firstname">First Name</label>
    <input class="example-form__input" name="firstname" id="firstname" v-model="data.firstname" :disabled="busy">

    <label class="example-form__label" for="lastname">Last Name</label>
    <input class="example-form__input" name="lastname" id="lastname" v-model="data.lastname" :disabled="busy">

    <label class="example-form__label" for="email">Email</label>
    <input class="example-form__input" name="email" id="email" type="email" v-model="data.email" :disabled="busy">

    <label class="example-form__label" for="password">Name</label>
    <input class="example-form__input" name="password" id="password" v-model="data.password" :disabled="busy">

    <button class="example-form__button" type="submit"  :disabled="invalid || busy" />
  </form>
</template>

<script lang="ts">
import { Blocking, BusyState, ClassesKebap, Component, Data, Delay, EmitOnStatusCode, IDWatch, On, Prop, Vue } from "@rocketbase/vue-extra-decorators";

export interface ExampleFormData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Component({})
export default class ExampleForm extends Vue {

  // Support v-model for this property
  @Prop({ default: () => ({}), model: true })
  public value!: ExampleFormData;

  // Sync data with property value and emit update:value events on setting
  @Data({ sync: "value" })
  private data!: ExampleFormData;

  // Execution state of blocking methods (see onSave)
  @BusyState()
  private busy!: boolean;

  // Data property, initialized to false
  @Data({ default: false })
  private invalid!: boolean;

  // Convert class name and returned key names to kebap-case and prefix
  // all returned members with the class name and "--"
  // e.g. { "example-form": true, "example-form--busy": false, "example-form--invalid": true }
  @ClassesKebap()
  private get classes() {
    const { busy, invalid } = this;
    return { busy, invalid };
  }

  // Watch property data, both immediately and deeply
  @IDWatch("data")
  private onDataChange(data: ExampleFormData) {
    this.invalid = !data.firstname || !data.lastname || !data.email || !data.password;
  }

  // Set busy state to true while executing, also blocking other blocking methods
  @Blocking()
  // Delay all calls by 2s for demonstration of busy state
  @Delay(2000)
  // Emit success events with the returned value for every response-ish return value with status code 200
  @EmitOnStatusCode(200, "success")
  // Emit error events with the returned value for every response-ish error with status code 400
  @EmitOnStatusCode(400, "error")
  private async onSave() {
    const data = this.data;
    // Errors are supported as axios like errors, responses, status codes or text starting with a status code
    if (Math.random() > .5)
      throw new Error("400 Bad Request");
    // Errors are supported as axios like return values, responses, status codes or text starting with a status code
    return {
      response: {
        status: 200,
        data: Object.assign({ id: 0 }, data)
      }
    }
  }

  // Attaches an event handler
  @On("success")
  private onSuccess({ response: { data } }) {
    alert(`User ${data.username} created successfully! id: ${data.id}`);
  }

  @On("error")
  private onError(error: Error) {
    alert(error);
  }
}
</script>

<style>
.example-form {
  font-family: Arial, serif;
  transition: opacity .3s linear, color .1s linear;
}
.example-form--busy {
  opacity: .6;
}
.example-form--invalid {
  color: #cd555b;
}

.example-form__input:after {
  content: ":";
}

.example-form__input {
  width: 100%;
  text-align: center;
  padding: 5px 10px;
  font-size: 20px;
  border: none;
  outline: none;
  background: transparent;
  border-bottom: 2px solid #0386b3;
  transition: border-bottom-color .1s linear;
}
.example-form__input:focus {
  border-bottom: 2px solid #22b7cb;
}

.example-form__label {
  display: block;
  margin: 10px 0 0 10px;
  color: #333333;
  font-size: 16px;
}

.example-form__button {
  padding: 5px 10px;
  font-size: 20px;
  color: #eeeeee;
  background: #0386b3;
  border: none;
  outline: none;
  border-radius: 3px;
  transition: background-color .1s linear, opacity .1s linear;
}
.example-form__button:focus {
  background: #22b7cb;
}
.example-form__button[disabled] {
  opacity: .6;
}
</style>
