export class CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static messageChrome<K, T = void>(extensionId: string, message: K): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        if (!chrome.runtime?.sendMessage) {
          reject(new Error('Extension context invalidated'));
          return;
        }

        chrome.runtime.sendMessage(extensionId, message, (response) => {
          if (chrome.runtime.lastError || response?.error) {
            reject(new Error(chrome.runtime.lastError?.message || response?.error));
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        console.warn(error);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async message<K, T = void>(extensionId: string, message: K): Promise<T> {
    if (extensionId && typeof extensionId !== 'string') {
      return Promise.reject(new Error('extensionId is not undefined neither string'));
    }
    return await this.messageChrome<K, T>(extensionId, message);
  }
}
