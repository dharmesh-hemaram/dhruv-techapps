import { Configuration } from '@dhruv-techapps/acf-common';
import aa from 'search-insights';

aa('init', { appId: process.env.NX_PUBLIC_ALGOLIA_APP_ID, apiKey: process.env.NX_PUBLIC_ALGOLIA_SEARCH_API_KEY });

export const download = (file: Configuration, name: string, queryID: string | null) => {
  queryID && aa('convertedObjectIDsAfterSearch', { userToken: aa('getUserToken') as string, index: 'configurations', objectIDs: [name], queryID, eventName: 'download' });
  const json = JSON.stringify(file);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const install = () => {
  console.log('Installing...');
};
