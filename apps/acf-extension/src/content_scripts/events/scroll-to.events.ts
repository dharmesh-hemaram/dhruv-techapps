import { Logger } from '@dhruv-techapps/core-common';
import CommonEvents from './common.events';

const SCROLL_COORDINATES = ['Top', 'Bottom', 'Left', 'Right', 'TopLeft', 'BottomLeft', 'BottomRight', 'TopRight', 'XPath'];

export const ScrollToEvents = (() => {
  const scrollToCoordinates = (axis: string) => {
    Logger.colorDebug('ScrollToCoordinates', axis);
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
    Logger.colorDebug('ScrollToElement', elements[0]);
    elements[0].scrollIntoView();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    if (/xpath/gi.test(value)) {
      scrollToElement(elements);
    } else {
      const scrollCoordinates = CommonEvents.getVerifiedEvents(SCROLL_COORDINATES, value)[0];
      if (typeof scrollCoordinates === 'string') {
        scrollToCoordinates(scrollCoordinates);
      }
    }
  };

  return { start };
})();
