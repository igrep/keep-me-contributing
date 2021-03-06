/**
 * @fileoverview
 * Represents the latest contribution status (e.g. when a user push commit recently)
 * Based on GitHub's private endpoint https://github.com/users/:username/contributions so far.
 */

goog.provide('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('goog.Promise');
goog.require('goog.events.EventTarget');
goog.require('goog.async.Throttle');

/**
 * @constructor
 */
KeepMeContributing.ContributionStatus = class extends goog.events.EventTarget {

  /**
   * @nosideeffects
   * @param {KeepMeContributing.Github} github
   */
  constructor(github){
    super();
    /**
     * @type {KeepMeContributing.Github}
     * @private
     */
    this.github_ = github;
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

  /**
   * Start to ask if I contributed today and tell the result by dispatching
   * one of KeepMeContributing.ContributionStatus.Events.
   * @param {number} interval Ask GitHub API per `interval` milliseconds.
   */
  startPolling(interval){
    new goog.async.Throttle(
      () => {
        this.queryHasContributedAt(new Date())
          .then((contributed) => {
            if (contributed){
              this.dispatchEvent(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED);
            } else {
              this.dispatchEvent(KeepMeContributing.ContributionStatus.Events.NOT_YET);
            }
          }, (error) => {
            console.error(error.toString());
            this.dispatchEvent(KeepMeContributing.ContributionStatus.Events.ERROR);
          });
      },
      interval
    ).fire();
  }

  /**
   * @returns {string}
   * Public only for testing
   */
  get endpointUrl(){
    return this.github_.endpointUrl;
  }
};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.ContributionStatus.Events = {
  CONTRIBUTED: 'contributed',
  NOT_YET: 'not_yet',
  ERROR: 'error'
};
