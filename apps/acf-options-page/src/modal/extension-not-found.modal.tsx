import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { BROWSER } from '../_helpers';
import { CHROME_WEB_STORE, EDGE_WEB_STORE } from '../constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { appSelector, switchExtensionNotFound } from '../store/app.slice';

const ExtensionNotFoundModal = () => {
  const { t } = useTranslation();

  const { extensionNotFound } = useAppSelector(appSelector);

  const dispatch = useAppDispatch();

  const downloadClick = () => {
    const webStore = BROWSER === 'EDGE' ? EDGE_WEB_STORE : CHROME_WEB_STORE;
    const extensionId = process.env[`NX_PUBLIC_${BROWSER}_EXTENSION_ID`];
    window.open(`${webStore}${extensionId}`);
  };

  const refresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.reload();
  };

  const onHide = () => {
    dispatch(switchExtensionNotFound());
  };

  return (
    <Modal show={extensionNotFound} size='lg' centered backdrop='static' keyboard={false} onHide={onHide} data-testid='extension-not-found-modal'>
      <Modal.Header>
        <Modal.Title>{t('modal.extensionNotFound.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        <p className='mb-0'>
          <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <b />, Badge: <span className='text-info' /> }} values={process.env} />. {t('modal.extensionNotFound.hint')}
        </p>
        <p className='mt-5'>
          With{' '}
          <a href='https://developer.chrome.com/docs/extensions/mv3/intro/' target='_blank' rel='noreferrer'>
            MV3
          </a>{' '}
          version extension gets inactive and our configuration page unable to communicate with same. Please do refresh once and activate extension again if you already have extension installed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='me-3' onClick={refresh}>
          Refresh
        </Button>
        <Button variant='primary' onClick={downloadClick}>
          {t('common.download')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ExtensionNotFoundModal };
