import { Bypass } from '@dhruv-techapps/acf-common';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ACFCommon: any;
  }
}

export class MainWorldBackground {
  async click(message: string, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      // Perform the action that requires the permission
      chrome.scripting.executeScript<[string], void>({
        world: 'MAIN',
        target: { tabId: sender.tab.id, allFrames: true },
        func: (message: string) => {
          window.ACFCommon.default.getElements(message).then((elements: Array<HTMLElement>) => {
            elements.forEach((element) => {
              element.click();
            });
          });
        },
        args: [message],
      });
    }
  }

  async bypass(message: Bypass, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      // Perform the action that requires the permission
      chrome.scripting.executeScript<[Bypass], void>({
        world: 'MAIN',
        target: { tabId: sender.tab.id, allFrames: true },
        func: (message: Bypass) => {
          if (message.alert) {
            window.alert = () => {
              // By Passing alert function
            };
          }
          if (message.confirm) {
            window.confirm = () => {
              // By Passing confirm function
              return true;
            };
          }
          if (message.prompt) {
            window.prompt = () => {
              // By Passing prompt function
              return '';
            };
          }
        },
        args: [message],
      });
    }
  }
}
