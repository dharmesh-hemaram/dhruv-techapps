import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { addToast } from '../../toast.slice';
import { setConfigs } from '../config.slice';

export const configRemoveUpdateAPI = createAsyncThunk<boolean, void, { state: RootState }>('configRemove/update', async (_, thunkAPI) => {
  const filteredConfigs = thunkAPI
    .getState()
    .configRemove.configs?.filter((config) => !config.checked)
    .map((config) => {
      delete config.checked;
      return config;
    });
  if (filteredConfigs) {
    await StorageService.set({ [LOCAL_STORAGE_KEY.CONFIGS]: filteredConfigs });
    thunkAPI.dispatch(setConfigs(filteredConfigs));
    thunkAPI.dispatch(addToast({ header: 'Configurations removed successfully!' }));
  }
  return true;
});
