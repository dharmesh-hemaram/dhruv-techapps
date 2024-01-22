import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';

export const batchActions = {
  updateBatch: (state: ConfigStore, action: PayloadAction<{ name: string; value: number }>) => {
    const { configs, selectedConfigId } = state;
    const { name, value } = action.payload;
    const config = configs.find((config) => config.id === selectedConfigId);
    if (!config) {
      state.error = 'Invalid Configuration';
      return;
    }
    const { batch } = config;
    if (batch) {
      batch[name] = value;
    } else {
      config.batch = { [name]: value };
    }
  },
  updateBatchRefresh: (state: ConfigStore) => {
    const { configs, selectedConfigId } = state;
    const config = configs.find((config) => config.id === selectedConfigId);
    if (!config) {
      state.error = 'Invalid Configuration';
      return;
    }
    const { batch } = config;
    if (batch) {
      batch.refresh = !batch.refresh;
    }
  },
};
