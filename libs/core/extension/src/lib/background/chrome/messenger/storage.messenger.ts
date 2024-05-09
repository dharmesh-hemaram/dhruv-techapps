// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageMessengerSetProps<T extends string | number | symbol = string, K = any> = {
  [key in T]: K;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageMessengerGetProps = string | string[] | StorageMessengerSetProps | null | undefined;

export type StorageMessengerRemoveProps = string | string[];

export type StorageRequest = {
  messenger: 'storage';
  methodName: 'get' | 'set' | 'remove';
  message: StorageMessengerGetProps | StorageMessengerSetProps | StorageMessengerRemoveProps;
};

export class StorageMessenger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(keys: StorageMessengerGetProps): Promise<StorageMessengerSetProps> {
    return chrome.storage.local.get(keys);
  }

  async set(items: StorageMessengerSetProps): Promise<void> {
    return chrome.storage.local.set(items);
  }

  async remove(keys: StorageMessengerRemoveProps): Promise<void> {
    return chrome.storage.local.remove(keys);
  }
}
