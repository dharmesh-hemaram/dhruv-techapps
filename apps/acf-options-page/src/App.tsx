import { Suspense, useEffect } from 'react';
import Header from './app/header';
import Footer from './app/footer';
import { ToastHandler, ErrorAlert, DataList, Loading } from './components';
import { AdsBlockerModal, BlogModal, ExtensionNotFoundModal } from './modal';
import { APP_NAME } from './constants';
import { useAppDispatch, useAppSelector } from './hooks';
import { appSelector, getManifest } from './store/app.slice';
import ConfirmationModalContextProvider from './_providers/confirm.provider';
import Configs from './app/configs/configs';
import * as Sentry from '@sentry/browser';

function App() {
  const { loading, error } = useAppSelector(appSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getManifest());
    Sentry.setTag('theme', window.localStorage.getItem('theme'));
    Sentry.setTag('page_locale', window.localStorage.getItem('language'));
  }, [dispatch]);

  useEffect(() => {
    if (/(DEV|BETA|LOCAL)/.test(process.env.NX_VARIANT || '')) {
      window.document.title = `${APP_NAME} [${process.env.NX_VARIANT}]`;
    } else {
      window.document.title = APP_NAME;
    }
  }, []);

  return (
    <Suspense fallback={<Loading message='Loading localization...' className='m-5 p-5' />}>
      <ConfirmationModalContextProvider>
        <Header />
        {loading && <Loading message='Connecting with extension...' className='m-5 p-5' />}
        <ErrorAlert error={error} />
        <Configs />
        <Footer />
        <ToastHandler />
        <BlogModal />
        <ExtensionNotFoundModal />
        <AdsBlockerModal />
      </ConfirmationModalContextProvider>
      <DataList />
    </Suspense>
  );
}

export default App;
