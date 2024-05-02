export type RuntimeMessageRequest<T = undefined> = {
  messenger: string;
  methodName: string;
  message?: T;
};
