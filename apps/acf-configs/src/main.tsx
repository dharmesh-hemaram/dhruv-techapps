import { ThemeProvider } from '@dhruv-techapps/context';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './styles.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </ThemeProvider>
  </StrictMode>
);
