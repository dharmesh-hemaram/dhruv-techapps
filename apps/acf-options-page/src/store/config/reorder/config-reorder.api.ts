import { RootState } from '@apps/acf-options-page/src/store';
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToast } from '../../toast.slice';
import { setConfigs } from '../config.slice';

export const configReorderUpdateAPI = createAsyncThunk<boolean, void, { state: RootState }>('configReorder/update', async (_, thunkAPI) => {
  const configReorder = thunkAPI.getState().configReorder.configs;
  if (configReorder) {
    await StorageService.set({ [LOCAL_STORAGE_KEY.CONFIGS]: configReorder });
    thunkAPI.dispatch(setConfigs(configReorder));
    thunkAPI.dispatch(addToast({ header: 'Configurations reordered successfully!' }));
  }
  return true;
});
