import { Footer, Header } from '@dhruv-techapps/ui';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import aa from 'search-insights';
import { auth } from '../firebase';
import { User } from './header/user';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const onHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  useEffect(() => {
    auth.authStateReady().then(() => {
      if (auth.currentUser) {
        aa('setUserToken', auth.currentUser.uid);
      }
    });
  }, []);

  return (
    <>
      <Header onHomeClick={onHomeClick}>
        <User />
      </Header>
      <Outlet />
      <Footer />
    </>
  );
};

export default Home;
