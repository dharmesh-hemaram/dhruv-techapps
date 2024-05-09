export const getRandomValues = () => {
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString();
};
