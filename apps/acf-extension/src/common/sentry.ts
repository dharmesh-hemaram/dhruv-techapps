import * as Sentry from '@sentry/browser';
import { NX_RELEASE_VERSION, VARIANT } from './environments';

export const sentryInit = (page: string) => {
  Sentry.init({
    dsn: 'https://23ec1ed44876c4cbe18082f514cc5901@o4506036997455872.ingest.sentry.io/4506037629943808',
    environment: VARIANT,

    // Alternatively, use `process.env.npm_package_version` for a dynamic release version
    // if your build tool supports it.
    release: `acf-extension@${NX_RELEASE_VERSION?.replace('v', '')}`,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    initialScope: {
      tags: { page: page },
    },
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/*\.getautoclicker.com/],
  });
};
