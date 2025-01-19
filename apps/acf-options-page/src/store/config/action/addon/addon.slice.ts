import { RootState } from '@apps/acf-options-page/src/store';
import { Addon, GOTO, defaultAddon } from '@dhruv-techapps/acf-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { openActionAddonModalAPI } from './addon.api';

type ActionAddonStore = {
  visible: boolean;
  error?: string;
  message?: string;
  addon: Addon;
};

const initialState: ActionAddonStore = { visible: false, addon: { ...defaultAddon } };

const slice = createSlice({
  name: 'actionAddon',
  initialState,
  reducers: {
    updateActionAddon: (state, action) => {
      const { name, value } = action.payload;
      state.addon[name] = value;
    },
    updateActionAddonGoto: (state, action: PayloadAction<GOTO>) => {
      state.addon.recheckGoto = action.payload;
    },
    switchActionAddonModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_addon', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionAddonMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionAddonError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(openActionAddonModalAPI.fulfilled, (state, action) => {
      if (action.payload.addon) {
        state.addon = { ...action.payload.addon, recheckGoto: action.payload.recheckGoto };
      } else {
        state.addon = { ...defaultAddon };
      }
      state.visible = !state.visible;
    });
  },
});

export const { setActionAddonError, setActionAddonMessage, switchActionAddonModal, updateActionAddon, updateActionAddonGoto } = slice.actions;

export const actionAddonSelector = (state: RootState) => state.actionAddon;
export const actionAddonReducer = slice.reducer;
