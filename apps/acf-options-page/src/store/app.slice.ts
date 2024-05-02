import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ManifestService } from '@dhruv-techapps/core-service';
import { NO_EXTENSION_ERROR } from '../constants';

export const getManifest = createAsyncThunk('app/getManifest', async () => {
  if (window.chrome?.runtime) {
    const manifest = await ManifestService.values(window.EXTENSION_ID, ['name', 'version']);
    return manifest;
  }
  throw new Error(NO_EXTENSION_ERROR[0]);
});

type AppStore = {
  manifest?: Partial<chrome.runtime.Manifest>;
  error?: string;
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
          window.dataLayer.push({ event: 'modal', name: 'extension_not_found', visibility: !state.extensionNotFound });
          state.extensionNotFound = !state.extensionNotFound;
        }
      }
    });
  },
});

export const { switchExtensionNotFound, setAppError, setManifest } = slice.actions;

export const appSelector = (state: RootState) => state.app;

export default slice.reducer;
