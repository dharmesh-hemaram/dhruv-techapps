const { composePlugins, withNx } = require('@nx/webpack');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
function modify(buffer, { KEY, NX_NAME, OAUTH_CLIENT_ID, NX_RELEASE_VERSION }) {
  // copy-webpack-plugin passes a buffer
  const manifest = JSON.parse(buffer.toString());

  // make any modifications you like, such as
  manifest.version = NX_RELEASE_VERSION.replace('v', '');
  manifest.name = NX_NAME;
  if (OAUTH_CLIENT_ID) {
    manifest.oauth2.client_id = OAUTH_CLIENT_ID;
  }
  if (KEY) {
    manifest.key = KEY;
  }

  return JSON.stringify(manifest, null, 2);
}

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config, ctx) => {
  // Update the webpack config as needed here.
  config.entry.styles = ctx.options.styles;
  config.module.rules.push({
    test: /\.scss$/i,
    use: [
      {
        loader: 'file-loader',
        options: { publicPath: path.resolve(__dirname, 'dist'), outputPath: '/css', name: '[name].min.css' },
      },
      'sass-loader',
    ],
  });

  config.plugins[1] = new CopyPlugin({
    patterns: [
      { from: `**/messages.json`, to: './_locales', context: `${ctx.options.root}/apps/acf-i18n/src/locales` },
      { from: path.join(__dirname, 'assets', process.env.NX_VARIANT || 'DEV'), to: './assets' },
      { from: `./*.html`, to: './html', context: 'src/wizard/popup' },
      { from: `./*.html`, to: './html', context: 'src/sandbox' },
      { from: path.join(ctx.options.root, './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'), to: './webcomponents' },
      {
        from: './src/manifest.json',
        to: './manifest.json',
        transform(content) {
          return modify(content, process.env);
        },
      },
    ],
  });

  config.plugins.push(
    new Dotenv({
      path: config.watch ? path.resolve(config.context, '.env') : './.env',
      safe: true,
      systemvars: true,
    })
  );

  if (config.mode === 'development') {
    config.plugins.push(
      sentryWebpackPlugin({
        org: 'dhruv-techapps',
        project: 'acf-extension',
        telemetry: false,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: {
          name: process.env.NX_RELEASE_VERSION?.replace('v', ''),
        },
      })
    );
  }
  return config;
});
