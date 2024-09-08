import { Footer, Header } from '@dhruv-techapps/ui';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from './header/user';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const onHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

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
