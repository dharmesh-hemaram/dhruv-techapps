import * as ACFCommon from './common';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ACFCommon: any;
  }
}

window.ACFCommon = ACFCommon;
