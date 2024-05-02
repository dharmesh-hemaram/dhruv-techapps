import { CoreService } from './service';
import { StorageMessengerGetProps, StorageMessengerRemoveProps, StorageMessengerSetProps, StorageRequest } from '@dhruv-techapps/core-extension';

export class StorageService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async get<T extends string | number | symbol = string, K = any>(extensionId: string, keys: StorageMessengerGetProps) {
    return await this.message<StorageRequest, StorageMessengerSetProps<T, K>>(extensionId, { messenger: 'storage', methodName: 'get', message: keys });
  }

  static async set(extensionId: string, items: StorageMessengerSetProps) {
    return await this.message<StorageRequest>(extensionId, { messenger: 'storage', methodName: 'set', message: items });
  }

  static async remove(extensionId: string, keys: StorageMessengerRemoveProps) {
    return await this.message<StorageRequest>(extensionId, { messenger: 'storage', methodName: 'remove', message: keys });
  }
}
