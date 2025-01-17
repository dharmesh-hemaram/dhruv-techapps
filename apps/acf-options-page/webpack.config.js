/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports  */
const { composePlugins, withNx } = require('@nx/webpack');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const { withReact } = require('@nx/react');
const { BannerPlugin } = require('webpack');
const fs = require('fs');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.plugins.push(new BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')));
  if (config.mode !== 'development') {
    config.plugins.push(
      sentryWebpackPlugin({
        org: 'dhruv-techapps',
        project: 'acf-options-page',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.NX_PUBLIC_RELEASE_VERSION?.replace('v', ''),
        },
        reactComponentAnnotation: { enabled: true },
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          // Only relevant if you added `browserTracingIntegration`
          excludePerformanceMonitoring: true,
          // Only relevant if you added `replayIntegration`
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
      })
    );
  }
  return config;
});
