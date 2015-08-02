/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents the latest contribution status (e.g. when a user push commit recently)
 * Based on GitHub's private endpoint https://github.com/users/:username/contributions so far.
 */

goog.provide('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('goog.Promise');

class ContributionStatus {

  /**
   * @constructor
   * @nosideeffects
   * @param {{username: string, apiUrl: string}} config
   */
  constructor(config){
    /**
     * @type {KeepMeContributing.Github}
     * @private
     */
    this.github_ = new KeepMeContributing.Github(config);
  }

  /**
   * The date of the lastest public contribution of a user.
   * @param {Date} date
   * @return {goog.Promise<boolean, ?>}
   */
  queryHasContributedAt(date){
    return this.github_
      .fetchContributionsCalendar()
      .then((/** KeepMeContributing.Github.ContributionsCalendar */ calendar) => {
        let /** ?KeepMeContributing.Github.Contributions */ contributions = calendar.contributionsAt(date);
        if(contributions){
          return goog.Promise.resolve(contributions.length > 0);
        } else {
          return goog.Promise.resolve(false);
        }
      })
    ;
  }
}

KeepMeContributing.ContributionStatus = ContributionStatus;
