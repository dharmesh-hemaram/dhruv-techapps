import { FirebaseDatabaseService } from '@dhruv-techapps/firebase-database';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const profileGetAPI = createAsyncThunk('profile/get', async () => {
  const result = await FirebaseDatabaseService.getProfile();
  return result;
});

export const profileSetAPI = createAsyncThunk('profile/set', async (profile: boolean) => {
  const result = await FirebaseDatabaseService.setProfile(profile);
  return result;
});

export const profileDeleteAPI = createAsyncThunk('profile/delete', async () => {
  const result = await FirebaseDatabaseService.deleteDiscord();
  return result;
});
