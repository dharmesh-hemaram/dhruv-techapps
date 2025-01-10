import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NO_EXTENSION_ERROR } from '../constants';
import { RootState } from '../store';
import { getManifest } from './app.api';

type AppStore = {
  manifest?: Partial<chrome.runtime.Manifest>;
  error?: string;
  errorButton?: boolean;
  loading: boolean;
  extensionNotFound: boolean;
};

const initialState: AppStore = {
  loading: true,
  extensionNotFound: false,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setManifest: (state, action) => {
      state.manifest = action.payload;
      state.loading = false;
    },
    setAppError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    switchExtensionNotFound: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      window.dataLayer.push({ event: 'modal', name: 'extension_not_found', visibility: !state.extensionNotFound });
      state.extensionNotFound = !state.extensionNotFound;
      if (action.payload) {
        state.error = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getManifest.fulfilled, (state, action) => {
      state.manifest = action.payload;
      state.loading = false;
    });
    builder.addCase(getManifest.rejected, (state, action) => {
      state.loading = false;
      const error = action.error.message;
      if (error) {
        state.error = error;
        if (NO_EXTENSION_ERROR.includes(error)) {
          state.error = "Kindly download the extension first. If it's already installed, please refresh the page to proceed.";
          state.errorButton = true;
          window.dataLayer.push({ event: 'modal', name: 'extension_not_found', visibility: !state.extensionNotFound });
          // state.extensionNotFound = !state.extensionNotFound; // Temporarily disable this line
        }
      }
    });
  },
});

export const { switchExtensionNotFound, setAppError, setManifest } = slice.actions;

export const appSelector = (state: RootState) => state.app;

export default slice.reducer;
