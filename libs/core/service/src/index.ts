/// <reference types="chrome"/>

declare global {
  interface Window {
    EXTENSION_ID: string;
  }
}

export * from './lib';
