import { RANDOM_UUID } from '../common';
import { Action, getDefaultAction } from './action-model';
import { Batch } from './batch-model';

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

export enum URL_MATCH {
  REGEX = 'regex',
  EXACT = 'exact',
}

export type Configuration = {
  url: string;
  updated?: boolean;
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
  url_match?: URL_MATCH;
  download?: boolean;
};

export const getDefaultConfig = (source?: CONFIG_SOURCE, actions?: Array<Action>): Configuration => ({
  url: '',
  source,
  id: crypto.randomUUID(),
  enable: true,
  startType: START_TYPES.AUTO,
  loadType: LOAD_TYPES.WINDOW,
  actions: actions || [getDefaultAction()],
  updated: true,
});
