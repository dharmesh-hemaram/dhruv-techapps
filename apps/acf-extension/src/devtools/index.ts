import { ConvertRecording, ConvertStep } from './converter';
import { Recording, Step } from './index.types';

export class RecorderPlugin {
  stringify(recording: Recording) {
    return Promise.resolve(JSON.stringify(ConvertRecording(recording)));
  }
  stringifyStep(step: Step) {
    return Promise.resolve(JSON.stringify(ConvertStep(step)));
  }
}

/* eslint-disable no-undef */
chrome.devtools.recorder.registerRecorderExtensionPlugin(new RecorderPlugin(), 'Auto Clicker Auto Fill', 'application/json');
