// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Footer } from '@dhruv-techapps/ui';
import { useEffect, useState } from 'react';

import { User } from 'firebase/auth';
import { redirect, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../components/dashboard';
import Login from '../components/login';
import { auth } from '../firebase';

export function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      redirect(user ? '/dashboard' : '/login');
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
