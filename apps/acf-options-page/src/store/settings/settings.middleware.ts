import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { getI18n } from 'react-i18next';
import { RootState } from '../../store';
import { setSettingsError, setSettingsMessage, updateSettings, updateSettingsBackup, updateSettingsNotification } from './settings.slice';

const settingsListenerMiddleware = createListenerMiddleware();

settingsListenerMiddleware.startListening({
  matcher: isAnyOf(updateSettings, updateSettingsBackup, updateSettingsNotification),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const i18n = getI18n();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language: any = i18n.getDataByLanguage(i18n.language)?.['web-new'];
    await StorageService.set({ [LOCAL_STORAGE_KEY.SETTINGS]: state.settings.settings }).then(
      () => listenerApi.dispatch(setSettingsMessage(language.modal.settings.saveMessage)),
      (error) => listenerApi.dispatch(setSettingsError(error))
    );
  },
});

export { settingsListenerMiddleware };
