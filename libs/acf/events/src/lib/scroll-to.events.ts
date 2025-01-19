import { ConfigError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const SCROLL_COORDINATES = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'BottomLeft', 'BottomRight', 'TopRight', 'XPath'];

export const ScrollToEvents = (() => {
  const scrollToCoordinates = (axis: string) => {
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, axis);
    let xAxis = 0;
    let yAxis = 0;
    if (axis.indexOf('Right') !== -1) {
      xAxis = document.body.scrollWidth;
    }
    if (axis.indexOf('Bottom') !== -1) {
      yAxis = document.body.scrollHeight;
    }
    window.scrollTo(xAxis, yAxis);
  };

  const scrollToElement = (elements: Array<HTMLElement>) => {
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements[0]);
    elements[0].scrollIntoView();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    if (/xpath/gi.test(value)) {
      scrollToElement(elements);
    } else {
      const scrollCoordinates = CommonEvents.getVerifiedEvents(SCROLL_COORDINATES, value)[0];
      if (typeof scrollCoordinates === 'string') {
        scrollToCoordinates(scrollCoordinates);
      } else {
        throw new ConfigError('Unknown Scroll Coordinates', value);
      }
    }
  };

  return { start };
})();
