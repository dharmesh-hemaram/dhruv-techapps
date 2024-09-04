import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import Login from './components/login';
import { auth } from './firebase';
import Layout from './layout';
import { loginLoader, protectedLoader } from './util/loader';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <Layout />,
    loader: async () => {
      await auth.authStateReady;
      return auth.currentUser;
    },
    children: [
      {
        index: true,
        loader: protectedLoader,
        Component: Dashboard,
      },
      {
        path: 'login',
        loader: loginLoader,
        Component: Login,
      },
    ],
  },
]);
