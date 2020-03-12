import { State } from "@rocketbase/vue-extra-decorators";

// The state decorator can be used in any context, no base class required
export class UserStore {
  // Every decorated property is reactive and initialized to null
  @State public firstName?: string;
  // You can set default values like this
  @State public lastName = "Doe";
  // It works for objects, too
  @State public address?: {
    street: string;
    streetNo: string;
    location: string;
    zip: string;
    country: string;
  };
  // You can specify the default value as a decorator parameter
  @State({ default: "example.com" }) public email?: string;
  // You can also initialize it using a factory
  @State({ default: () => "Anonymous" }) public username!: string;
  // To pass a function as the default value, use literal
  @State({ literal: parseInt }) public parser!: (val: string) => number;

  // You can get and set these values from any context
  public async login(username: string, password: string) {
    // `this` is the same in all methods
    // Some request logic here...
    await this.utilityMethod();
    this.username = username;
  }

  public get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  public set fullName(value: string) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public async utilityMethod() {
    return "foo bar";
  }
}

// You can initialize it like any other class
const instance1 = new UserStore();
// You can have multiple instances of the same store
const instance2 = new UserStore();
