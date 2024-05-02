import { LOCAL_STORAGE_KEY_DISCORD } from '@dhruv-techapps/discord-oauth';

type DiscordMessagingType = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Array<{ name: string; value: any }>;
  color: string;
};

export class DiscordMessaging {
  constructor(
    private VARIANT?: string,
    private FUNCTION_URL?: string
  ) {
    this.VARIANT = VARIANT;
    this.FUNCTION_URL = FUNCTION_URL;
  }

  async push({ title, fields, color }: DiscordMessagingType) {
    if (!this.FUNCTION_URL) {
      return {};
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
      // TODO
      // if (error instanceof Error) {
      //   new GoogleAnalytics().fireErrorEvent({ name: 'discord-messaging', error: error.message });
      // }
      return error;
    }
    return {};
  }
}
