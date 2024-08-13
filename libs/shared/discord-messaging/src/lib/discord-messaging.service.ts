import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_DISCORD_MESSAGING } from './discord-messaging.constant';

export class DiscordMessagingService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async push(title: string, fields: Array<{ name: string; value: any }>, color: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_DISCORD_MESSAGING, methodName: 'push', message: { title, fields, color } });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async success(title: string, fields: Array<{ name: string; value: any }>) {
    return await this.message({ messenger: RUNTIME_MESSAGE_DISCORD_MESSAGING, methodName: 'push', message: { title, fields, color: '#198754' } });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async error(title: string, fields: Array<{ name: string; value: any }>) {
    return await this.message({ messenger: RUNTIME_MESSAGE_DISCORD_MESSAGING, methodName: 'push', message: { title, fields, color: '#dc3545' } });
  }
}
