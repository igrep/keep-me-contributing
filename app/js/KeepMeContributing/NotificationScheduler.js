'use strict';

goog.provide('KeepMeContributing.NotificationScheduler');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.SchedulesExecutor');

goog.require('goog.array');

KeepMeContributing.NotificationScheduler = class extends KeepMeContributing.SchedulesExecutor {
  /**
   * @override
   * @param {KeepMeContributing.ContributionStatus} contributionStatus
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(contributionStatus, controller){
    super(controller);

    // FIXME: Both attached functions don't work on both my phone and tablet...
    cordova.plugins.notification.local.on('click', (/** {id: number} */ notification) => {
      console.log('clicked: ' + notification.id);
      cordova.plugins.notification.local.clear(notification.id, () => {});
    });

    cordova.plugins.notification.local.on('trigger', (/** {id: number} */ notification) => {
      console.log('triggered: ' + notification.id);
      cordova.plugins.notification.local.update({
        id: notification.id,
        text: 'Loading my contribution status...',
        icon: 'img/icon.png'
      });

      this.contributionStatus_
        .queryHasContributedAt(new Date())
        .then((/** boolean */ hasContributed) => {
          let /** string */ text = 'Oh my... I have NOT contributed yet today!';
          let /** string */ icon = 'icon-not_yet.png';
          if (hasContributed){
            text = "Congratulations! I've already contributed today!";
            icon = 'icon.png';
          }

          cordova.plugins.notification.local.update({
            id: notification.id,
            text: text,
            icon: icon
          });
        }, (/** Error */ error) => {
          cordova.plugins.notification.local.update({
            id: notification.id,
            text: `An error occurred while loading contribution status: ${error}`,
            icon: 'img/icon-error.png'
          });
        });
    });

    /**
     * @private
     * @type {KeepMeContributing.ContributionStatus}
     */
    this.contributionStatus_ = contributionStatus;
    this.registerDisposable(this.contributionStatus_);
  }

  /** @override */
  stop(){
    cordova.plugins.notification.local.cancelAll(() => {});
  }

  /**
   * Required to implement to extend this class.
   * Update scheduled notifications then (re-)enable them.
   *
   * @override
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  receiveNewSchedules(schedules){
    cordova.plugins.notification.local.cancelAll(() => {
      cordova.plugins.notification.local.schedule(
        goog.array.map(schedules, (schedule) => schedule.toCordovaPluginsNotificationArgument())
      );
    });
  }
};
