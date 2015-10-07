goog.provide('KeepMeContributing.Worker.ContributionStatusNotifier');

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('goog.Promise');

KeepMeContributing.Worker.ContributionStatusNotifier = class {
  /**
   * @param {string} username
   * @param {KeepMeContributing.ContributionStatus} status
   */
  constructor(username, status){
    /**
     * @private
     * @type {string}
     */
    this.username_ = username;

    /**
     * @private
     * @type {KeepMeContributing.ContributionStatus}
     */
    this.status_ = status;
  }

  /**
   * Simple wrapper for Notification#constructor.
   * Checks if  Notification.permission is 'granted' in advance.
   * @param {string} title passed to new Notification().
   * @param {!NotificationOptions} options passed to new Notification().
   */
  notify(title, options){
    if (this.getPermission() === 'granted'){
      this.showNotification(title, options);
    } else {
      console.warn(`Denied to show notification. Current Notification.permission is ${Notification.permission}`);
    }
  }

  /**
   * Fetch contibution status from GitHub, then notify the result.
   * @param {KeepMeContributing.Worker.TimeOfDay} time
   * @param {Date} actualCurrentTime
   * @return {goog.Promise<undefined, ?>}
   */
  askToNotifyAt(time, actualCurrentTime = new Date()){
    return this.status_.queryHasContributedAt(actualCurrentTime).then(
      (/** boolean */ contributed) => {
        if (contributed){
          this.notify(
            `Congratulations! ${this.username_} has already contributed today!`,
            {
              tag: KeepMeContributing.Worker.ContributionStatusNotifier.TAG,
              icon: '/img/icon.png'
            }
          );
        } else {
          this.notify(
            `Oh my... ${this.username_} has NOT contributed yet today!`,
            {
              tag: KeepMeContributing.Worker.ContributionStatusNotifier.TAG,
              icon: '/img/icon-not_yet.png'
            }
          );
        }
      }, (error) => {
        let /** string */ message = error.toString();
        console.error(message);
        this.notify(
          'An error occurred while asking if contributed',
          {
            tag: KeepMeContributing.Worker.ContributionStatusNotifier.TAG,
            icon: '/img/icon-error.png'
          }
        );
      }
    );
  }

  /**
   * @returns {string}
   */
  getPermission(){
    return Notification.permission;
  }

  /**
   * @param {string} title passed to new Notification().
   * @param {!NotificationOptions} options passed to new Notification().
   */
  showNotification(title, options){
    new Notification(title, options);
  }

};

/**
 * @const {string}
 */
KeepMeContributing.Worker.ContributionStatusNotifier.TAG =
  'KeepMeContributing.Worker.ContributionStatusNotifier';
