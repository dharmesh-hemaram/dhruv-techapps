export const BROWSER = (function (agent) {
  switch (true) {
    case agent.indexOf('edge') > -1:
    case agent.indexOf('edg/') > -1:
      return 'EDGE'; // Match also / to avoid matching for the older Edge
    default:
      return 'CHROME';
  }
})(navigator.userAgent.toLowerCase());
