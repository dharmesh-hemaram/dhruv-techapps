import { Button, Image, ListGroup, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AUTO_BACKUP, GOOGLE_SCOPES } from '@dhruv-techapps/acf-common';
import { CloudArrowUpFill } from '../../util';
import { GoogleBackupService } from '@dhruv-techapps/acf-service';
import GoogleSignInLight from '../../assets/btn_google_signin_light_normal_web.png';
import GoogleSignInDark from '../../assets/btn_google_signin_dark_normal_web.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { settingsSelector, updateSettingsBackup } from '../../store/settings/settings.slice';
import { useConfirmationModalContext } from '../../_providers/confirm.provider';
import { themeSelector } from '../../store/theme.slice';
import { googleLoginAPI } from '../../store/settings/settings.api';

export function SettingsGoogleBackup() {
  const { t } = useTranslation();
  const theme = useAppSelector(themeSelector);
  const modalContext = useConfirmationModalContext();
  const { settings, google, googleScopes } = useAppSelector(settingsSelector);
  const { backup } = settings;

  const scope = GOOGLE_SCOPES.DRIVE;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI(scope));
  };

  const onBackup = async (autoBackup?: AUTO_BACKUP) => {
    if (autoBackup) {
      GoogleBackupService.autoBackup(window.EXTENSION_ID, autoBackup).then(() => {
        dispatch(updateSettingsBackup(autoBackup));
      });
    } else {
      GoogleBackupService.backup(window.EXTENSION_ID).catch(console.error);
    }
  };

  const restore = async () => {
    const result = await modalContext.showConfirmation({
      title: t('confirm.backup.restore.title'),
      message: t('confirm.backup.restore.message'),
      headerClass: 'text-danger',
    });
    result && GoogleBackupService.restore(window.EXTENSION_ID);
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
        <b className='text-muted d-block mb-2'>Google Drive Backup</b>
        <Image alt={google.name} className='me-2' title={google.name} src={google.picture} roundedCircle width='30' height='30' />
        {google.name}
      </div>
      <hr />
      <ol className='list-group'>
        {backup?.lastBackup && (
          <ListGroup.Item as='li'>
            <NavDropdown.Header>{t('header.backup.last-backup')}</NavDropdown.Header>
            <NavDropdown.ItemText>{backup?.lastBackup}</NavDropdown.ItemText>
          </ListGroup.Item>
        )}
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-now' title={t('header.backup.now')} onClick={() => onBackup()}>
            <CloudArrowUpFill className='me-2' />
            {t('header.backup.now')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <h6 className='mt-4'>{t('header.backup.auto-backup')}</h6>
      <ol className='list-group'>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.DAILY}>
          <NavDropdown.Item href='#backup-daily' title={t('header.backup.daily')} onClick={() => onBackup(AUTO_BACKUP.DAILY)}>
            {t('header.backup.daily')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.WEEKLY}>
          <NavDropdown.Item href='#backup-weekly' title={t('header.backup.weekly')} onClick={() => onBackup(AUTO_BACKUP.WEEKLY)}>
            {t('header.backup.weekly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup?.autoBackup === AUTO_BACKUP.MONTHLY}>
          <NavDropdown.Item href='#backup-monthly' title={t('header.backup.monthly')} onClick={() => onBackup(AUTO_BACKUP.MONTHLY)}>
            {t('header.backup.monthly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={!backup?.autoBackup || backup?.autoBackup === AUTO_BACKUP.OFF}>
          <NavDropdown.Item href='#backup-off' title={t('header.backup.off')} onClick={() => onBackup(AUTO_BACKUP.OFF)}>
            {t('header.backup.off')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <hr />
      <ol className='list-group'>
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-restore' title={t('header.backup.restore')} onClick={restore} className='text-danger'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='bi bi-cloud-arrow-down-fill me-2' viewBox='0 0 16 16'>
              <path d='M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z' />
            </svg>
            {t('header.backup.restore')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
    </>
  );
}
