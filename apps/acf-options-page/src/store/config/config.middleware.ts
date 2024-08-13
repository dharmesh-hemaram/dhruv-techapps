import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { AnyAction, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { RootState } from '../../store';
import { addToast } from '../toast.slice';
import {
  setActionAddonError,
  setActionAddonMessage,
  setActionError,
  setActionMessage,
  setActionSettingsError,
  setActionSettingsMessage,
  setActionStatementError,
  setActionStatementMessage,
} from './action';
import { setBatchError, setBatchMessage } from './batch';
import {
  addConfig,
  duplicateConfig,
  importAll,
  importConfig,
  removeAction,
  removeConfig,
  reorderActions,
  setConfigError,
  setConfigMessage,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
  updateAction,
  updateBatch,
  updateConfig,
  updateConfigSettings,
} from './config.slice';
import { setConfigSettingsError, setConfigSettingsMessage } from './settings';

const configsToastListenerMiddleware = createListenerMiddleware();
configsToastListenerMiddleware.startListening({
  matcher: isAnyOf(addConfig, removeConfig, duplicateConfig),
  effect: async (action, listenerApi) => {
    const [type, method] = action.type.split('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const header = i18next.t(`toast.${type}.${method}.header`, { name: type });
    const body = i18next.t(`toast.${type}.${method}.body`, { name: type });
    if (header) {
      listenerApi.dispatch(addToast({ header, body }));
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMessageFunc = (action: AnyAction): { success: any; failure: any; message: string } => {
  switch (action.type) {
    case updateConfigSettings.type:
      return { success: setConfigSettingsMessage, failure: setConfigSettingsError, message: i18next.t(`message.configSettings`) };
    case updateBatch.type:
      return { success: setBatchMessage, failure: setBatchError, message: i18next.t(`message.batch`) };
    case updateAction.type:
    case reorderActions.type:
    case removeAction.type:
      return { success: setActionMessage, failure: setActionError, message: i18next.t(`message.action`) };
    case syncActionAddon.type:
      return { success: setActionAddonMessage, failure: setActionAddonError, message: i18next.t(`message.actionAddon`) };
    case syncActionStatement.type:
      return { success: setActionStatementMessage, failure: setActionStatementError, message: i18next.t(`message.actionStatement`) };
    case syncActionSettings.type:
      return { success: setActionSettingsMessage, failure: setActionSettingsError, message: i18next.t(`message.actionSettings`) };
    default:
      return { success: setConfigMessage, failure: setConfigError, message: i18next.t(`message.config`) };
  }
};

const configsListenerMiddleware = createListenerMiddleware();
configsListenerMiddleware.startListening({
  matcher: isAnyOf(
    importAll,
    importConfig,
    updateConfig,
    updateConfigSettings,
    removeConfig,
    duplicateConfig,
    updateBatch,
    updateAction,
    reorderActions,
    removeAction,
    syncActionAddon,
    syncActionSettings,
    syncActionStatement
  ),
  effect: async (action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here
    const state = listenerApi.getState() as RootState;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    StorageService.set({ [LOCAL_STORAGE_KEY.CONFIGS]: state.configuration.configs })
      .then(() => {
        const { success, message } = getMessageFunc(action);
        if (success && message) {
          listenerApi.dispatch(success(message));
        }
      })
      .catch((error) => {
        const { failure } = getMessageFunc(action);
        if (failure) {
          if (error instanceof Error) {
            listenerApi.dispatch(failure(error.message));
          } else if (typeof error === 'string') {
            listenerApi.dispatch(failure(error));
          } else {
            listenerApi.dispatch(failure(JSON.stringify(error)));
          }
        }
      });
  },
});

export { configsListenerMiddleware, configsToastListenerMiddleware };
