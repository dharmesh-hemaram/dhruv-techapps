/* eslint-disable @typescript-eslint/no-explicit-any */
import { dateParser, reISO } from '@dhruv-techapps/core-common';

export class LocalStorage {
  static setItem(key: string, value: any) {
    if (typeof value === 'object') {
      if (value instanceof Date) {
        localStorage.setItem(key, value.toJSON());
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      localStorage.setItem(key, value);
    }
  }

  static getItem(key: string, fallback?: any) {
    const value = localStorage.getItem(key);
    // Value is not null
    if (value && value !== null && value !== 'null' && value !== 'undefined') {
      // value is of json date
      if (reISO.test(value)) {
        return new Date(value);
      }
      // value is number
      if (!Number.isNaN(Number(value))) {
        return Number(value);
      }
      // convert into JSON
      try {
        return JSON.parse(value, dateParser);
      } catch {
        return value;
      }
    }
    return fallback || value;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
