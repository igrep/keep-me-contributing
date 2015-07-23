/*global goog:false*/

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
    // Assume Events API's response is in recent-first order.
    let latestEvent = goog.array.find(eventsApiResponse, (event) => {
      return event.type === 'PushEvent' ||
        (event.type === 'CreateEvent' && event.payload.ref_type === 'repository');
    });

    /**
     * @private {Date}
     */
    this._recentlyContributedAt = new Date(latestEvent.created_at);
  }
  get recentlyContributedAt(){
    return this._recentlyContributedAt;
  }
}

export default ContributionStatus;
