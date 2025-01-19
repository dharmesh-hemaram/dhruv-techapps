import { ACTION_RUNNING, ActionStatement, GOTO } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export const openActionStatementModalAPI = createAsyncThunk<{ statement: ActionStatement | undefined; selectedActionId: RANDOM_UUID; goto: GOTO | undefined }, RANDOM_UUID, { state: RootState }>(
  'action-statement/open',
  async (selectedActionId, thunkAPI) => {
    const { configuration } = thunkAPI.getState() as RootState;
    const { selectedConfigId, configs } = configuration;
    const config = configs.find((config) => config.id === selectedConfigId);
    if (!config) {
      throw new Error('Invalid Configuration');
    }
    const action = config.actions.find((action) => action.id === selectedActionId);
    if (!action) {
      throw new Error('Invalid Action');
    }
    const { statement } = action;
    let goto = statement?.goto;
    if (statement?.then === ACTION_RUNNING.GOTO && typeof statement.goto === 'number') {
      goto = config.actions[statement.goto].id;
    }
    return { statement: statement, selectedActionId, goto };
  }
);
