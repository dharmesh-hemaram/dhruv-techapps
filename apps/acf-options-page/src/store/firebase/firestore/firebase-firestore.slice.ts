import { RootState } from '@apps/acf-options-page/src/store';
import { createSlice } from '@reduxjs/toolkit';
import { profileGetAPI, profileSetAPI } from './firebase-firestore.api';

type FirebaseFirestoreStore = {
  profile: boolean;
};

const initialState: FirebaseFirestoreStore = { profile: false };

const slice = createSlice({
  name: 'firebaseFirestore',
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

export const firebaseFirestoreSelector = (state: RootState) => state.firebaseFirestore;
export const firebaseFirestoreReducer = slice.reducer;
