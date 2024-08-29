import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_STORAGE } from './firebase-storage.constant';

export class FirebaseDatabaseService extends CoreService {
  static async downloadFile(path: string) {
    return await this.message<RuntimeMessageRequest<string>>({ messenger: RUNTIME_MESSAGE_FIREBASE_STORAGE, methodName: 'downloadFile', message: path });
  }
}
