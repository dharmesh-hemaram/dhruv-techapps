export enum RUNTIME_MESSAGE_ACF {
  DISCORD_OAUTH2 = 'discord-oauth',
  DISCORD_MESSAGING = 'discord-messaging',
  GOOGLE_SHEETS = 'google-sheets',
  GOOGLE_OAUTH2 = 'google-oauth',
  GOOGLE_BACKUP = 'google-backup',
  TABS = 'tabs',
  GOOGLE_ANALYTICS = 'google-analytics',
}

export type RuntimeMessageRequest = {
  messenger: RUNTIME_MESSAGE_ACF;
  methodName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
};
