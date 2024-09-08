import { Configuration } from '@dhruv-techapps/acf-common';

export const onDownloadClick = (file: Configuration, name: string) => {
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
