import { BrowserClient, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser';
import { RELEASE_VERSION, SENTRY_DSN, VARIANT } from './environments';

const scope = new Scope();

// filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name);
});
const client = new BrowserClient({
  dsn: SENTRY_DSN,
  environment: RELEASE_VERSION === 'v9.9.9' ? 'LOCAL' : VARIANT,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
  release: `acf-extension@${RELEASE_VERSION?.replace('v', '')}`,
  beforeSend: (event) => {
    // add custom data to the event
    if (RELEASE_VERSION === 'v9.9.9') {
      console.log(event);
    }
    return event;
  },
});
scope.setClient(client);
client.init(); // initializing has to be done after setting the client on the scope

export { scope };
