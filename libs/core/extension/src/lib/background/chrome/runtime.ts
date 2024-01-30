import { ActionMessenger, ActionRequest, ManifestMessenger, ManifestRequest, NotificationsMessenger, NotificationsRequest, StorageMessenger, StorageRequest } from './messenger';

export type MessengerConfigObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type RuntimeMessageRequest = ActionRequest | ManifestRequest | NotificationsRequest | StorageRequest;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const messageListener = async (request: any, sender: chrome.runtime.MessageSender, configs: MessengerConfigObject): Promise<any> => {
  const { messenger, methodName, message } = request;

  try {
    switch (messenger) {
      case 'notifications':
        return new NotificationsMessenger()[(methodName as keyof NotificationsMessenger) || 'create'](message);
      case 'storage':
        return new StorageMessenger()[(methodName as keyof StorageMessenger) || 'get'](message);
      case 'manifest':
        return new ManifestMessenger()[(methodName as keyof ManifestMessenger) || 'values'](message);
      case 'action':
        return new ActionMessenger()[(methodName as keyof ActionMessenger) || 'setIcon'](message);
      default:
        if (configs[messenger]) {
          if (typeof configs[messenger][methodName] === 'function') {
            return configs[messenger][methodName](message, sender);
          } else {
            throw new Error(`${messenger}.${methodName} ${chrome.i18n.getMessage('@PORT__method_not_found')}`);
          }
        } else {
          throw new Error(`${messenger} ${chrome.i18n.getMessage('@PORT__action_not_found')}`);
        }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${messenger}.${methodName} ${error.message}`);
    } else {
      throw new Error(`${messenger}.${methodName} ${error}`);
    }
  }
};

export class Runtime {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static sendMessage(message: any, callback: (response: any) => void) {
    chrome.runtime.sendMessage(message, callback);
  }

  static onMessage(configs: MessengerConfigObject) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      messageListener(request, sender, configs)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({ error: error.message });
        });
      return true;
    });
  }

  static onMessageExternal(configs: MessengerConfigObject) {
    chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
      messageListener(request, sender, configs)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({ error: error.message });
        });
      return true;
    });
  }
}
