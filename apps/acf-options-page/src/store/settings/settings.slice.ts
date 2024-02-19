import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AUTO_BACKUP, GOOGLE_SCOPES, LOCAL_STORAGE_KEY, RESPONSE_CODE, Settings, defaultSettings, defaultSettingsNotifications } from '@dhruv-techapps/acf-common';
import { googleGetAPI, googleLoginAPI, settingsGetAPI } from './settings.api';

type SettingsStore = {
  visible: boolean;
  loading: boolean;
  error?: string;
  settings: Settings;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  google?: any;
  googleScopes: Array<GOOGLE_SCOPES>;
};

type SettingsAction = {
  name: string;
  value: boolean;
};

const initialState: SettingsStore = { visible: false, loading: true, settings: defaultSettings, googleScopes: [] };

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'global_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    updateSettings: (state, action: PayloadAction<SettingsAction>) => {
      const { name, value } = action.payload;
      state.settings[name] = value;
    },
    updateSettingsNotification: (state, action: PayloadAction<SettingsAction>) => {
      const { name, value } = action.payload;
      if (state.settings.notifications) {
        state.settings.notifications[name] = value;
      } else {
        state.settings.notifications = { ...defaultSettingsNotifications, [name]: value };
      }
    },
    updateSettingsBackup: (state, action: PayloadAction<AUTO_BACKUP>) => {
      if (state.settings.backup) {
        state.settings.backup.autoBackup = action.payload;
      } else {
        state.settings.backup = { autoBackup: action.payload };
      }
    },
    setSettingsError: (state, action) => {
      state.error = action.payload;
      state.message = undefined;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(settingsGetAPI.fulfilled, (state, action) => {
      if (action.payload && Object.keys(action.payload).length) {
        state.settings = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(settingsGetAPI.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(googleGetAPI.fulfilled, (state, action) => {
      state.google = action.payload[LOCAL_STORAGE_KEY.GOOGLE];
      state.googleScopes = action.payload[LOCAL_STORAGE_KEY.GOOGLE_SCOPES] || [];
    });
    builder.addCase(googleLoginAPI.fulfilled, (state, action) => {
      if (action.payload !== RESPONSE_CODE.ERROR) {
        state.google = action.payload[LOCAL_STORAGE_KEY.GOOGLE];
        state.googleScopes = action.payload[LOCAL_STORAGE_KEY.GOOGLE_SCOPES];
      }
    });
    builder.addCase(googleLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const { switchSettingsModal, setSettingsError, updateSettings, setSettingsMessage, updateSettingsNotification, updateSettingsBackup } = slice.actions;

export const settingsSelector = (state: RootState) => state.settings;

export const settingsReducer = slice.reducer;
