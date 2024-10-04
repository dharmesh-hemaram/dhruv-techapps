import { Addon } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export const openActionAddonModalAPI = createAsyncThunk<{ addon: Addon | undefined; selectedActionId: RANDOM_UUID }, RANDOM_UUID, { state: RootState }>(
  'action-addon/open',
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
    return { addon: action.addon, selectedActionId };
  }
);
