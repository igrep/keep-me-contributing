/*global goog:false*/

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
 * Key-value store representing a contribution calendar in GitHub profile page.
 * Its key is the date of contribution.
 * And the value contains a set of contribution of the day.
 */
class ContributionsCalendar {
  /**
   * @param {string} svg Response data from github.com/users/<username>/contributions
   */
  constructor(svg){
  }

  /**
   * Retrieve Contributions set by Date
   * @param {Date} date
   * @returns {Github.Contributions}
   */
  contributionsAt(date){
  }
}

Github.ContributionsCalendar = ContributionsCalendar;

export default Github;
