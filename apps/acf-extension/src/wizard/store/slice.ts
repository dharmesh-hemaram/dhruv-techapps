import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CONFIG_SOURCE, Configuration, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { RootState } from '../store';
import { WizardAction } from '../type';

type WizardConfiguration = Omit<Configuration, 'actions'> & {
  actions: Array<WizardAction>;
  timer?: number;
};

const initialState: WizardConfiguration = getDefaultConfig(CONFIG_SOURCE.WIZARD, []);

const slice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    updatedConfig: (_, action) => {
      if (action.payload) {
        return action.payload;
      }
      const { host, pathname, origin } = document.location;
      const config = getDefaultConfig(CONFIG_SOURCE.WIZARD, []);
      config.url = origin + pathname;
      config.name = document.title || host + pathname;
      return config;
    },
    removeWizardAction: (state, action: PayloadAction<number>) => {
      state.actions.splice(action.payload, 1);
    },
    updateAllWizardAction: (state, action: PayloadAction<Array<WizardAction>>) => {
      state.actions = action.payload;
    },
    updateWizardAction: (state, action: PayloadAction<WizardAction>) => {
      const { elementFinder, elementType, name, checked } = action.payload;
      const index = state.actions.findIndex((_action) => {
        // Radio && Checkbox
        if (checked !== undefined) {
          return _action.elementType === elementType && _action.name === name;
        }
        return _action.elementFinder === elementFinder;
      });

      if (state.timer) {
        //const initWait = (new Date().getTime() - state.timer) / 1000;
        action.payload.initWait = 0; //initWait < 5 ? 0 : 5;
      }
      state.timer = new Date().getTime();

      if (checked === false) {
        if (index !== -1) {
          state.actions.splice(index, 1);
        }
      } else if (index !== -1) {
        state.actions[index] = action.payload;
      } else {
        state.actions.push(action.payload);
      }
    },
  },
});

export const { removeWizardAction, updateAllWizardAction, updateWizardAction, updatedConfig } = slice.actions;

export const wizardSelector = (state: RootState) => state.wizard;
export const wizardReducer = slice.reducer;
