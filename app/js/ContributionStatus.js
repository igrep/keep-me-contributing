/*global goog:false*/

if (typeof module !== 'undefined' && module.exports) {
  require('google-closure-library/closure/goog/bootstrap/nodejs');
}

goog.require('goog.array');

class ContributionStatus {
  constructor(eventsApiResponse){
    this._recentlyContributedAt = new Date('2015-07-19T16:08:53Z');
  }
  get recentlyContributedAt(){
    return this._recentlyContributedAt;
  }
}

export default ContributionStatus;
