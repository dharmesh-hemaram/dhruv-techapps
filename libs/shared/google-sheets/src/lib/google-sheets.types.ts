enum Dimension {
  ROWS,
  COLUMNS,
}

export type ValueRange = {
  range: string;
  majorDimension: Dimension;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Array<any>;
};

export type Sheets = {
  [index: string]: {
    startRange: string;
    endRange: string;
    sessionCount?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Array<any>;
  };
};
