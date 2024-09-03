import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { redirect } from 'react-router-dom';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  provider.addScope('openid');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    const user = await signInWithPopup(auth, provider);
    console.log(user);
    if (user) {
      // Add your redirect logic here
      console.log('Redirect to dashboard');
      redirect('/');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
