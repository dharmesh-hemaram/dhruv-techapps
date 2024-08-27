import { FirebaseRole, User } from '@dhruv-techapps/firebase-oauth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { firebaseIsLoginAPI, firebaseLoginAPI, firebaseLogoutAPI } from './firebase-login.api';

type FirebaseStore = {
  visible: boolean;
  error?: string;
  message?: string;
  isLoading: boolean;
  user?: User | null;
  role?: FirebaseRole;
};

const initialState: FirebaseStore = { visible: false, isLoading: false };

const slice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    switchFirebaseLoginModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'firebase-login', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setFirebaseLoginMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setFirebaseLoginError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(firebaseIsLoginAPI.fulfilled, (state, action) => {
      if (action.payload?.user) {
        state.user = action.payload.user;
        state.role = action.payload.role;
      }
    });
    builder.addCase(firebaseIsLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(firebaseLoginAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(firebaseLoginAPI.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.role = action.payload.role;
      }
      state.isLoading = false;
      state.visible = false;
    });
    builder.addCase(firebaseLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(firebaseLogoutAPI.fulfilled, (state) => {
      delete state.user;
      delete state.role;
    });
    builder.addCase(firebaseLogoutAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const { switchFirebaseLoginModal, setFirebaseLoginMessage, setFirebaseLoginError } = slice.actions;

export const firebaseSelector = (state: RootState) => state.firebase;
export const firebaseReducer = slice.reducer;
