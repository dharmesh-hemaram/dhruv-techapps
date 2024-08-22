import { AUTO_BACKUP } from '@dhruv-techapps/google-drive';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { useEffect } from 'react';
import { Accordion, Button, Card, ListGroup, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useConfirmationModalContext } from '../../_providers/confirm.provider';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { ErrorAlert } from '../../components';
import { firebaseSelector, switchFirebaseLoginModal } from '../../store/firebase';
import { googleDriveSelector, googleHasAccessAPI, googleLoginAPI, googleSelector } from '../../store/google';
import { googleDriveAutoBackupAPI, googleDriveBackupAPI, googleDriveDeleteAPI, googleDriveListWithContentAPI, googleDriveRestoreAPI } from '../../store/google/google-drive/google-drive.api';
import { settingsSelector } from '../../store/settings/settings.slice';
import { CloudArrowDownFill, CloudArrowUpFill, Trash } from '../../util';

export function SettingsGoogleBackup() {
  const { t } = useTranslation();
  const modalContext = useConfirmationModalContext();
  const {
    settings: { backup },
  } = useAppSelector(settingsSelector);
  const { user } = useAppSelector(firebaseSelector);
  const { grantedScopes, googleLoading } = useAppSelector(googleSelector);
  const { files, filesLoading, error } = useAppSelector(googleDriveSelector);

  const scope = GOOGLE_SCOPES.DRIVE;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI([scope]));
  };

  useEffect(() => {
    if (user) {
      if (grantedScopes.includes(scope)) {
        dispatch(googleDriveListWithContentAPI());
      } else {
        dispatch(googleHasAccessAPI([scope]));
      }
    }
  }, [user, grantedScopes, scope, dispatch]);

  const onBackup = async (autoBackup?: AUTO_BACKUP) => {
    if (autoBackup) {
      dispatch(googleDriveAutoBackupAPI(autoBackup));
    } else {
      dispatch(googleDriveBackupAPI());
    }
  };

  const restore = async (id: string, name: string) => {
    const result = await modalContext.showConfirmation({
      title: t('confirm.backup.restore.title'),
      message: t('confirm.backup.restore.message'),
      headerClass: 'text-danger',
    });
    result && dispatch(googleDriveRestoreAPI({ id, name }));
  };

  const deleteFile = async (id: string, name: string) => {
    dispatch(googleDriveDeleteAPI({ id, name }));
  };

  if (!user) {
    return (
      <p>
        Please
        <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
          Login
        </Button>
        to your account before connecting with Google Drive.
      </p>
    );
  }

  if (googleLoading) {
    return (
      <div className='d-flex align-items-center justify-content-center'>
        <span className='spinner-border me-3' aria-hidden='true'></span>
        <span>Checking Google Drive access...</span>
      </div>
    );
  }

  if (!grantedScopes?.includes(scope)) {
    return (
      <div className='d-flex flex-column align-items-start'>
        <Button variant='link' onClick={connect} data-testid='google-backup-connect'>
          Connect with Google Drive
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        {error && <ErrorAlert error={error} />}
        <b className='text-muted d-block mb-2'>Google Drive {t('modal.settings.backup.title')}</b>
      </div>
      <hr />
      <ol className='list-group'>
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-now' title={t('modal.settings.backup.now')} onClick={() => onBackup()}>
            <CloudArrowUpFill className='me-2' />
            {t('modal.settings.backup.now')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <h6 className='mt-4'>{t('modal.settings.backup.auto-backup')}</h6>
      <ol className='list-group'>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.DAILY}>
          <NavDropdown.Item href='#backup-daily' title={t('modal.settings.backup.daily')} onClick={() => onBackup(AUTO_BACKUP.DAILY)}>
            {t('modal.settings.backup.daily')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.WEEKLY}>
          <NavDropdown.Item href='#backup-weekly' title={t('modal.settings.backup.weekly')} onClick={() => onBackup(AUTO_BACKUP.WEEKLY)}>
            {t('modal.settings.backup.weekly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.MONTHLY}>
          <NavDropdown.Item href='#backup-monthly' title={t('modal.settings.backup.monthly')} onClick={() => onBackup(AUTO_BACKUP.MONTHLY)}>
            {t('modal.settings.backup.monthly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={!backup?.autoBackup || backup?.autoBackup === AUTO_BACKUP.OFF}>
          <NavDropdown.Item href='#backup-off' title={t('modal.settings.backup.off')} onClick={() => onBackup(AUTO_BACKUP.OFF)}>
            {t('modal.settings.backup.off')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <hr />
      <h6 className='mt-4'>{t('modal.settings.backup.restore')}</h6>
      {filesLoading ? (
        <div className='d-flex align-items-center '>
          <span className='spinner-border me-3' aria-hidden='true'></span>
          <span>Loading your files...</span>
        </div>
      ) : (
        <div>
          {files?.length !== 0 ? (
            <Accordion defaultActiveKey='0'>
              {files?.map((file) => (
                <Accordion.Item eventKey={file.id} key={file.id}>
                  <Accordion.Header>
                    {file.name} <small className='ms-2'>{new Date(file.modifiedTime).toLocaleString()}</small>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Button onClick={() => restore(file.id, file.name)} variant='link' type='button' size='sm' className='text-danger'>
                      <CloudArrowDownFill className='me-2' />
                      Restore
                    </Button>
                    <Button onClick={() => deleteFile(file.id, file.name)} variant='link' type='button' size='sm' className='text-danger'>
                      <Trash className='me-2' />
                      Delete
                    </Button>
                    <Card>
                      <pre>{JSON.stringify(file.content, null, 2)}</pre>
                    </Card>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <div> No Backup found</div>
          )}
        </div>
      )}
    </>
  );
}
