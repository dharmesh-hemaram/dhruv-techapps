import { TourProvider } from '@reactour/tour';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.scss';
import { store } from './store';
import { steps } from './tour';
import './util/i18n';

window.EXTENSION_ID = process.env[`NX_PUBLIC_CHROME_EXTENSION_ID`] ?? '';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <TourProvider steps={steps}>
    <Provider store={store}>
      <App />
    </Provider>
  </TourProvider>
);
