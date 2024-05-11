// jest.setup.js

global.window = Object.create(window);
Object.defineProperty(window, '__sheets', {
  value: {},
});
Object.defineProperty(window, '__batchRepeat', {
  value: 1,
});
Object.defineProperty(window, '__actionRepeat', {
  value: 1,
});
Object.defineProperty(window, '__sessionCount', {
  value: 10,
});
