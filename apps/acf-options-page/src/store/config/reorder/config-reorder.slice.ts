import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Configuration } from '@dhruv-techapps/acf-common';
import { configReorderUpdateAPI } from './config-reorder.api';

type ConfigReorderStore = {
  visible: boolean;
  error?: string;
  message?: string;
  configs?: Array<Configuration>;
};

const initialState: ConfigReorderStore = { visible: false };

const slice = createSlice({
  name: 'configReorder',
  initialState,
  reducers: {
    updateConfigReorder: (state, action: PayloadAction<Array<Configuration>>) => {
      state.configs = action.payload;
    },
    switchConfigReorderModal: (state, action: PayloadAction<Array<Configuration> | undefined>) => {
      if (action.payload) {
        state.configs = action.payload;
      }
      window.dataLayer.push({ event: 'modal', name: 'config_reorder', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setConfigReorderMessage: (state, action: PayloadAction<string | undefined>) => {
      state.error = undefined;
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(configReorderUpdateAPI.rejected, (state, action) => {
      state.error = action.error.message;
      state.message = undefined;
    });
    builder.addCase(configReorderUpdateAPI.fulfilled, (state) => {
      state.visible = false;
    });
  },
});

export const { switchConfigReorderModal, updateConfigReorder, setConfigReorderMessage } = slice.actions;

export const configReorderSelector = (state: RootState) => state.configReorder;
export const configReorderReducer = slice.reducer;
