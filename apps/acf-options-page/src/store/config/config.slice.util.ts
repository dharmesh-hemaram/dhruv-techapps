import { Action, CONFIG_SOURCE, Configuration, getDefaultAction, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { RANDOM_UUID } from '@dhruv-techapps/core-common';
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

  if (window.location.search) {
    const { searchParams } = new URL(window.location.href);
    const configId = searchParams.get('configId');
    const url = searchParams.get('url');
    const elementFinder = searchParams.get('elementFinder');
    const version = searchParams.get('version');
    if (configId) {
      const selectedConfig = configs.find((config) => config.id === configId);
      if (selectedConfig) {
        const actionId = searchParams.get('actionId');
        const action = selectedConfig.actions.find((action) => action.id === actionId);
        if (action) {
          const { error } = action;
          if (searchParams.has('error')) {
            if (error) {
              error.push('elementFinder');
            } else {
              action.error = ['elementFinder'];
            }
          }
        }
        return selectedConfig.id;
      }
    } else if (url && elementFinder) {
      const selectedConfig = configs.find((config) => config.url === url);
      if (selectedConfig) {
        const selectedAction = selectedConfig.actions.find((action) => action.elementFinder === elementFinder);
        if (!selectedAction) {
          const action: Action = { ...getDefaultAction(), elementFinder: elementFinder, error: [] };
          selectedConfig.actions.push(action);
        }
        return selectedConfig.id;
      } else {
        const newConfig = getDefaultConfig(CONFIG_SOURCE.WEB);
        newConfig.url = url;
        newConfig.name = getConfigName(url);
        newConfig.actions[0].elementFinder = elementFinder;
        newConfig.actions[0].error = [];
        configs.unshift(newConfig);
        return newConfig.id;
      }
    } else if (version) {
      thunkAPI.dispatch(blogCheckAPI(version));
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
