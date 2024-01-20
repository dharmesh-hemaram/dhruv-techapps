import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';
import { ActionSettings } from '@dhruv-techapps/acf-common';

export const actionSettingsActions = {
  syncActionSettings: (state: ConfigStore, action: PayloadAction<ActionSettings | undefined>) => {
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
      selectedAction.settings = action.payload;
    } else {
      delete selectedAction.settings;
    }
  },
};
