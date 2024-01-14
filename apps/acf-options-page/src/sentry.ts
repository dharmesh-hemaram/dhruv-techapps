import * as Sentry from '@sentry/react';

export const sentryInit = () => {
  const release = `acf-options-page@${process.env.NX_RELEASE_VERSION?.replace('v', '')}`;
  Sentry.init({
    dsn: 'https://aacf1f88c133d2c9b4823c4c0b485ecc@o4506036997455872.ingest.sentry.io/4506037000994816',
    release,
    ignoreErrors: ['NetFunnel is not defined', 'adsbygoogle.push() error: No slot size for availableWidth=0', 'ResizeObserver loop completed with undelivered notifications.'],
    environment: process.env.NX_VARIANT,
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    beforeSend: (event) => {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
    integrations: [
      new Sentry.Feedback({
        colorScheme: localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
      }),
      new Sentry.BrowserProfilingIntegration(),
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllInputs: true,
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set profilesSampleRate to 1.0 to profile every transaction.
    // Since profilesSampleRate is relative to tracesSampleRate,
    // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
    // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
    // results in 25% of transactions being profiled (0.5*0.5=0.25)
    profilesSampleRate: 1.0,
  });
};
