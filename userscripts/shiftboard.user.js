// ==UserScript==
// @name         Tradeboard
// @namespace    https://getautoclicker.com/
// @version      1.1
// @description  Pick the schedule
// @author       Dhruv Techapps
// @match        https://app.shiftboard.com/servola/schedule/schedule.cgi?tradeboard=1*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const WAIT_BEFORE_START = 0.3; // Wait before starting the script in seconds (0.3 seconds)
  const RELOAD_INTERVAL_MS = '1e3'; // Reload interval in seconds (1 second) and randomize between 1 and 3 seconds
  const TIMES = ['2:30pm', '1:30pm'];
  const DETAILS_REJECT = ['AACR'];
  const LINES_ACCEPT = ['UPS Inbound', 'UPS Outbound'];

  const getWaitTime = (time) => {
    let waitTime;
    if (time) {
      if (typeof time === 'string') {
        if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time)) {
          const [start, end] = time
            .toString()
            .split('e')
            .map((n) => Number(n));
          waitTime = (Math.floor(Math.random() * (end - start)) + start) * 1000;
        }
      } else {
        waitTime = Number(time) * 1000;
      }
    }
    return waitTime;
  };

  // Delay the execution of the script
  setTimeout(() => {
    document.querySelectorAll('#results_grid_inner_table tr:not(.colhead)').forEach((tr) => {
      const [date, line, , details] = [...tr.querySelectorAll('td')];
      if (line) {
        if (LINES_ACCEPT.includes(line.innerText) && !DETAILS_REJECT.includes(details.innerText)) {
          const reg = [...date.innerText.matchAll(/(\d{1,2}:\d{2}(?:am|pm)|\d{1,2}(?:am|pm))/g)];
          if (TIMES.includes(reg[0][0])) {
            tr.querySelector('a').click();
            setTimeout(() => {
              document.querySelectorAll('button.primary-button[type=submit]')[1].click();
            }, 300);
          }
        }
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, getWaitTime(RELOAD_INTERVAL_MS));
  }, getWaitTime(WAIT_BEFORE_START));
  // Your code here...
})();
