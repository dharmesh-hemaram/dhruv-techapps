import { RootState } from '@apps/acf-options-page/src/store';
import { createSlice } from '@reduxjs/toolkit';
import { profileGetAPI, profileSetAPI } from './firebase-database.api';

type FirebaseDatabaseStore = {
  profile: boolean;
};

const initialState: FirebaseDatabaseStore = { profile: false };

const slice = createSlice({
  name: 'firebaseDatabase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(profileGetAPI.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(profileSetAPI.fulfilled, (state) => {
      state.profile = !state.profile;
    });
  },
});

export const firebaseDatabaseSelector = (state: RootState) => state.firebaseDatabase;
export const firebaseDatabaseReducer = slice.reducer;
