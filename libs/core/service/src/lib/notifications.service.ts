import { NotificationsRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class NotificationsService extends CoreService {
  static async create(extensionId: string, options: chrome.notifications.NotificationOptions<true>, notificationId: string = crypto.randomUUID()) {
    return await this.message<NotificationsRequest>(extensionId, { messenger: 'notifications', message: { notificationId, options }, methodName: 'create' });
  }

  static async update(extensionId: string, options: chrome.notifications.NotificationOptions<false>, notificationId: string = crypto.randomUUID()) {
    return await this.message<NotificationsRequest>(extensionId, { messenger: 'notifications', message: { notificationId, options }, methodName: 'update' });
  }

  static async clear(extensionId: string, notificationId: string = crypto.randomUUID()) {
    return await this.message<NotificationsRequest>(extensionId, { messenger: 'notifications', message: { notificationId }, methodName: 'clear' });
  }
}
