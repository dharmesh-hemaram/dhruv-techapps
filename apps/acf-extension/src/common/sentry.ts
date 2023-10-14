import * as Sentry from '@sentry/browser';
import { NX_RELEASE_VERSION, VARIANT } from './environments';

export const sentryInit = (project: string, dsn: string) => {
  Sentry.init({
    dsn,
    environment: VARIANT,

    // Alternatively, use `process.env.npm_package_version` for a dynamic release version
    // if your build tool supports it.
    release: `${project}@${NX_RELEASE_VERSION?.replace('v', '')}`,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/*.getautoclicker.com/],
  });
};
