import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

export enum GOOGLE_LOCAL_STORAGE_KEY {
  GOOGLE = 'google',
  GOOGLE_SCOPES = 'google-scopes',
}
export enum GOOGLE_SCOPES {
  SHEETS = 'https://www.googleapis.com/auth/spreadsheets.readonly',
  PROFILE = 'https://www.googleapis.com/auth/userinfo.profile',
  DRIVE = 'https://www.googleapis.com/auth/drive.appdata',
}

export type GoogleOauth2LoginResponse = {
  [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: Array<GOOGLE_SCOPES>;
  [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE]: any;
};

export type GoogleOauth2RemoveResponse = RESPONSE_CODE.REMOVED;
