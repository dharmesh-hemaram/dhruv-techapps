import { ADDON_CONDITIONS, ActionSettings, Addon, RECHECK_OPTIONS, ValueExtractorFlags } from '@dhruv-techapps/acf-common';
import { ConfigError, SystemError } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/status-bar';
import { RADIO_CHECKBOX_NODE_NAME } from '../common/constant';
import Common from './common';
import { I18N_COMMON, I18N_ERROR } from './i18n';
import { statusBar } from './status-bar';
import { ACFValue } from './util/acf-util';

const ADDON_I18N = {
  TITLE: chrome.i18n.getMessage('@ADDON__TITLE'),
};

type AddonType = { nodeValue: string | boolean } & Addon;

const AddonProcessor = (() => {
  const recheckFunc = async ({ nodeValue, elementFinder, value, condition, recheck, recheckOption, ...props }: AddonType, settings?: ActionSettings): Promise<number | boolean> => {
    if (recheck !== undefined) {
      if (recheck > 0 || recheck < -1) {
        recheck -= 1;
        await statusBar.wait(props.recheckInterval, STATUS_BAR_TYPE.ADDON_RECHECK, recheck + 1);
        // eslint-disable-next-line no-use-before-define
        return await start({ elementFinder, value, condition, recheck, recheckOption, ...props }, settings);
      }
    }
    // eslint-disable-next-line no-console
    console.table([{ elementFinder, value, condition, nodeValue }]);
    if (recheckOption === RECHECK_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload();
      } else {
        window.addEventListener('load', () => {
          window.location.reload();
        });
      }
    } else if (recheckOption === RECHECK_OPTIONS.STOP) {
      throw new ConfigError(`'${nodeValue}' ${condition} '${value}'`, I18N_ERROR.NO_MATCH);
    } else if (recheckOption === RECHECK_OPTIONS.GOTO && props.recheckGoto !== undefined) {
      return props.recheckGoto;
    }
    console.debug(I18N_COMMON.RECHECK_OPTION, recheckOption);
    return false;
  };

  const extractValue = (element: HTMLElement, value: string, valueExtractor?: string, valueExtractorFlags?: ValueExtractorFlags): string => {
    if (!valueExtractor) {
      return value;
    }
    if (/^@\w+(-\w+)?$/.test(valueExtractor)) {
      return element.getAttribute(valueExtractor.replace('@', '')) || value;
    }
    const matches = value.match(RegExp(valueExtractor, valueExtractorFlags || ''));
    return matches?.join('') || value;
  };

  const getNodeValue = (elements: Array<HTMLElement>, valueExtractor?: string, valueExtractorFlags?: ValueExtractorFlags): string | boolean => {
    const element = elements[0];
    let value: string | boolean;
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      value = element.value;
    } else if (element instanceof HTMLInputElement) {
      if (RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
        value = element.checked;
      } else {
        value = element.value;
      }
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: 'Addon' });
      value = element.textContent || element.innerText;
    } else {
      value = element.innerText;
    }
    if (typeof value === 'string') {
      value = extractValue(element, value, valueExtractor, valueExtractorFlags);
    }
    return value;
  };

  const compare = (nodeValue: string | boolean, condition: ADDON_CONDITIONS, value: string) => {
    console.debug(I18N_COMMON.COMPARE, nodeValue, condition, value);
    if (/than/gi.test(condition) && (Number.isNaN(Number(nodeValue)) || Number.isNaN(Number(value)))) {
      throw new ConfigError(`${I18N_ERROR.WRONG_DESCRIPTION}'${nodeValue}' '${value}'`, I18N_ERROR.WRONG_TITLE);
    }
    if (typeof nodeValue === 'boolean' || condition === ADDON_CONDITIONS['✓ Is Checked '] || condition === ADDON_CONDITIONS['✕ Is Not Checked ']) {
      if (typeof nodeValue === 'boolean') {
        if ((nodeValue && condition === ADDON_CONDITIONS['✓ Is Checked ']) || (!nodeValue && condition === ADDON_CONDITIONS['✕ Is Not Checked '])) {
          return true;
        }
        return false;
      } else {
        throw new ConfigError(I18N_ERROR.ELEMENT_FINDER_DESCRIPTION, I18N_ERROR.ELEMENT_FINDER_TITLE);
      }
    }

    switch (condition) {
      case ADDON_CONDITIONS['= Equals']:
        return new RegExp(`^${value}$`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['!= Not Equals']:
        return !new RegExp(`^${value}$`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['~ Contains']:
        return new RegExp(`${value}`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['!~ Not Contains']:
        return !new RegExp(`${value}`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['> Greater Than']:
        return Number(nodeValue) > Number(value);
      case ADDON_CONDITIONS['>= Greater Than Equals']:
        return Number(nodeValue) >= Number(value);
      case ADDON_CONDITIONS['< Less Than']:
        return Number(nodeValue) < Number(value);
      case ADDON_CONDITIONS['<= Less Than Equals']:
        return Number(nodeValue) <= Number(value);
      default:
        throw new SystemError('Addon Condition not found', `${condition} condition not found`);
    }
  };

  const start = async ({ elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }: Addon, settings?: ActionSettings) => {
    try {
      statusBar.addonUpdate();
      let nodeValue;
      if (/^Func::/gi.test(elementFinder)) {
        nodeValue = await Sandbox.sandboxEval(elementFinder.replace(/^Func::/gi, ''));
      } else {
        elementFinder = await ACFValue.getValue(elementFinder);
        const elements = await Common.start(elementFinder, settings);
        if (typeof elements === 'number') {
          return elements;
        }
        if (elements) {
          nodeValue = getNodeValue(elements, valueExtractor, valueExtractorFlags);
        }
      }
      if (nodeValue !== undefined) {
        let result: boolean | number = compare(nodeValue, condition, value);
        if (!result) {
          result = await recheckFunc({ nodeValue, elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }, settings);
        }
        console.debug(`${ADDON_I18N.TITLE} ${I18N_COMMON.RESULT}`, result);
        console.groupEnd();
        return result;
      }
      console.groupEnd();
      return false;
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };
  const check = async (addon?: Addon, actionSettings?: ActionSettings) => {
    if (addon) {
      let { value } = addon;
      const { elementFinder, condition, ...props } = addon;
      if (elementFinder && value && condition) {
        console.groupCollapsed(ADDON_I18N.TITLE);
        value = await ACFValue.getValue(value);
        return await start({ ...props, elementFinder, value, condition }, actionSettings);
      }
    }
    return true;
  };

  return { check };
})();

export default AddonProcessor;
