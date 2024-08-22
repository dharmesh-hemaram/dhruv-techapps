import { Alert, Button } from 'react-bootstrap';

import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { useEffect } from 'react';
import { firebaseSelector, switchFirebaseLoginModal } from '../../store/firebase';
import { googleHasAccessAPI, googleLoginAPI, googleSelector } from '../../store/google';

function SettingGoogleSheets() {
  const { user } = useAppSelector(firebaseSelector);
  const { grantedScopes } = useAppSelector(googleSelector);
  const scope = GOOGLE_SCOPES.SHEETS;
  const dispatch = useAppDispatch();

  const connect = async () => {
    dispatch(googleLoginAPI([scope]));
  };

  useEffect(() => {
    if (user) {
      if (!grantedScopes.includes(scope)) {
        dispatch(googleHasAccessAPI([scope]));
      }
    }
  }, [user, grantedScopes, scope, dispatch]);

  if (['DEV', 'BETA'].includes(process.env.NX_PUBLIC_VARIANT || '')) {
    return (
      <div className='d-flex flex-column align-items-start'>
        <Alert>
          <Alert.Heading>Use Stable Versions for Google Sheets Features.</Alert.Heading>
          For optimal performance and reliability in Google Sheets, it's recommended to utilize <Alert.Link href={`https://stable.getautoclicker.com`}>stable</Alert.Link> versions of its features.
          These versions undergo thorough testing to ensure seamless functionality, providing you with a dependable platform for your tasks. By prioritizing stability, you can enhance your
          productivity and minimize the risk of encountering unexpected issues. If you need assistance or guidance on leveraging Google Sheets effectively, feel free to reach out for support!.
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <p>
        Please
        <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())}>
          Login
        </Button>
        to your account before connecting with Google Sheets.
      </p>
    );
  }

  if (!grantedScopes?.includes(scope)) {
    return (
      <Button variant='link' onClick={connect} data-testid='google-sheets-connect'>
        Connect with Google Sheets
      </Button>
    );
  }

  return <b className='text-muted d-block mb-2'>Connected with Google Sheets</b>;
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets';
SettingGoogleSheets.propTypes = {};
export { SettingGoogleSheets };
