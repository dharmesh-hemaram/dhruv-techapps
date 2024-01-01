import { Logger } from '@dhruv-techapps/core-common';
import { ActionSettings, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { ActionService } from '@dhruv-techapps/core-service';
import { ConfigError } from './error/config-error';
import { wait } from './util';
import Sandbox from './sandbox';
import SettingsStorage from './store/settings-storage';

const LOGGER_LETTER = 'Common';
const Common = (() => {
  const retryFunc = async (retry?: number, retryInterval?: number | string) => {
    if (retry !== undefined) {
      if (retry > 0 || retry < -1) {
        ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [102, 16, 242, 1] });
        ActionService.setBadgeText(chrome.runtime.id, { text: 'Retry' });
        await wait(retryInterval, 'Retry', retry, '<interval>');
        return true;
      }
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sandboxEval = async (code: string, context?: any): Promise<string> => {
    if (!code) {
      return context;
    }
    const name = crypto.randomUUID();
    try {
      return await Sandbox.sendMessage({ command: 'eval', name, context: context ? `'${context}'.${code}` : code });
    } catch (error) {
      if (error instanceof Error) {
        throw new ConfigError(error.message, `Invalid ${code}`);
      }
      throw new ConfigError(JSON.stringify(error), `Invalid ${code}`);
    }
  };

  const getElements = async (document: Document, elementFinder: string, retry: number, retryInterval: number | string): Promise<Array<HTMLElement> | undefined> => {
    Logger.colorDebug('GetElements', elementFinder);
    let elements: HTMLElement[] | undefined;
    try {
      if (/^(id::|#)/gi.test(elementFinder)) {
        const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^Selector::/gi.test(elementFinder)) {
        const element = document.querySelector<HTMLElement>(elementFinder.replace(/^Selector::/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^ClassName::/gi.test(elementFinder)) {
        const classElements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = classElements.length !== 0 ? Array.from(classElements) : undefined;
      } else if (/^Name::/gi.test(elementFinder)) {
        const nameElements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''));
        elements = nameElements.length !== 0 ? Array.from(nameElements) : undefined;
      } else if (/^TagName::/gi.test(elementFinder)) {
        const tagElements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = tagElements.length !== 0 ? Array.from(tagElements) : undefined;
      } else if (/^SelectorAll::/gi.test(elementFinder)) {
        const querySelectAll = document.querySelectorAll<HTMLElement>(elementFinder.replace(/^SelectorAll::/gi, ''));
        elements = querySelectAll.length !== 0 ? Array.from(querySelectAll) : undefined;
      } else {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength !== 0) {
          elements = [];
          let i = 0;
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i) as HTMLElement);
            i += 1;
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new ConfigError(e.message, 'Invalid Xpath');
      }
      throw new ConfigError(JSON.stringify(e), 'Invalid Xpath');
    }

    if (!elements) {
      const doRetry = await retryFunc(retry, retryInterval);
      if (doRetry) {
        elements = await getElements(document, elementFinder, retry - 1, retryInterval);
      }
    }
    return elements;
  };

  const main = async (elementFinder: string, retry: number, retryInterval: number | string) => await getElements(document, elementFinder, retry, retryInterval);

  const checkIframe = async (elementFinder: string, retry: number, retryInterval: number | string) => {
    Logger.colorDebug('CheckIframe');
    const iFrames = document.getElementsByTagName('iframe');
    let elements;
    for (let index = 0; index < iFrames.length; index += 1) {
      if (!iFrames[index].src || iFrames[index].src === 'about:blank') {
        const { contentDocument } = iFrames[index];
        if (contentDocument) {
          elements = await getElements(contentDocument, elementFinder, retry, retryInterval);
          if (elements) {
            break;
          }
        }
      }
    }
    return elements;
  };

  const checkRetryOption = (retryOption: RETRY_OPTIONS, elementFinder: string, retryGoto?: number) => {
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload();
      } else {
        window.addEventListener('load', window.location.reload);
      }
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found - RELOAD');
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found - STOP');
    } else if (retryOption === RETRY_OPTIONS.GOTO) {
      console.groupEnd();
      return retryGoto;
    }
    Logger.colorInfo('RetryOption', retryOption);
  };

  const start = async (elementFinder: string, settings?: ActionSettings) => {
    try {
      if (!elementFinder) {
        throw new ConfigError('elementFinder can not be empty!', 'Element Finder');
      }
      console.groupCollapsed(LOGGER_LETTER);
      const { retryOption, retryInterval, retry, checkiFrames, iframeFirst, retryGoto } = { ...(await new SettingsStorage().getSettings()), ...settings };
      let elements: HTMLElement[] | undefined;
      if (iframeFirst) {
        elements = await checkIframe(elementFinder, retry, retryInterval);
      } else {
        elements = await main(elementFinder, retry, retryInterval);
      }
      if (!elements || elements.length === 0) {
        if (iframeFirst) {
          elements = await main(elementFinder, retry, retryInterval);
        } else if (checkiFrames) {
          elements = await checkIframe(elementFinder, retry, retryInterval);
        }
      }
      if (!elements || elements.length === 0) {
        return checkRetryOption(retryOption, elementFinder, retryGoto);
      }
      console.groupEnd();
      return elements;
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };

  const getNotificationIcon = () => chrome.runtime.getManifest().action.default_icon;

  return { start, getElements, sandboxEval, getNotificationIcon };
})();

export default Common;
