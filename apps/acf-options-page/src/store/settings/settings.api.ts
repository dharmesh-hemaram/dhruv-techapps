import { Discord, LOCAL_STORAGE_KEY, Settings } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { DiscordOauthService } from '@dhruv-techapps/discord-oauth';
import { FirebaseFirestoreService } from '@dhruv-techapps/firebase-firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const settingsGetAPI = createAsyncThunk('settings/get', async () => {
  const result = await StorageService.get<LOCAL_STORAGE_KEY.SETTINGS, Settings>(LOCAL_STORAGE_KEY.SETTINGS);
  return result.settings;
});

export const discordGetAPI = createAsyncThunk('discord/get', async () => {
  const result = await FirebaseFirestoreService.getDiscord<Discord>();
  return result;
});

export const discordLoginAPI = createAsyncThunk('discord/login', async () => {
  const result = await DiscordOauthService.login();
  return result;
});

export const discordDeleteAPI = createAsyncThunk('discord/delete', async () => {
  const result = await FirebaseFirestoreService.setDiscord(null);
  return result;
});
