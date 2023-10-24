import { TabsMessenger } from './tab';

const BLOG_VERSION = 'blog-version';
export class Blog {
  static async check(optionsPageUrl?: string) {
    if (optionsPageUrl) {
      fetch('https://blog.getautoclicker.com/feed.xml')
        .then((response) => response.text())
        .then(async (response) => {
          const regexResult = /\d+\.\d+\.\d+/.exec(response);
          if (regexResult) {
            const version = regexResult[0];
            const { [BLOG_VERSION]: storageVersion } = await chrome.storage.local.get(BLOG_VERSION);
            if (storageVersion === undefined) {
              Blog.update(version);
            } else if (storageVersion !== version) {
              Blog.show(optionsPageUrl, version);
              Blog.update(version);
            }
          }
        })
        .catch(console.error);
    }
  }

  static show(optionsPageUrl: string, version: string) {
    TabsMessenger.optionsTab({ url: `${optionsPageUrl}?version=${version}` });
  }

  static update(version: string) {
    chrome.storage.local.set({ [BLOG_VERSION]: version });
  }
}
