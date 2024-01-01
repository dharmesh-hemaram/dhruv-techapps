import * as ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './i18n';
import { BROWSER } from './_helpers';
import { Provider } from 'react-redux';
import { store } from './store';
import { sentryInit } from './sentry';

window.EXTENSION_ID = process.env[`NX_${BROWSER}_EXTENSION_ID`] ?? '';

if (process.env.NODE_ENV !== 'development') {
  sentryInit();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
