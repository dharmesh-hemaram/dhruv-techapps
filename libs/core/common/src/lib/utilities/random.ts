export const getRandomValues = () => {
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array).toString();
};

export type RANDOM_UUID = `${string}-${string}-${string}-${string}-${string}`;

export const generateUUID = (): RANDOM_UUID => {
  // Generate a random UUID (version 4)
  return crypto.randomUUID
    ? crypto.randomUUID()
    : ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as RANDOM_UUID);
};
