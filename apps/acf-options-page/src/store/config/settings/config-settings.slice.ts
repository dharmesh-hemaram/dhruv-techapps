import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

type ConfigSettingsStore = {
  visible: boolean;
  error?: string;
  message?: string;
  dev: boolean;
};

const initialState: ConfigSettingsStore = { visible: false, dev: !!localStorage.getItem('DEV') };

const slice = createSlice({
  name: 'configSettings',
  initialState,
  reducers: {
    switchConfigSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'config_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setConfigSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.error = undefined;
      state.message = action.payload;
    },
    setConfigSettingsError: (state, action: PayloadAction<string>) => {
      state.message = undefined;
      state.error = action.payload;
    },
  },
});

export const { switchConfigSettingsModal, setConfigSettingsMessage, setConfigSettingsError } = slice.actions;

export const configSettingsSelector = (state: RootState) => state.configSettings;
export const configSettingsReducer = slice.reducer;
