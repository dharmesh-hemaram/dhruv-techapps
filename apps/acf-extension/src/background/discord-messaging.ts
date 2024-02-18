import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { FUNCTION_URL, VARIANT } from '../common/environments';
import { GoogleAnalytics } from './google-analytics';

type DiscordMessagingType = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Array<{ name: string; value: any }>;
  color: string;
};

export default class DiscordMessaging {
  async push({ title, fields, color }: DiscordMessagingType) {
    if (!FUNCTION_URL) {
      return {};
    }
    try {
      const url = new URL(FUNCTION_URL);
      const { discord } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.DISCORD);
      const data = {
        variant: VARIANT,
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
        new GoogleAnalytics().fireErrorEvent({ name: 'discord-messaging', error: error.message });
      }
      return error;
    }
    return {};
  }
}
