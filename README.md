# SCRIPT PROCESSOR RACK
[![Build Status](http://img.shields.io/travis/mohayonao/script-processor-rack.svg?style=flat-square)](https://travis-ci.org/mohayonao/script-processor-rack)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/script-processor-rack.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/script-processor-rack)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> ScriptProcessorRackNode for Web Audio API

## Installation

Node.js

```
npm install @mohayonao/script-processor-rack
```

## Example

```js
import ScriptProcessorRack from "@mohayonao/script-processor-rack";
import fetchAudioBuffer from "@mohayonao/web-audio-utils/fetchAudioBuffer";
import Reduction from "./Reduction";

class OnePole {
  constructor(coef, bufferSize) {
    this.output = new Float32Array(bufferSize);
    this.b1 = coef;
    this.y1 = 0;
  }

  process(input) {
    let output = this.output;
    let y0, y1 = this.y1, b1 = this.b1;

    if (b1 >= 0) {
      for (let i = 0, imax = input.length; i < imax; ++i) {
        y0 = input[i];
        output[i] = y1 = y0 + b1 * (y1 - y0);
      }
    } else {
      for (let i = 0, imax = input.length; i < imax; ++i) {
        y0 = input[i];
        output[i] = y1 = y0 + b1 * (y1 + y0);
      }
    }

    this.y1 = y1;

    return output;
  }
}

let audioContext = new AudioContext();
let bufferSource = audioContext.createBufferSource();
let effector = new ScriptProcessorRack(audioContext, 512);

fetchAudioBuffer("./amen.wav", audioContext).then((audioBuffer) => {
  bufferSource.buffer = audioBuffer;
  bufferSource.start();

  effector.addProcessor(new OnePole(0.95, effector.bufferSize)::process);
  effector.addProcessor(new Reduction(0.8, effector.bufferSize)::process);

  bufferSource.connect(effector);
  effector.connect(audioContext.destination);

  setTimeout(() => {
    bufferSource.stop();
    bufferSource.disconnect();
    effector.disconnect();
  }, 1000);  
})
```

## API
- `constructor(audioContext: AudioContext, [ bufferSize: number ]): ScriptProcessorNode`

### Instance attributes
- `context: AudioContext` _readonly_
- `bufferSize: number` _readonly_

### Instance methods
- `addProcessor(func: function): void`
- `removeProcessor(func: function): void`
- `connect(...args): void`
- `disconnect(...args): void`
- `dispose(): void`

## License
MIT
