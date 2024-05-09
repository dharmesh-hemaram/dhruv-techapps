/* eslint-disable @typescript-eslint/no-explicit-any */
enum Dimension {
  ROWS,
  COLUMNS,
}

export type ValueRange = {
  range: string;
  majorDimension: Dimension;
  values: Array<any>;
};

export type Sheets = {
  [index: string]: {
    startRange: string;
    endRange: string;
    values: Array<any>;
  };
};
