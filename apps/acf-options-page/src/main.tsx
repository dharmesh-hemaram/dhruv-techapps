import * as ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './i18n';
import { BROWSER } from './_helpers';
import { Provider } from 'react-redux';
import { store } from './store';
import { sentryInit } from './sentry';
import { TourProvider } from '@reactour/tour';
import { steps } from './tour';

window.EXTENSION_ID = process.env[`NX_${BROWSER}_EXTENSION_ID`] ?? '';

sentryInit();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <TourProvider steps={steps}>
    <Provider store={store}>
      <App />
    </Provider>
  </TourProvider>
);
