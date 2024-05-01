export enum RETRY_OPTIONS {
  STOP = 'stop',
  SKIP = 'skip',
  RELOAD = 'reload',
  GOTO = 'goto',
}

export enum AUTO_BACKUP {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  OFF = 'off',
}

export enum STATUS_BAR_LOCATION {
  HIDE = 'hide',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export type SettingsNotifications = {
  onAction: boolean;
  onBatch: boolean;
  onConfig: boolean;
  onError: boolean;
  sound: boolean;
  discord: boolean;
};

export const defaultSettingsNotifications = {
  onAction: false,
  onBatch: false,
  onConfig: false,
  onError: false,
  sound: false,
  discord: false,
};

export type SettingsBackup = {
  autoBackup: AUTO_BACKUP;
  lastBackup?: string;
};

export const defaultSettingsBackup = {
  autoBackup: AUTO_BACKUP.OFF,
};

export type Settings = {
  retry: number;
  retryInterval: number | string;
  retryOption: RETRY_OPTIONS;
  checkiFrames: boolean;
  statusBar: STATUS_BAR_LOCATION;
  backup?: SettingsBackup;
  notifications?: SettingsNotifications;
};

export const defaultSettings: Settings = {
  retry: 5,
  retryInterval: 1,
  statusBar: STATUS_BAR_LOCATION.BOTTOM_RIGHT,
  retryOption: RETRY_OPTIONS.STOP,
  checkiFrames: false,
};

export type Discord = {
  accent_color: number;
  avatar: string;
  banner_color: string;
  discriminator: string;
  displayName?: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
  verified: boolean;
};

export type Google = {
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
};

export type DriveFile = {
  id: string;
  name: string;
  modifiedTime: string;
  content?: string;
};
