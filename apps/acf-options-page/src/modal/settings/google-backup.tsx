import { GoogleBackupService } from '@dhruv-techapps/acf-service';
import { AUTO_BACKUP, DriveFile, GoogleDriveService } from '@dhruv-techapps/google-drive';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, Image, ListGroup, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useConfirmationModalContext } from '../../_providers/confirm.provider';
import GoogleSignInDark from '../../assets/btn_google_signin_dark_normal_web.png';
import GoogleSignInLight from '../../assets/btn_google_signin_light_normal_web.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { googleLoginAPI } from '../../store/settings/settings.api';
import { settingsSelector, updateSettingsBackup } from '../../store/settings/settings.slice';
import { themeSelector } from '../../store/theme.slice';
import { CloudArrowDownFill, CloudArrowUpFill, Trash } from '../../util';

export function SettingsGoogleBackup() {
  const { t } = useTranslation();
  const theme = useAppSelector(themeSelector);
  const modalContext = useConfirmationModalContext();
  const { settings, google, googleScopes } = useAppSelector(settingsSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<DriveFile>>();
  const [filesLoading, setFilesLoading] = useState<boolean>();
  const { backup } = settings;

  const scope = GOOGLE_SCOPES.DRIVE;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI(scope));
  };

  const loadFiles = async () => {
    setFilesLoading(true);
    GoogleDriveService.listWithContent().then((files) => {
      setFiles(files);
      setFilesLoading(false);
    });
  };

  useEffect(() => {
    if (google && googleScopes.includes(scope)) {
      loadFiles();
    }
  }, [google, googleScopes, scope]);

  const onBackup = async (autoBackup?: AUTO_BACKUP) => {
    setLoading(true);
    if (autoBackup) {
      GoogleDriveService.autoBackup(autoBackup)
        .then(() => {
          dispatch(updateSettingsBackup(autoBackup));
        })
        .finally(() => setLoading(false));
    } else {
      GoogleBackupService.backup()
        .then(() => {
          loadFiles();
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  const restore = async (id: string, name: string) => {
    const result = await modalContext.showConfirmation({
      title: t('confirm.backup.restore.title'),
      message: t('confirm.backup.restore.message'),
      headerClass: 'text-danger',
    });
    result && GoogleBackupService.restore(id, name);
  };

  const deleteFile = async (id: string, name: string) => {
    GoogleDriveService.delete(id, name)
      .then(() => {
        setFiles(files?.filter((file) => file.id !== id));
      })
      .catch(console.error);
  };

  if (!google || !googleScopes.includes(scope)) {
    return (
      <div className='d-flex flex-column align-items-start'>
        <b className='mx-3 text-muted'>Connect with Google Drive</b>
        <Button variant='link' onClick={connect} data-testid='google-backup-connect'>
          <img src={theme === 'light' ? GoogleSignInLight : GoogleSignInDark} alt='Logo' />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <b className='text-muted d-block mb-2'>
          {loading && (
            <span className='me-2'>
              <span className='spinner-border spinner-border-sm' aria-hidden='true'></span>
              <span className='visually-hidden' role='status'>
                Loading...
              </span>
            </span>
          )}
          Google Drive {t('modal.settings.backup.title')}
        </b>
        <Image alt={google.name} className='me-2' title={google.name} src={google.picture} roundedCircle width='30' height='30' referrerPolicy='no-referrer' />
        {google.name}
      </div>
      <hr />
      <ol className='list-group'>
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-now' disabled={loading} title={t('modal.settings.backup.now')} onClick={() => onBackup()}>
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
        <div>Loading...</div>
      ) : (
        <div>
          {files && files.length !== 0 ? (
            <Accordion defaultActiveKey='0'>
              {files.map((file) => (
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
