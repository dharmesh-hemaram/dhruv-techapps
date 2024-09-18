import { FirebaseFunctionsBackground } from '@dhruv-techapps/firebase-functions';
import { Auth } from '@dhruv-techapps/firebase-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './discord-messaging.constant';
import { DiscordMessagingType } from './discord-messaging.types';

export class DiscordMessagingBackground extends FirebaseFunctionsBackground {
  constructor(
    auth: Auth,
    cloudFunctionUrl: string,
    edgeClientId?: string,
    private VARIANT?: string
  ) {
    super(auth, cloudFunctionUrl, edgeClientId);
    this.VARIANT = VARIANT;
  }

  async push(data: DiscordMessagingType) {
    try {
      data.variant = this.VARIANT;
      const { error } = await this.discordNotify<DiscordMessagingType, { error: string }>(data);
      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
    }
  }
}
