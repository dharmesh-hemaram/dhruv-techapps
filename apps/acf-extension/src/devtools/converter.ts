import { Action, CONFIG_SOURCE, Configuration, getDefaultAction, getDefaultConfig } from '@dhruv-techapps/acf-common';

import { Recording, Step } from './index.types';

let ELEMENT_FINDER: string;

const getProps = (selectors: Array<Array<string>>) => {
  let elementFinder = '';
  let name = '';
  selectors.flat().every((selector) => {
    if (selector.startsWith('xpath/')) {
      elementFinder = selector.replace('xpath/', '');
      return false;
    } else if (selector.startsWith('text/')) {
      elementFinder = `//*[contains(text(),"${selector.replace('text/', '')}")`;
      return false;
    } else if (selector.startsWith('aria/')) {
      name = selector.replace('aria/', '');
    }
    return true;
  });
  ELEMENT_FINDER = elementFinder;
  return { elementFinder, name };
};

export const ConvertStep = (step: Step) => {
  const action: Action = getDefaultAction();
  switch (step.type) {
    case 'change':
      {
        console.assert(step.selectors, 'Selectors are required for change step');
        console.assert(step.value, 'Value is required for change step');
        const { elementFinder, name } = getProps(step.selectors);
        action.elementFinder = elementFinder;
        action.name = name;
        action.selectors = step.selectors;
        action.value = step.value;
      }
      break; // Add an expression here if needed
    case 'click':
    case 'doubleClick':
      {
        console.assert(step.selectors, 'Selectors are required for click step');
        const { elementFinder, name } = getProps(step.selectors);
        action.elementFinder = elementFinder;
        action.name = name;
        action.selectors = step.selectors;
      }

      break;
    case 'keyDown':
    case 'keyUp':
      {
        action.elementFinder = ELEMENT_FINDER;
        action.name = step.key;
        action.value = `KeyboardEvents::${step.key}`;
      }
      break;
    case 'navigate':
    case 'setViewport':
      break;
    default:
      console.assert(false, `Unknown step type: ${step}`);
  }
  if (step.timeout) {
    action.settings = { retry: step.timeout / 1000, retryInterval: 1 };
  }
  delete action.error;
  return action;
};

const getConfig = (url: string) => {
  const config: Configuration = getDefaultConfig(CONFIG_SOURCE.RECORDER);
  config.actions = [];
  config.url = url;
  delete config.updated;
  return config;
};

export const ConvertRecording = (recording: Recording) => {
  const configs: Array<Configuration> = [];
  const [, navigate, ...steps] = recording.steps;
  let config: Configuration;
  if (navigate.type === 'navigate') {
    console.assert(navigate.url, 'URL is required for navigate step');
    config = getConfig(navigate.url);
    configs.push(config);
  } else {
    console.assert(false, 'First step should be navigate');
  }

  console.assert(steps.length === 0, 'No steps found in recording');
  steps.forEach((step) => {
    const action = ConvertStep(step);
    if (action && action.elementFinder) {
      config.actions.push(action);
    }
    if (step.assertedEvents) {
      step.assertedEvents.forEach((assertedEvent) => {
        if (assertedEvent.type === 'navigation' && assertedEvent.url !== config.url) {
          configs.push(config);
          config = getConfig(assertedEvent.url);
        }
      });
    }
  });
  return configs;
};
