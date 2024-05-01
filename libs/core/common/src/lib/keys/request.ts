export type RuntimeMessageRequest<T> = {
  messenger: string;
  methodName: string;
  message?: T;
};
