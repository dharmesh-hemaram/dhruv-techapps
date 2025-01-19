/// <reference types="chrome"/>

export * from './lib';
declare global {
  interface Window {
    __currentAction: number;
    __currentActionName: string;
  }
}
