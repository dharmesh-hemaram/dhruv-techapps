import * as Sentry from '@sentry/browser';
import { NX_RELEASE_VERSION } from '../common/environments';

export const sentryInit = () => {
  Sentry.init({
    dsn: 'https://23ec1ed44876c4cbe18082f514cc5901@o4506036997455872.ingest.sentry.io/4506037629943808',

    // Alternatively, use `process.env.npm_package_version` for a dynamic release version
    // if your build tool supports it.
    release: `acf-extension@${NX_RELEASE_VERSION}`,
    integrations: [new Sentry.Replay()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
