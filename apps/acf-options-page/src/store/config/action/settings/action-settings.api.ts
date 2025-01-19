import { ActionSettings, GOTO, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export const openActionSettingsModalAPI = createAsyncThunk<{ settings: ActionSettings | undefined; selectedActionId: RANDOM_UUID; retryGoto: GOTO | undefined }, RANDOM_UUID, { state: RootState }>(
  'action-setting/open',
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
    const { settings } = action;
    let retryGoto = settings?.retryGoto;
    if (settings?.retryOption === RETRY_OPTIONS.GOTO && typeof settings.retryGoto === 'number') {
      retryGoto = config.actions[settings.retryGoto].id;
    }
    return { settings: action.settings, selectedActionId, retryGoto };
  }
);
