// ==UserScript==
// @name         SkyPublishers Automation1.3
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automate actions based on card values on SkyPublishers.com with periodic page reload.
// @author       Dharmesh
// @match        https://tms.skypublishers.com/*
// @match        http://localhost:3000/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Configurable constants
  const MAX_AMOUNT = 1; // Maximum amount to trigger an action
  const RELOAD_INTERVAL_MS = 1000; // Reload interval in milliseconds (1 second)
  const WAIT_BEFORE_START = 1000; // wait before starting the script in milliseconds (1 second)

  // Delay the execution of the script
  setTimeout(() => {
    if (window.location.href !== 'https://tms.skypublishers.com/ui/writer/home/') {
      window.location.href = 'https://tms.skypublishers.com/ui/writer/home/';
    }
    // Utility function to parse dollar amounts
    const parseDollarAmount = (text) => {
      const amount = Number(text.replace('$', ''));
      return amount;
    };

    // Utility function to get section values
    const getCardValues = (headerIndex) => {
      const section =
        document.querySelectorAll('h4').length === 1
          ? document.querySelectorAll('h4')[0]?.closest('section')?.nextElementSibling
          : document.querySelectorAll('h4')[headerIndex]?.closest('section')?.nextElementSibling;
      if (!section) {
        console.log(`No jobs available`);
        return [];
      }
      const values = [...section.querySelectorAll('.card strong')].map((card) => parseDollarAmount(card.innerText));
      return values;
    };

    // Utility function to trigger a button click for a specific card
    const clickCardButton = (headerIndex, value) => {
      const section =
        document.querySelectorAll('h4').length === 1
          ? document.querySelectorAll('h4')[0]?.closest('section')?.nextElementSibling
          : document.querySelectorAll('h4')[headerIndex]?.closest('section')?.nextElementSibling;
      const button = [...section.querySelectorAll('.card strong')]
        .find((card) => parseDollarAmount(card.innerText) === value)
        ?.closest('.card')
        ?.querySelector('button');
      if (button) {
        console.log(`Clicking button for value: ${value} in ${headerIndex === 1 ? 'Active' : 'Available'}`);
        button.click();
      } else {
        console.log(`Button not found for value: ${value} in ${headerIndex === 1 ? 'Active' : 'Available'}`);
      }
    };

    const unClaimButton = () => {
      const section = document.querySelectorAll('h4')[1]?.closest('section')?.nextElementSibling;
      const button = section.querySelector('button');
      if (button) {
        console.log(`Clicking unclaim button`);
        button.click();
        // console.log(`after Clicking unclaim button`);
        const yesButton = document.querySelector('#confirm_dialog').querySelectorAll('button')[2];
        yesButton.click();
        sessionStorage.removeItem('active');
      }
    };
    const availableJobs = getCardValues(2);
    //console.log(availableJobs);
    if (availableJobs.length !== 0) {
      const unClaimButtonElement = document.querySelectorAll('h4')[1]?.closest('section')?.nextElementSibling.querySelector('button');
      if (!unClaimButtonElement) {
        sessionStorage.removeItem('active');
      }

      // Get current active value
      const activeValue = parseDollarAmount(
        document.querySelectorAll('h4')[1]?.closest('section')?.nextElementSibling?.querySelector('.card strong')?.innerText || sessionStorage.getItem('active') || '0'
      );
      console.log(`Current active value: ${activeValue}`);

      // Get highest available value
      const highestAvailableValue = Math.max(0, ...availableJobs);
      console.log(`Highest available value: ${highestAvailableValue}`);

      // Action logic
      if (highestAvailableValue >= MAX_AMOUNT) {
        if (highestAvailableValue > activeValue) {
          // Deactivate current active value if necessary
          if (activeValue !== 0) {
            console.log(`Deactivating current active value: ${activeValue}`);
            unClaimButton();
          }
          // Activate the highest available value
          console.log(`Activating highest available value: ${highestAvailableValue}`);
          sessionStorage.setItem('active', highestAvailableValue);
          clickCardButton(2, highestAvailableValue);
        }
      }
    } else {
      console.log('no jobs available');
    }

    // Reload the page after the specified interval
    setTimeout(() => {
      window.location.reload();
    }, RELOAD_INTERVAL_MS);
  }, WAIT_BEFORE_START); // Adjust the delay as needed
})();
