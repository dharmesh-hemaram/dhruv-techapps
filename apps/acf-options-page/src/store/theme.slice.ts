import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const getInitialState = () => {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  return theme;
};

const slice = createSlice({
  name: 'theme',
  initialState: getInitialState(),
  reducers: {
    switchTheme: (state) => {
      const theme = state === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-bs-theme', theme);
      localStorage.setItem('theme', theme);
      return theme;
    },
  },
});
export const { switchTheme } = slice.actions;
export const themeSelector = (state: RootState) => state.theme;
export default slice.reducer;
