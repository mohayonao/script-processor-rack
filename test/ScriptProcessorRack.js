import "web-audio-test-api";
import assert from "power-assert";
import sinon from "sinon";
import ScriptProcessorRack from "../src/ScriptProcessorRack";

describe("ScriptProcessorRack", () => {
  describe("constructor(audioContext: AudioContext, bufferSize: number): ScriptProcessorNode", () => {
    it("works", () => {
      let audioContext = new global.AudioContext();
      let effector = new ScriptProcessorRack(audioContext);

      assert(effector instanceof global.ScriptProcessorNode);
      assert(effector.context === audioContext);
    });
    it("works with bufferSize", () => {
      let audioContext = new global.AudioContext();
      let effector = new ScriptProcessorRack(audioContext, 512);

      assert(effector instanceof global.ScriptProcessorNode);
      assert(effector.context === audioContext);
      assert(effector.bufferSize === 512);
    });
  });
  describe("#addProcessor(processor: function): void", () => {
    it("works", () => {
      let audioContext = new global.AudioContext();
      let effector = new ScriptProcessorRack(audioContext, 256);
      let processor = sinon.spy(x => x);

      effector.addProcessor(processor);
      effector.connect(audioContext.destination);

      audioContext.$processTo("00:00.100");

      assert(processor.callCount !== 0);
      assert(processor.args[0][0] instanceof Float32Array);
      assert(processor.args[0][0].length === 256);
    });
  });
  describe("#removeProcessor(processor: function): void", () => {
    it("works", () => {
      let audioContext = new global.AudioContext();
      let effector = new ScriptProcessorRack(audioContext, 256);
      let processor = sinon.spy(x => x);

      effector.addProcessor(processor);
      effector.removeProcessor(processor);
      effector.connect(audioContext.destination);

      audioContext.$processTo("00:00.100");

      assert(processor.callCount === 0);
    });
  });
  describe("#dispose(): void", () => {
    it("works", () => {
      let audioContext = new global.AudioContext();
      let effector = new ScriptProcessorRack(audioContext, 256);
      let processor = sinon.spy(x => x);

      effector.addProcessor(processor);
      effector.connect(audioContext.destination);
      effector.dispose();

      audioContext.$processTo("00:00.100");

      assert(processor.callCount === 0);
      assert(effector.onaudioprocess === null);
    });
  });
});
