import RandExp from 'randexp';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';

declare global {
  interface Window {
    __batchRepeat: number;
    __actionRepeat: number;
    __sessionCount: number;
    __api?: { [key: string]: string };
  }
}

export const VALUE_MATCHER = {
  QUERY_PARAM: /^Query::/i,
  QUERY: /<query::(.*?)>/gi,
  API: /^Api::/i,
  RANDOM: /<random(.+?)(\/[a-z]+)?>/gi,
  BATCH_REPEAT: /<batchRepeat>/,
  ACTION_REPEAT: /<actionRepeat>/,
  SESSION_COUNT: /<sessionCount>/,
  CLIPBOARD_PASTE: /<clipboardPaste>/,
  PASTE: /<paste>/,
};

export const Value = (() => {
  const getRandomValue = (value: string) =>
    value.replace(VALUE_MATCHER.RANDOM, (_, regex, flags) => {
      flags = flags ? flags.replace(/[^gimsuy]/g, '') : '';
      const randexp = new RandExp(regex, flags);
      randexp.defaultRange.add(0, 65535);
      const result = randexp.gen();
      return result;
    });

  const getBatchRepeat = (value: string) => value.replaceAll('<batchRepeat>', String(window.__batchRepeat));

  const getActionRepeat = (value: string) => value.replaceAll('<actionRepeat>', String(window.__actionRepeat));

  const getSessionCount = (value: string) => value.replaceAll('<sessionCount>', String(window.__sessionCount));

  const sanitizeInput = (input: string): string => {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
  };

  const validateQueryParam = (key: string, value: string): boolean => {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    return pattern.test(key) && pattern.test(value);
  };

  const getQueryParam = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const [, key] = value.split('::');
    if (searchParams.has(key)) {
      const paramValue = searchParams.get(key) ?? key;
      if (validateQueryParam(key, paramValue)) {
        value = sanitizeInput(paramValue);
      }
    }
    return value;
  };

  const getMultiQueryParam = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    value = value.replace(VALUE_MATCHER.QUERY, (_, key) => {
      const paramValue = searchParams.get(key) ?? key;
      if (validateQueryParam(key, paramValue)) {
        return sanitizeInput(paramValue);
      }
      return key;
    });
    return value;
  };

  const getApiValue = (value: string): string => {
    const [, key] = value.split('::');
    const apiValue = window.__api?.[key];
    if (apiValue) {
      return apiValue;
    }
    return value;
  };

  const getClipboardPaste = async (value: string): Promise<string> => {
    const clipText = await navigator.clipboard.readText();
    return value.replaceAll('<clipboardPaste>', clipText);
  };

  const getPaste = (value: string): string => {
    const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY);
    if (copyContent) return value.replaceAll('<paste>', copyContent);
    return value;
  };

  const getValue = async (value: string): Promise<string> => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      return value;
    }

    if (VALUE_MATCHER.QUERY_PARAM.test(value)) {
      value = getQueryParam(value);
    }
    if (VALUE_MATCHER.QUERY.test(value)) {
      value = getMultiQueryParam(value);
    }
    if (VALUE_MATCHER.BATCH_REPEAT.test(value)) {
      value = getBatchRepeat(value);
    }
    if (VALUE_MATCHER.ACTION_REPEAT.test(value)) {
      value = getActionRepeat(value);
    }
    if (VALUE_MATCHER.SESSION_COUNT.test(value)) {
      value = getSessionCount(value);
    }
    if (VALUE_MATCHER.RANDOM.test(value)) {
      value = getRandomValue(value);
    }
    if (VALUE_MATCHER.API.test(value)) {
      value = getApiValue(value);
    }
    if (VALUE_MATCHER.CLIPBOARD_PASTE.test(value)) {
      value = await getClipboardPaste(value);
    }
    if (VALUE_MATCHER.PASTE.test(value)) {
      value = getPaste(value);
    }
    return value;
  };

  return { getValue, getBatchRepeat, getActionRepeat, getSessionCount };
})();
