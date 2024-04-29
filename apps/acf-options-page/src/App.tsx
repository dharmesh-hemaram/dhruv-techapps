import { Suspense, useEffect } from 'react';
import Header from './app/header';
import { ToastHandler, DataList, Loading } from './components';
import { BlogModal, ExtensionNotFoundModal } from './modal';
import { APP_NAME } from './constants';
import { useAppDispatch, useAppSelector } from './hooks';
import { appSelector, getManifest } from './store/app.slice';
import ConfirmationModalContextProvider from './_providers/confirm.provider';
import Configs from './app/configs/configs';

function App() {
  const { loading, error } = useAppSelector(appSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getManifest());
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
        <Configs error={error} />
        <ToastHandler />
        <BlogModal />
        <ExtensionNotFoundModal />
      </ConfirmationModalContextProvider>
      <DataList />
    </Suspense>
  );
}

export default App;
