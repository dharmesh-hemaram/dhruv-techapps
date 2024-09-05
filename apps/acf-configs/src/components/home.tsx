import { Footer, Header } from '@dhruv-techapps/ui';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { User } from './header/user';

const Home: React.FC = () => {
  return (
    <>
      <Header>
        <User />
      </Header>

      <Outlet />

      <Footer />
    </>
  );
};

export default Home;
