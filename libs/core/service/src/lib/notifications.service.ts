import { generateUUID } from '@dhruv-techapps/core-common';
import { NotificationsRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class NotificationsService extends CoreService {
  static async create(options: chrome.notifications.NotificationOptions<true>, notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId, options }, methodName: 'create' });
  }

  static async update(options: chrome.notifications.NotificationOptions<false>, notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId, options }, methodName: 'update' });
  }

  static async clear(notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId }, methodName: 'clear' });
  }
}
