/*global goog:false, KeepMeContributing:false*/

goog.provide('KeepMeContributing');

goog.require('KeepMeContributing.Defines');

// Manage the panel showing current contribution status.
goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');
goog.require('KeepMeContributing.ContributionStatusView');
goog.require('KeepMeContributing.GithubProfileLinkedTextView');

// Manage the form to controll the worker to notify contribution status.
goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.NotificationStatusStore');
goog.require('KeepMeContributing.SchedulesStore');
goog.require('KeepMeContributing.WorkerHandler');
goog.require('KeepMeContributing.NotificationScheduler');
goog.require('KeepMeContributing.SchedulesView');

goog.require('goog.dom');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');

// public only when debug mode
let /** KeepMeContributing.ContributionStatus? */ contributionStatus = null;
KeepMeContributing.start = () => {
  let kmc = KeepMeContributing;

  let /** string */ username = 'igrep';

  let /** string */ apiUrl = '';
  let /** KeepMeContributing.Github.Formats */ format = KeepMeContributing.Github.Formats.DEFAULT;
  if (KeepMeContributing.Defines.CORDOVA){
    apiUrl = 'https://keep-me-contributing.herokuapp.com/';

    // Seems my phone can't handle XML by some bug!
    format = KeepMeContributing.Github.Formats.JSON;
  }

  contributionStatus = new kmc.ContributionStatus(
    new kmc.Github({ username: username, format: format, apiUrl: apiUrl })
  );
  let /** ContributionStatusView */ statusView = new kmc.ContributionStatusView(
    username, contributionStatus
  );

  statusView.render(goog.dom.getElement('contributionStatus'));
  contributionStatus.startPolling(5 * 60 * 1000);

  new kmc.GithubProfileLinkedTextView('', username, "'s Current Contribution Status:")
    .render(goog.dom.getElement('title'));
  new kmc.GithubProfileLinkedTextView('See ', username, "'s GitHub profile page for details")
    .render(goog.dom.getElement('seeProfile'));

  let /** KeepMeContributing.SchedulesController */ controller = new kmc.SchedulesController();
  let /** KeepMeContributing.SchedulesStore */ store =
    new kmc.SchedulesStore('KeepMeContributing.SchedulesStore', controller);
  let /** KeepMeContributing.NotificationStatusStore */ notificationStatusStore =
    new kmc.NotificationStatusStore('KeepMeContributing.NotificationStatusStore', controller);

  if (KeepMeContributing.Defines.CORDOVA){
    new kmc.NotificationScheduler(contributionStatus, controller);
  } else {
    // Relative path to worker.js from the loader document (index.html)
    new kmc.WorkerHandler(new Worker('js/worker.js'), controller);
  }

  let schedulesView = new kmc.SchedulesView(
    controller, store, notificationStatusStore, {
      toggle: new goog.ui.Checkbox(),
      update: new goog.ui.Button(),
      stop: new goog.ui.Button(),
      add: new goog.ui.Button()
    }
  );

  let schdulesFormElement = goog.dom.getElement('schedulesForm');
  schedulesView.toggleCheckbox.decorate(goog.dom.getElementByClass('toggleCheckbox', schdulesFormElement));
  schedulesView.updateButton.decorate(goog.dom.getElementByClass('updateButton', schdulesFormElement));
  schedulesView.stopButton.decorate(goog.dom.getElementByClass('stopButton', schdulesFormElement));
  schedulesView.addButton.decorate(goog.dom.getElementByClass('addButton', schdulesFormElement));
  schedulesView.render(goog.dom.getElementByClass('schedulesView', schdulesFormElement));
};

/**
 * @param {function()} start
 */
KeepMeContributing.ready = (start) => {
  if (KeepMeContributing.Defines.CORDOVA){
    document.addEventListener('deviceready', () => {
      cordova.plugins.notification.local.registerPermission((/** boolean */ _) => {});
      start();
    });
  } else {
    Notification.requestPermission();
    start();
  }
};

KeepMeContributing.main = () => {
  KeepMeContributing.ready(KeepMeContributing.start);
};
