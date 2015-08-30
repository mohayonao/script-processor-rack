import assert from "power-assert";
import index from "../src";
import ScriptProcessorRack from "../src/ScriptProcessorRack";

describe("index", () => {
  it("exports", () => {
    assert(index === ScriptProcessorRack);
  });
});
