import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.NX_PUBLIC_OPTIONS_PAGE_SENTRY_DSN,
  environment: process.env.NX_PUBLIC_RELEASE_VERSION === 'v9.9.9' ? 'LOCAL' : process.env.NX_PUBLIC_VARIANT,
  release: `acf-options-page@${process.env.NX_PUBLIC_RELEASE_VERSION?.replace('v', '')}`,
  integrations: [],
  beforeSend: (event) => {
    // add custom data to the event
    if (process.env.NX_PUBLIC_RELEASE_VERSION === 'v9.9.9') {
      console.log(event);
    }
    return event;
  },
});
