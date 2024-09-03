import { ThemeContext } from '@dhruv-techapps/context';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GoogleSignInDark from '../assets/btn_google_signin_dark_normal_web.png';
import GoogleSignInLight from '../assets/btn_google_signin_light_normal_web.png';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('openid');
    // Add your login logic here
    const user = await signInWithPopup(auth, provider);
    if (user) {
      // Add your redirect logic here
      navigate('/');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center flex-column h-100 row-gap-3'>
      <h1>
        <img
          src='https://getautoclicker.com/favicons/favicon48.png'
          width='48'
          height='48'
          className='d-inline-block align-top me-2'
          alt='Auto click Auto Fill logo'
          title='Auto click Auto Fill logo'
        />
        Auto Clicker Auto Fill
      </h1>
      <p>Please login to access the configurations</p>

      <h3>Please Sign in</h3>
      <Button variant='link' data-testid='google-sign-in' onClick={handleSubmit}>
        <img src={theme === 'light' ? GoogleSignInLight : GoogleSignInDark} alt='Logo' />
      </Button>
    </div>
  );
};

export default Login;
