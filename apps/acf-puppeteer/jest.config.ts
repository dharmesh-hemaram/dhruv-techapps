/* eslint-disable */
export default {
  displayName: 'acf-puppeteer',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/acf-puppeteer',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  // transformIgnorePatterns: ['/node_modules/(?!@dhruv-techapps/.*)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  testTimeout: 70000,
};
