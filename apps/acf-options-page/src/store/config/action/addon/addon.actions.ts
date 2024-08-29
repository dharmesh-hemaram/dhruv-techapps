import { Addon } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export const actionAddonActions = {
  syncActionAddon: (state: ConfigStore, action: PayloadAction<Addon | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      return;
    }

    if (action.payload) {
      selectedAction.addon = action.payload;
    } else {
      delete selectedAction.addon;
    }
    selectedConfig.updated = true;
  },
};
