import { Configuration, LOCAL_STORAGE_KEY, START_TYPES, URL_MATCH } from '@dhruv-techapps/acf-common';

export type GetConfigResult = {
  autoConfig: Configuration | undefined;
  manualConfigs: Array<Configuration>;
};

export class ConfigStorage {
  async getConfig(): Promise<GetConfigResult> {
    try {
      const { href } = document.location;
      const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      const configs: Array<Configuration> = storageResult['configs'] || [];
      let autoConfig: Configuration | undefined;
      let manualConfigs: Array<Configuration> = [];
      let fullMatch = false;
      configs
        .filter((config) => config.enable && config.url)
        .forEach((config) => {
          if (config.url_match !== URL_MATCH.EXACT && this.urlMatcher(config.url, href)) {
            manualConfigs.push(config);
            if (!autoConfig && config.startType === START_TYPES.AUTO) {
              autoConfig = config;
            }
          }
          if (!fullMatch && config.url === href && config.startType === START_TYPES.AUTO) {
            autoConfig = config;
            fullMatch = true;
          }
        });

      manualConfigs = manualConfigs.filter((config) => config.startType === START_TYPES.MANUAL && (!autoConfig || autoConfig.id !== config.id));
      return { autoConfig, manualConfigs };
    } catch (error) {
      console.warn(error);
    }
    return { autoConfig: undefined, manualConfigs: [] };
  }

  //getConfigById
  async getConfigById(id: string): Promise<Configuration | undefined> {
    const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    const configs: Array<Configuration> = storageResult['configs'] || [];
    return configs.find((config) => config.id === id);
  }

  async getAllConfigs(url: string): Promise<Array<Configuration>> {
    const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    let configs: Array<Configuration> = storageResult['configs'] || [];
    configs = configs.filter((config) => config.enable && config.url && this.urlMatcher(url, config.url));
    return configs;
  }

  urlMatcher(url: string, href: string) {
    return new RegExp(url).test(href) || href.indexOf(url) !== -1;
  }
}
