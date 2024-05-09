export enum ADDON_CONDITIONS {
  '~~ Select Condition ~~' = '',
  '= Equals' = 'Equals',
  '!= Not Equals' = 'NotEquals',
  '~ Contains' = 'Contains',
  '!~ Not Contains' = 'NotContains',
  '> Greater Than' = 'GreaterThan',
  '< Less Than' = 'LessThan',
  '>= Greater Than Equals' = 'GreaterThanEquals',
  '<= Less Than Equals' = 'LessThanEquals',
  '✓ Is Checked ' = 'IsChecked',
  '✕ Is Not Checked ' = 'IsNotChecked',
}

export enum RECHECK_OPTIONS {
  STOP = 'stop',
  SKIP = 'skip',
  RELOAD = 'reload',
  GOTO = 'goto',
}

export type ValueExtractorFlags = string;

export type Addon = {
  elementFinder: string;
  value: string;
  condition: ADDON_CONDITIONS;
  valueExtractor?: string;
  valueExtractorFlags?: ValueExtractorFlags;
  recheck?: number;
  recheckInterval?: number | string;
  recheckOption: RECHECK_OPTIONS;
  recheckGoto?: number;
};

export const defaultAddon: Addon = {
  elementFinder: '',
  value: '',
  condition: ADDON_CONDITIONS['~~ Select Condition ~~'],
  recheckOption: RECHECK_OPTIONS.SKIP,
};
