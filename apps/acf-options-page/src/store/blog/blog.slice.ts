import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { blogCheckAPI } from './blog.api';

type GitHubRelease = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Array<{
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }>;
  tarball_url: string;
  zipball_url: string;
  body: string;
  discussion_url: string;
  mentions_count: number;
};

type AddonStore = { visible: boolean; release?: GitHubRelease };

const initialState: AddonStore = {
  visible: false,
};

const slice = createSlice({
  name: 'configs',
  initialState,
  reducers: {
    hideBlog: () => {
      window.dataLayer.push({ event: 'modal', name: 'blog', visibility: false });
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(blogCheckAPI.fulfilled, (state, action) => {
      state.release = action.payload;
      window.dataLayer.push({ event: 'modal', name: 'blog', visibility: true });
      state.visible = true;
    });
  },
});

export const { hideBlog } = slice.actions;

export const blogSelector = (state: RootState) => state.blog;

export const blogReducer = slice.reducer;
