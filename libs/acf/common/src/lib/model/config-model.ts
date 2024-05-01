import { Batch } from './batch-model';
import { Action, getDefaultAction } from './action-model';
import { RANDOM_UUID } from '../common';

export enum LOAD_TYPES {
  WINDOW = 'window',
  DOCUMENT = 'document',
}

export enum START_TYPES {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export const defaultHotkey = 'Ctrl + Shift + A';

export enum CONFIG_SOURCE {
  WIZARD = 'wizard',
  WEB = 'web',
}

export type Configuration = {
  url: string;
  enable: boolean;
  startType: START_TYPES;
  loadType: LOAD_TYPES;
  actions: Array<Action>;
  id: RANDOM_UUID;
  configId?: number;
  name?: string;
  initWait?: number;
  startTime?: string;
  spreadsheetId?: string;
  hotkey?: string;
  batch?: Batch;
  source?: CONFIG_SOURCE;
  new?: boolean;
};

export const getDefaultConfig = (source?: CONFIG_SOURCE, actions?: Array<Action>): Configuration => ({
  url: '',
  source,
  id: crypto.randomUUID(),
  enable: true,
  startType: START_TYPES.AUTO,
  loadType: LOAD_TYPES.WINDOW,
  actions: actions || [getDefaultAction()],
});
