import { ActionSettings, defaultActionSettings } from '@dhruv-techapps/acf-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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
      state.message = undefined;
    },
    updateActionSettingsGoto: (state, action: PayloadAction<number>) => {
      state.settings.retryGoto = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      state.settings = action.payload.settings || { ...defaultActionSettings };
      state.visible = !state.visible;
    });
  },
});

export const { updateActionSettings, switchActionSettingsModal, updateActionSettingsGoto, setActionSettingsMessage, setActionSettingsError } = slice.actions;

export const actionSettingsSelector = (state: RootState) => state.actionSettings;
export const actionSettingsReducer = slice.reducer;
