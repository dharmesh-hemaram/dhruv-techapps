import { Alert, Button, Image } from 'react-bootstrap';
import { GOOGLE_SCOPES } from '@dhruv-techapps/acf-common';

import GoogleSignInLight from '../../assets/btn_google_signin_light_normal_web.png';
import GoogleSignInDark from '../../assets/btn_google_signin_dark_normal_web.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { themeSelector } from '../../store/theme.slice';
import { googleLoginAPI } from '../../store/settings/settings.api';
import { settingsSelector } from '../../store/settings';

function SettingGoogleSheets() {
  const theme = useAppSelector(themeSelector);
  const { google, googleScopes } = useAppSelector(settingsSelector);
  const scope = GOOGLE_SCOPES.SHEETS;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI(scope));
  };

  if (!google || !googleScopes.includes(scope)) {
    return (
      <div className='d-flex flex-column align-items-start'>
        {['DEV', 'BETA', 'LOCAL'].includes(process.env.NX_VARIANT || '') && (
          <Alert>
            <Alert.Heading>For DEV and BETA versions only.</Alert.Heading>
            To obtain access to the Local Google Sheets, kindly send an email to <Alert.Link href={`mailto:dhruv.techapps@gmail.com`}>dhruv.techapps@gmail.com</Alert.Link>. Please use{' '}
            <b>Require access to {process.env.NX_VARIANT} Google sheets</b> as the subject of your email.
          </Alert>
        )}
        <b className='mx-3 text-muted'>Connect with Google Sheets</b>
        <Button variant='link' onClick={connect} data-testid='google-sheets-connect'>
          <img src={theme === 'light' ? GoogleSignInLight : GoogleSignInDark} alt='Logo' />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <b className='text-muted d-block mb-2'>Google Sheets</b>
      <Image alt={google.name} className='me-2' title={google.name} src={google.picture} roundedCircle width='30' height='30' />
      {google.name}
    </div>
  );
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets';
SettingGoogleSheets.propTypes = {};
export { SettingGoogleSheets };
