/**
 * Utility class for working with dates.
 */
export class DateUtil {
  /**
   * Returns a new Date object with the time set to 00:00:00.
   * If no date is provided, the current date is used.
   * @param date - The date to remove the time from.
   * @returns A new Date object without the time component.
   */
  static getDateWithoutTime(date = new Date()) {
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
