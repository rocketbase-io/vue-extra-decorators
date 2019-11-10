import {HELLO_WORLD} from "@/index";

describe("Exports", () => {
  it("exports a constant", () => {
    expect(HELLO_WORLD).toBeDefined("HELLO_WORLD was not defined");
    expect(HELLO_WORLD).toEqual("Hello World", "The value exported wasn't 'Hello World'");
  });
});
