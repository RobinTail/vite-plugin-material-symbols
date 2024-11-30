import {describe, it, expect} from "bun:test";
import plugin from "./index";

describe("Entrypoint", () => {
  it("should be a function", () => {
    expect(plugin).toBeFunction();
  });

  it("should return object of certain structure", () => {
    expect(plugin()).toMatchSnapshot();
  });
})
