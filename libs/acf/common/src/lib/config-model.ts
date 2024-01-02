import { Batch } from './batch-model';
import { Action, defaultAction } from './action-model';

export enum LOAD_TYPES {
  WINDOW = 'window',
  DOCUMENT = 'document',
}

export enum START_TYPES {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export const defaultHotkey = 'Ctrl + Shift + A';

export type Configuration = {
  url: string;
  enable: boolean;
  startType: START_TYPES;
  loadType: LOAD_TYPES;
  actions: Array<Action>;
  id?: string;
  configId?: number;
  name?: string;
  initWait?: number;
  startTime?: string;
  spreadsheetId?: string;
  hotkey?: string;
  batch?: Batch;
  new?: boolean;
};

export const defaultConfig: Configuration = {
  url: '',
  enable: true,
  startType: START_TYPES.AUTO,
  loadType: LOAD_TYPES.WINDOW,
  actions: [{ ...defaultAction }],
};
