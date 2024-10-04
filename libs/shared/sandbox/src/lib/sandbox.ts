import { ConfigError, generateUUID } from '@dhruv-techapps/core-common';

export const SANDBOX_INITIALIZED = 'sandbox-initialized';

type SandboxReqType = {
  command: string;
  name: string;
  context: string;
};

export const Sandbox = (() => {
  let sandbox: HTMLIFrameElement;

  const add = () => {
    sandbox = document.createElement('iframe');
    sandbox.id = 'sandbox-iframe';
    sandbox.src = chrome.runtime.getURL('html/sandbox.html');
    sandbox.style.display = 'none';
    document.body.appendChild(sandbox);
  };

  const remove = () => {
    document.body.removeChild(sandbox);
  };

  const sendMessage = async (message: SandboxReqType): Promise<string> => {
    add();
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        const { result, error, name, type } = event.data;
        if (event.isTrusted === false) {
          return;
        }
        if (type === SANDBOX_INITIALIZED) {
          sandbox.contentWindow?.postMessage(message, '*');
          return;
        }
        if (name === message.name) {
          remove();
          window.removeEventListener('message', listener);
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      };
      window.addEventListener('message', listener);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sandboxEval = async (code: string, context?: any): Promise<string> => {
    if (!code) {
      return context;
    }
    const name = generateUUID();
    try {
      return await Sandbox.sendMessage({ command: 'eval', name, context: context ? `\`${context}\`.${code}` : code });
    } catch (error) {
      if (error instanceof Error) {
        throw new ConfigError(error.message, `Invalid ${code}`);
      }
      throw new ConfigError(JSON.stringify(error), `Invalid ${code}`);
    }
  };

  return { sendMessage, sandboxEval };
})();
