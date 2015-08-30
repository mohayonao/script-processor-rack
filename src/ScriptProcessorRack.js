import appendIfNotExists from "@mohayonao/utils/appendIfNotExists";
import removeIfExists from "@mohayonao/utils/removeIfExists";

export default class ScriptProcessorRack {
  constructor(audioContext, bufferSize = 1024) {
    let node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    let processors = [];

    node.onaudioprocess = ({ inputBuffer, outputBuffer, playbackTime }) => {
      let input = inputBuffer.getChannelData(0);
      let result = input;

      for (let i = 0, imax = processors.length; i < imax; i++) {
        result = processors[i](result, playbackTime);
      }

      outputBuffer.getChannelData(0).set(result);
    };

    node.addProcessor = (processor) => {
      appendIfNotExists(processors, processor);
    };

    node.removeProcessor = (processor) => {
      removeIfExists(processors, processor);
    };

    node.dispose = () => {
      processors.splice(0);
      node.onaudioprocess = null;
    };

    return node;
  }
}
