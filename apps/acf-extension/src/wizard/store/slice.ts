import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { WizardAction } from '../type';
import { WizardElementUtil } from '../element-util';
import { RootState } from '../store';
import { Configuration, getDefaultConfig } from '@dhruv-techapps/acf-common';

type WizardConfiguration = Omit<Configuration, 'actions'> & {
  actions: Array<WizardAction>;
};

const initialState: WizardConfiguration = getDefaultConfig();

const slice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    updatedConfig: (_, action) => {
      if (action.payload) {
        return action.payload;
      }
      const { host, pathname, origin } = document.location;
      const config = getDefaultConfig();
      config.url = origin + pathname;
      config.name = host + pathname;
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
        // Select
        const selectXpath = WizardElementUtil.clearXpath(elementFinder);
        if (selectXpath !== elementFinder) {
          return WizardElementUtil.clearXpath(_action.elementFinder) === selectXpath;
        }
        // Radio && Checkbox
        if (checked !== undefined) {
          return _action.elementType === elementType && _action.name === name;
        }
        return _action.elementFinder === elementFinder;
      });

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
