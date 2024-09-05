import { createBrowserRouter } from 'react-router-dom';
import Configuration from './components/configurations/configuration';
import Home from './components/home';
import Login from './components/login';
import { NotFound } from './components/not-found';
import { Search } from './components/search/search';
import { loginLoader, protectedLoader } from './util/loader';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    Component: Home,
    loader: protectedLoader,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        loader: protectedLoader,
        Component: Search,
      },
      {
        path: '/config/:configId/:id',
        loader: protectedLoader,
        Component: Configuration,
      },
      {
        path: 'login',
        loader: loginLoader,
        Component: Login,
      },
    ],
  },
]);
