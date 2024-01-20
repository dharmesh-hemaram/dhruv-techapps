import { AnyAction, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { getI18n } from 'react-i18next';
import {
  addConfig,
  duplicateConfig,
  removeConfig,
  setConfigError,
  updateBatch,
  updateConfig,
  setConfigMessage,
  updateConfigSettings,
  importAll,
  importConfig,
  updateAction,
  reorderActions,
  removeAction,
  syncActionStatement,
  syncActionAddon,
  syncActionSettings,
} from './config.slice';
import { RootState } from '../../store';
import { addToast } from '../toast.slice';
import { StorageService } from '@dhruv-techapps/core-service';
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { setConfigSettingsError, setConfigSettingsMessage } from './settings';
import { setBatchError, setBatchMessage } from './batch';
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

const configsToastListenerMiddleware = createListenerMiddleware();
configsToastListenerMiddleware.startListening({
  matcher: isAnyOf(addConfig, removeConfig, duplicateConfig),
  effect: async (action, listenerApi) => {
    const [type, method] = action.type.split('/');
    const i18n = getI18n();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language: any = i18n.getDataByLanguage(i18n.language)?.['web-new'];

    const header = language.toast[type][method]?.header?.replace('{{name}}', type);
    const body = language.toast[type][method]?.body?.replace('{{name}}', type);
    if (header) {
      listenerApi.dispatch(addToast({ header, body }));
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMessageFunc = (action: AnyAction, language): { success: any; failure: any; message: string } => {
  switch (action.type) {
    case updateConfigSettings.type:
      return { success: setConfigSettingsMessage, failure: setConfigSettingsError, message: language.message?.configSettings };
    case updateBatch.type:
      return { success: setBatchMessage, failure: setBatchError, message: language.message?.batch };
    case updateAction.type:
    case reorderActions.type:
    case removeAction.type:
      return { success: setActionMessage, failure: setActionError, message: language.message?.action };
    case syncActionAddon.type:
      return { success: setActionAddonMessage, failure: setActionAddonError, message: language.message?.actionAddon };
    case syncActionStatement.type:
      return { success: setActionStatementMessage, failure: setActionStatementError, message: language.message?.actionStatement };
    case syncActionSettings.type:
      return { success: setActionSettingsMessage, failure: setActionSettingsError, message: language.message?.actionSettings };
    default:
      return { success: setConfigMessage, failure: setConfigError, message: language.message?.config };
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
    const i18n = getI18n();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language: any = i18n.getDataByLanguage(i18n.language)?.['web-new'];
    const { success, failure, message } = getMessageFunc(action, language);

    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.CONFIGS]: state.configuration.configs })
      .then(() => {
        if (success && message) {
          listenerApi.dispatch(success(message));
        }
      })
      .catch((error) => {
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

export { configsToastListenerMiddleware, configsListenerMiddleware };
