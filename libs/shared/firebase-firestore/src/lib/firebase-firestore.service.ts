import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_FIRESTORE } from './firebase-firestore.constant';
import { Product, Subscription } from './firebase-firestore.types';

export class FirebaseFirestoreService extends CoreService {
  static async getProducts() {
    return await this.message<RuntimeMessageRequest, Product[]>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'getProducts' });
  }

  static async getSubscriptions() {
    return await this.message<RuntimeMessageRequest, Subscription[]>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'getSubscriptions' });
  }

  static async subscribe(priceId: string) {
    return await this.message<RuntimeMessageRequest<string>, string>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'subscribe', message: priceId });
  }

  static async getDiscord<T>() {
    return await this.message<RuntimeMessageRequest, T>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'getDiscord' });
  }

  static async setDiscord(discord: unknown) {
    return await this.message<RuntimeMessageRequest<unknown>>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'setDiscord', message: discord });
  }

  static async getProfile() {
    return this.message<RuntimeMessageRequest, boolean>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'getProfile' });
  }

  static async setProfile(profile: boolean) {
    return this.message<RuntimeMessageRequest<boolean>>({ messenger: RUNTIME_MESSAGE_FIREBASE_FIRESTORE, methodName: 'setProfile', message: profile });
  }
}
