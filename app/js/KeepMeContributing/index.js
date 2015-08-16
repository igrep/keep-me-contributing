/*global goog:false, KeepMeContributing:false*/

goog.provide('KeepMeContributing');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('KeepMeContributing.ContributionStatusView');

goog.require('goog.dom');

KeepMeContributing.main = function(){
  let kmc = KeepMeContributing;
  let /** string */ username = 'igrep';
  let /** ContributionStatus */ status = new kmc.ContributionStatus(
    new kmc.Github({ username: username, apiUrl: '/test/fixtures/github.com' })
  );
  let /** ContributionStatusView */ view = new kmc.ContributionStatusView(
    username, status
  );

  view.render(goog.dom.getElement('contributionStatus'));
  status.startPolling(1000);
};
