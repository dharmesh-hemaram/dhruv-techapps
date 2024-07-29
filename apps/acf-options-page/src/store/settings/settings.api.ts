import { LOCAL_STORAGE_KEY, Settings } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { GOOGLE_SCOPES, GoogleOauthService } from '@dhruv-techapps/google-oauth';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const settingsGetAPI = createAsyncThunk('settings/get', async () => {
  const result = await StorageService.get<LOCAL_STORAGE_KEY.SETTINGS, Settings>(LOCAL_STORAGE_KEY.SETTINGS);
  return result.settings;
});

export const googleGetAPI = createAsyncThunk('google/get', async () => {
  const result = await StorageService.get([LOCAL_STORAGE_KEY.GOOGLE, LOCAL_STORAGE_KEY.GOOGLE_SCOPES]);
  return result;
});

export const googleLoginAPI = createAsyncThunk('google/login', async (scope: GOOGLE_SCOPES) => {
  const response = await GoogleOauthService.login(scope);
  return response;
});

export const googleLogoutAPI = createAsyncThunk('google/logout', async (scope: GOOGLE_SCOPES) => {
  const response = await GoogleOauthService.remove(scope);
  return response;
});
