import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_DATABASE } from './firebase-database.constant';

export class FirebaseDatabaseService extends CoreService {
  static async getDiscord<T>() {
    return await this.message<RuntimeMessageRequest, T>({ messenger: RUNTIME_MESSAGE_FIREBASE_DATABASE, methodName: 'getDiscord' });
  }
  static async deleteDiscord() {
    return await this.message<RuntimeMessageRequest>({ messenger: RUNTIME_MESSAGE_FIREBASE_DATABASE, methodName: 'deleteDiscord' });
  }
  static async getProfile() {
    return this.message<RuntimeMessageRequest, boolean>({ messenger: RUNTIME_MESSAGE_FIREBASE_DATABASE, methodName: 'getProfile' });
  }

  static async deleteProfile() {
    return this.message<RuntimeMessageRequest>({ messenger: RUNTIME_MESSAGE_FIREBASE_DATABASE, methodName: 'deleteProfile' });
  }

  static async setProfile(profile: boolean) {
    return this.message<RuntimeMessageRequest<boolean>>({ messenger: RUNTIME_MESSAGE_FIREBASE_DATABASE, methodName: 'setProfile', message: profile });
  }
}
