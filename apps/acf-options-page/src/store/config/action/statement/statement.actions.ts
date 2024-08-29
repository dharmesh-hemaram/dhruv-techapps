import { ActionStatement } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export const actionStatementActions = {
  syncActionStatement: (state: ConfigStore, action: PayloadAction<ActionStatement | undefined>) => {
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
      selectedAction.statement = action.payload;
    } else {
      delete selectedAction.statement;
    }
    selectedConfig.updated = true;
  },
};
