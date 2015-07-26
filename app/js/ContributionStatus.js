/*global goog:false*/

/*
 * @fileoverview
 * Represents the latest contribution status (e.g. when a user push commit recently)
 * Based on GitHub Events API.
 * @see <a href="https://developer.github.com/v3/activity/events/">GitHub Events API Document</a>
 * @see <a href="https://developer.github.com/v3/activity/events/types/">GitHub Event Types Document</a>
 * @see <a href="https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/">Why are my contributions not showing up on my profile? - User Documentation</a>
 */

if (typeof module !== 'undefined' && module.exports) {
  require('google-closure-library/closure/goog/bootstrap/nodejs');
}

goog.require('goog.array');

class ContributionStatus {

  /**
   * TODO: Create type GithubApi.EventsApiResponse
   * @param {Array<Object>}
   */
  constructor(eventsApiResponse){
    let latestEvent = goog.array.find(eventsApiResponse, (event) => {
      return event.type === 'PushEvent' ||
        (event.type === 'CreateEvent' && event.payload.ref_type === 'repository') ||
        (event.type === 'PullRequestEvent' && event.payload.action === 'opened')
      ;
    });

    /**
     * @private {Date}
     */
    this._recentlyContributedAt = new Date(latestEvent.created_at);
  }
  /**
   * The date of the lastest public contribution of a user.
   * Assumes Events API's response is in recent-first order.
   * @nosideeffects
   * @return {Date}
   */
  get recentlyContributedAt(){
    return this._recentlyContributedAt;
  }
}

export default ContributionStatus;
