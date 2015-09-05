/*global goog:false, KeepMeContributing:false*/

goog.provide('KeepMeContributing');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('KeepMeContributing.ContributionStatusView');

goog.require('goog.dom');

// public only when debug mode
let /** KeepMeContributing.ContributionStatus? */ contributionStatus = null;
KeepMeContributing.main = function(){
  let kmc = KeepMeContributing;
  let /** string */ username = 'igrep';
  contributionStatus = new kmc.ContributionStatus(
    new kmc.Github({ username: username, apiUrl: '' })
  );
  let /** ContributionStatusView */ view = new kmc.ContributionStatusView(
    username, contributionStatus
  );

  view.render(goog.dom.getElement('contributionStatus'));
  contributionStatus.startPolling(1000);
};
