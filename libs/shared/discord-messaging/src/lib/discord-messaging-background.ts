import { LOCAL_STORAGE_KEY_DISCORD } from '@dhruv-techapps/discord-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './discord-messaging.constant';

type DiscordMessagingType = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Array<{ name: string; value: any }>;
  color: string;
};

export class DiscordMessagingBackground {
  constructor(
    private VARIANT?: string,
    private FUNCTION_URL?: string
  ) {
    this.VARIANT = VARIANT;
    this.FUNCTION_URL = FUNCTION_URL;
  }

  async push({ title, fields, color }: DiscordMessagingType) {
    if (!this.FUNCTION_URL) {
      throw new Error('Discord Messaging Function URL Missing');
    }
    try {
      const url = new URL(this.FUNCTION_URL);
      const { discord } = await chrome.storage.local.get(LOCAL_STORAGE_KEY_DISCORD);
      const data = {
        variant: this.VARIANT,
        title,
        id: discord.id,
        fields,
        color,
      };
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      throw error;
    }
  }
}
