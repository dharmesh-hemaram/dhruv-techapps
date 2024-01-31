import { Action, CONFIG_SOURCE, Configuration, RANDOM_UUID, getDefaultAction, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { blogCheckAPI } from '../blog';

/**
 * Retrieves the configuration name based on the provided URL.
 * @param url - The URL to extract the configuration name from.
 * @returns The configuration name extracted from the URL.
 */
export const getConfigName = (url?: string) => {
  if (url && url.match('://.*') !== null) {
    const domainNames = url.split('/')[2].split('.');
    if (domainNames.length > 2) {
      return domainNames.slice(-2).join('.');
    }
    return domainNames.join('.');
  }
  return url;
};

/**
 * Checks the query parameters in the URL and performs necessary actions on the configurations.
 * @param configs - An array of configurations.
 * @param thunkAPI - The thunk API object.
 * @returns The index of the selected configuration.
 */
export const checkQueryParams = (configs: Array<Configuration>, thunkAPI): RANDOM_UUID | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const object: any = {};
  if (window.location.search) {
    const params = window.location.search.replace('?', '').split('&');
    Object.values(params).forEach((param) => {
      const [name, value] = param.split('=');
      object[name] = decodeURIComponent(value);
    });
    if (object.configId) {
      const selectedConfig = configs.find((config) => config.id === object.id);
      if (selectedConfig) {
        const action = selectedConfig.actions.find((action) => action.id === object.actionId);
        if (action) {
          const { error } = action;
          if (object.error) {
            if (error) {
              error.push('elementFinder');
            } else {
              action.error = ['elementFinder'];
            }
          }
        }
        return selectedConfig.id;
      }
    } else if (object.url && object.elementFinder) {
      const selectedConfig = configs.find((config) => config.url === object.url);
      if (selectedConfig) {
        const selectedAction = selectedConfig.actions.find((action) => action.elementFinder === object.elementFinder);
        if (!selectedAction) {
          const action: Action = { ...getDefaultAction(), elementFinder: object.elementFinder, error: [] };
          selectedConfig.actions.push(action);
        }
        return selectedConfig.id;
      } else {
        const newConfig = getDefaultConfig(CONFIG_SOURCE.WEB);
        newConfig.url = object.url;
        newConfig.name = getConfigName(object.url);
        newConfig.actions[0].elementFinder = object.elementFinder;
        newConfig.actions[0].error = [];
        configs.unshift(newConfig);
        return newConfig.id;
      }
    } else if (object.version) {
      thunkAPI.dispatch(blogCheckAPI(object.version));
    }
  }
};

/**
 * Updates the configuration IDs for the given array of configurations.
 * @param configs - An array of configurations.
 * @returns The updated array of configurations with updated IDs.
 */
export const updateConfigIds = (configs: Array<Configuration>) => {
  return configs.map(updateConfigId);
};

/**
 * Updates the configuration IDs for the given configuration.
 * @param config - A configuration.
 * @returns The updated configuration with updated IDs.
 */
export const updateConfigId = (config: Configuration) => {
  if (!config.id) {
    return { ...config, id: crypto.randomUUID() };
  }
  config.actions.map((action) => {
    if (!action.id) {
      action.id = crypto.randomUUID();
    }
    return action;
  });
  return config;
};
