export const Session = (() => {
  const SESSION_COUNT = 'acf-session-count';
  const SESSION_CLEAR = 'clear-acf-session';

  const getCount = (): number => {
    check();
    const sessionCount = sessionStorage.getItem(SESSION_COUNT);
    const count = sessionCount ? Number(sessionCount) : 1;
    sessionStorage.setItem(SESSION_COUNT, String(count + 1));
    return count;
  };

  const check = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get(SESSION_CLEAR)) {
      sessionStorage.removeItem(SESSION_COUNT);
    }
  };

  return {
    check,
    getCount,
  };
})();
