import * as Sentry from '@sentry/react';

export const sentryInit = () => {
  const release = `acf-options-page@${process.env.NX_RELEASE_VERSION?.replace('v', '')}`;
  Sentry.init({
    dsn: 'https://aacf1f88c133d2c9b4823c4c0b485ecc@o4506036997455872.ingest.sentry.io/4506037000994816',
    release,
    environment: process.env.NX_VARIANT,
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
};
