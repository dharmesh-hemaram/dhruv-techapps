import { createAsyncThunk } from '@reduxjs/toolkit';

export const blogCheckAPI = createAsyncThunk('blog/check', async (version: string) => {
  const response = await fetch(`https://api.github.com/repos/Dhruv-Techapps/auto-clicker-auto-fill/releases/tags/v${version}`);
  if (response.status === 200) {
    const release = await response.json();
    return release;
  }
  throw new Error('Blog not found');
});
