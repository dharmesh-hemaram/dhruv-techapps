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
        target: { tabId: sender.tab.id },
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
}
