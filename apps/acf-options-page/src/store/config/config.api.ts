import { Configuration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { checkQueryParams, updateConfigIds } from './config.slice.util';

export const configGetAllAPI = createAsyncThunk('config/getAll', async (_, thunkAPI) => {
  const result = await StorageService.get<LOCAL_STORAGE_KEY.CONFIGS, Array<Configuration>>(LOCAL_STORAGE_KEY.CONFIGS);
  let configurations = result.configs;
  if (configurations) {
    configurations = updateConfigIds(configurations);
  } else {
    configurations = [];
  }
  const selectedConfigId = checkQueryParams(configurations, thunkAPI);
  return { configurations, selectedConfigId };
});
