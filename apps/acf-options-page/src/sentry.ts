import * as Sentry from '@sentry/react';

export const sentryInit = () => {
  const release = `acf-options-page@${process.env.NX_RELEASE_VERSION?.replace("v","")}`
  const tracePropagationTargets = [new RegExp(`^chrome-extension://${process.env.NX_CHROME_EXTENSION_ID}`)]
  console.log(release,tracePropagationTargets)
  Sentry.init({
    dsn: 'https://aacf1f88c133d2c9b4823c4c0b485ecc@o4506036997455872.ingest.sentry.io/4506037000994816',
    release,
    environment: process.env.NX_VARIANT,
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets,
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
};
