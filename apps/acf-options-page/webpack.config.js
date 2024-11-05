/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports  */
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { BannerPlugin } = require('webpack');
const fs = require('fs');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.plugins.push(new BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')));
  return config;
});
