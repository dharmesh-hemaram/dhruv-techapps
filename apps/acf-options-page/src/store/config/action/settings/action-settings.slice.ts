import { ActionSettings, defaultActionSettings, GOTO } from '@dhruv-techapps/acf-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../../../store';
import { openActionSettingsModalAPI } from './action-settings.api';

type ActionSettingsStore = {
  visible: boolean;
  error?: string;
  message?: string;
  settings: ActionSettings;
};

type ActionSettingsRequest = { name: string; value: boolean };

const initialState: ActionSettingsStore = { visible: false, settings: { ...defaultActionSettings } };

const slice = createSlice({
  name: 'actionSettings',
  initialState,
  reducers: {
    updateActionSettings: (state, action: PayloadAction<ActionSettingsRequest>) => {
      const { name, value } = action.payload;
      state.settings[name] = value;
    },
    switchActionSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionSettingsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    },
    updateActionSettingsGoto: (state, action: PayloadAction<GOTO>) => {
      state.settings.retryGoto = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      if (action.payload.settings) {
        state.settings = { ...action.payload.settings, retryGoto: action.payload.retryGoto };
      } else {
        state.settings = { ...defaultActionSettings };
      }
      state.visible = !state.visible;
    });
  },
});

export const { updateActionSettings, switchActionSettingsModal, updateActionSettingsGoto, setActionSettingsMessage, setActionSettingsError } = slice.actions;

export const actionSettingsSelector = (state: RootState) => state.actionSettings;
export const actionSettingsReducer = slice.reducer;
