import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Configuration, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common';
import { configGetAllAPI } from './config.api';
import { actionActions, openActionAddonModalAPI, openActionSettingsModalAPI, openActionStatementModalAPI } from './action';
import { batchActions } from './batch';
import { getConfigName } from './config.slice.util';

export type ConfigStore = {
  loading: boolean;
  selectedConfigIndex: number;
  selectedActionIndex: number;
  error?: string;
  configs: Array<Configuration>;
  message?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigAction = { name: string; value: any };

const initialState: ConfigStore = { loading: true, configs: [{ ...defaultConfig }], selectedConfigIndex: 0, selectedActionIndex: 0 };

const slice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setConfigError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.message = undefined;
    },
    setConfigMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    addConfig: (state) => {
      state.configs.unshift({ ...defaultConfig, id: crypto.randomUUID() });
      state.selectedConfigIndex = 0;
    },
    updateConfig: (state, action: PayloadAction<ConfigAction>) => {
      const { name, value } = action.payload;
      const { configs, selectedConfigIndex } = state;
      configs[selectedConfigIndex][name] = value;
      if (name === 'url' && !configs[selectedConfigIndex].name) {
        configs[selectedConfigIndex].name = getConfigName(value);
      }
    },
    updateConfigSettings: (state, action: PayloadAction<ConfigAction>) => {
      const { name, value } = action.payload;
      const { configs, selectedConfigIndex } = state;
      configs[selectedConfigIndex][name] = value;
      if (name === 'startType' && value === START_TYPES.AUTO) {
        delete configs[selectedConfigIndex].hotkey;
      }
    },
    removeConfig: (state, action: PayloadAction<number | undefined>) => {
      const { configs } = state;
      const selectedConfigIndex = action.payload || state.selectedConfigIndex;
      configs.splice(selectedConfigIndex, 1);
      if (configs.length === 2) {
        state.selectedConfigIndex = 0;
      }
      state.selectedConfigIndex = selectedConfigIndex === 0 ? selectedConfigIndex : selectedConfigIndex - 1;
    },
    setConfigs: (state, action: PayloadAction<Array<Configuration>>) => {
      state.configs = action.payload;
      state.selectedConfigIndex = 0;
    },
    importAll: (state, action: PayloadAction<Array<Configuration>>) => {
      state.configs = action.payload;
      state.selectedConfigIndex = 0;
    },
    importConfig: (state, action: PayloadAction<Configuration>) => {
      state.configs.push(action.payload);
      state.selectedConfigIndex = state.configs.length - 1;
    },
    duplicateConfig: (state) => {
      const { configs, selectedConfigIndex } = state;
      const config = configs[selectedConfigIndex];
      const name = '(Duplicate) ' + (config.name || config.url || 'Configuration');
      state.configs.push({ ...configs[selectedConfigIndex], name, id: crypto.randomUUID() });
      state.selectedConfigIndex = state.configs.length - 1;
    },
    selectConfig: (state, action: PayloadAction<number>) => {
      state.selectedConfigIndex = action.payload;
    },
    ...actionActions,
    ...batchActions,
  },
  extraReducers: (builder) => {
    builder.addCase(configGetAllAPI.fulfilled, (state, action) => {
      if (action.payload) {
        const { configurations, selectedConfigIndex } = action.payload;
        state.configs = configurations;
        state.selectedConfigIndex = selectedConfigIndex;
      }
      state.loading = false;
    });
    builder.addCase(configGetAllAPI.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(openActionAddonModalAPI.fulfilled, (state, action) => {
      state.selectedActionIndex = action.payload.index;
    });
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      state.selectedActionIndex = action.payload.index;
    });
    builder.addCase(openActionStatementModalAPI.fulfilled, (state, action) => {
      state.selectedActionIndex = action.payload.index;
    });
  },
});

export const {
  setConfigMessage,
  setConfigError,
  addConfig,
  setConfigs,
  selectConfig,
  updateConfig,
  updateConfigSettings,
  removeConfig,
  duplicateConfig,
  importAll,
  importConfig,
  updateBatch,
  addAction,
  reorderActions,
  removeAction,
  updateAction,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
} = slice.actions;

export const configSelector = (state: RootState) => state.configuration;

const configsSelector = (state: RootState) => state.configuration.configs;
const selectedConfigIndexSelector = (state: RootState) => state.configuration.selectedConfigIndex;
const selectedActionIndexSelector = (state: RootState) => state.configuration.selectedActionIndex;

export const selectedConfigSelector = createSelector(configsSelector, selectedConfigIndexSelector, (configs, selectedConfigIndex) => configs[selectedConfigIndex]);

export const selectedActionSelector = createSelector(selectedConfigSelector, selectedActionIndexSelector, (config, selectedActionIndex) => config.actions[selectedActionIndex]);

export const selectedActionSettingsSelector = createSelector(selectedActionSelector, (action) => action.settings);

export const selectedActionStatementSelector = createSelector(selectedActionSelector, (action) => action.statement);

export const selectedActionAddonSelector = createSelector(selectedActionSelector, (action) => action.addon);

export const selectedActionStatementConditionsSelector = createSelector(selectedActionSelector, (action) => action.statement?.conditions);

export const configReducer = slice.reducer;
