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
      <main className='container-fluid'>
        <div className='row'>
          <div className='col'>
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
