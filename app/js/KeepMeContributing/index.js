/*global goog:false, KeepMeContributing:false*/

goog.provide('KeepMeContributing');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('KeepMeContributing.ContributionStatusView');
goog.require('KeepMeContributing.GithubProfileLinkedTextView');

goog.require('KeepMeContributing.Worker.TimeOfDay');

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
  contributionStatus.startPolling(5 * 60 * 1000);

  new kmc.GithubProfileLinkedTextView('', username, "'s Current Contribution Status:")
    .render(goog.dom.getElement('title'));
  new kmc.GithubProfileLinkedTextView('See ', username, "'s GitHub profile page for details")
    .render(goog.dom.getElement('seeProfile'));
};
