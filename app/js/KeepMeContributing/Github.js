goog.require('goog.net.XhrIo');
goog.require('goog.Promise');

/**
 * @fileoverview Wrapper of github.js or implements some API endpoints
 * which are not supported by github.js.
 */

if (typeof module !== 'undefined' && module.exports) {
  require('google-closure-library/closure/goog/bootstrap/nodejs');
}

class Github {
  /**
   * @param {string} username GitHub username.
   * @returns {goog.Promise<ContributionsCalendar>}
   */
  getContributionsCalendarOf(username){
  }
}

/**
 * @typedef {{length: number}}
 * Currently it represents only count of the contributions of the day.
 */
Github.Contributions;

/**
 * @typedef {Object<string, Contributions>}
 * Its key represents the date of contribution as a string formatted as 'YYYY-MM-DD'.
 * And the value contains a set of contribution of the day.
 */
Github.ContributionsCalendar;

export default Github;
