/*global goog:false*/

/**
 * @fileoverview
 * Represents the latest contribution status (e.g. when a user push commit recently)
 * Based on GitHub's private endpoint https://github.com/users/:username/contributions so far.
 */

import Github from './Github';

if (typeof module !== 'undefined' && module.exports) {
  require('google-closure-library/closure/goog/bootstrap/nodejs');
}

goog.require('goog.Promise');

class ContributionStatus {

  /**
   * @constructor
   * @nosideeffects
   * @param {{username: string, apiUrl: string}} config
   */
  constructor(config){
    /**
     * @type {Github}
     * @private
     */
    this.github_ = new Github(config);
  }

  /**
   * The date of the lastest public contribution of a user.
   * @param {Date} date
   * @return {goog.Promise<boolean, ?>}
   */
  queryHasContributedAt(date){
    return this.github_
      .fetchContributionsCalendar()
      .then((/** Github.ContributionsCalendar */ calendar) => {
        let /** ?Github.Contributions */ contributions = calendar.contributionsAt(date);
        if(contributions){
          goog.Promise.resolve(contributions.length > 0);
        } else {
          goog.Promise.resolve(false);
        }
      })
    ;
  }
}

export default ContributionStatus;
