import { ThemeProvider } from '@dhruv-techapps/context';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Loading from './components/loading';
import { router } from './routes';
import './styles.scss';
import './util/i18n';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </ThemeProvider>
  </StrictMode>
);
