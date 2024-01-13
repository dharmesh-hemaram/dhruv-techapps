const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  if (config.mode !== 'development') {
    config.plugins.push(
      sentryWebpackPlugin({
        org: 'dhruv-techapps',
        project: 'acf-options-page',
        telemetry: false,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.NX_RELEASE_VERSION,
        },
      })
    );
  }
  return config;
});
