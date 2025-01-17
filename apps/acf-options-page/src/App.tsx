import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import ConfirmationModalContextProvider from './_providers/confirm.provider';
import Configs from './app/configs/configs';
import Header from './app/header';
import { DataList, Loading, ToastHandler } from './components';
import { useAppDispatch, useAppSelector } from './hooks';
import { BlogModal, ExtensionNotFoundModal } from './modal';
import { LoginModal } from './modal/login.modal';
import { SubscribeModal } from './modal/subscribe.modal';
import { getManifest } from './store/app.api';
import { appSelector } from './store/app.slice';
import { firebaseIsLoginAPI, firebaseSelector, profileGetAPI } from './store/firebase';

function App() {
  const { loading, error, errorButton } = useAppSelector(appSelector);
  const [show, setShow] = useState(localStorage.getItem('login') !== 'true');
  const { user } = useAppSelector(firebaseSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getManifest());
    dispatch(firebaseIsLoginAPI());
    Sentry.setContext('screen_resolution', {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
    });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(profileGetAPI());
    }
  }, [user, dispatch]);

  const onCloseAlert = () => {
    setShow(false);
    localStorage.setItem('login', 'true');
  };

  return (
    <>
      <ConfirmationModalContextProvider>
        <Header />
        {show && !user && (
          <Alert variant='warning' onClose={onCloseAlert} dismissible>
            Please log in to Auto Clicker Auto Fill to access Discord and Google Sheets features.
          </Alert>
        )}
        {loading && <Loading message='Connecting with extension...' className='m-5 p-5' />}
        <Configs error={error} errorButton={errorButton} />
        <ToastHandler />
        <BlogModal />
        <SubscribeModal />
        <LoginModal />
        <ExtensionNotFoundModal />
      </ConfirmationModalContextProvider>
      <DataList />
    </>
  );
}

export default App;
