/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.NotificationStatusStore');

goog.require('KeepMeContributing.SchedulesController');

goog.require('goog.iter');
goog.require('goog.array');
goog.require('goog.storage.mechanism.PrefixedMechanism');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');

/**
 * @fileoverview Storage of notfication status (enabled or disabled)
 */

/**
 * @constructor
 * Storage class of notfication status (enabled or disabled)
 */
KeepMeContributing.NotificationStatusStore = class extends goog.events.EventTarget {

  /**
   * Load notification status from the given WebStorage and
   * listen events from the given controller.
   *
   * @override
   * @param {string} prefix
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(prefix, controller){
    super();

    /**
     * @private
     * @type {goog.storage.mechanism.PrefixedMechanism}
     */
    this.storage_ = new goog.storage.mechanism.PrefixedMechanism(
      new goog.storage.mechanism.HTML5LocalStorage(), prefix
    );

    /**
     * @private
     * @type {goog.events.EventHandler}
     */
    this.handler_ = new goog.events.EventHandler(this);
    this.registerDisposable(this.handler_);

    /*
     * Load schedules on loaded events.
     * Then dispatch updated event to notify the view.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.LOADING,
      () => {
        this.dispatchEvent({
          type: KeepMeContributing.NotificationStatusStore.Events.LOADED,
          enabled: this.isEnabled()
        });
      }
    );

    /*
     * Save schedules on updated events.
     * Then dispatch updated event to notify the view.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.TOGGLED,
      (/** goog.events.Event */ event) => {
        let /** {enabled: boolean} */ eventWithStatus = /** @type {{enabled: boolean}} */ (event);
        this.save(eventWithStatus.enabled);
      }
    );
  }

  /**
   * @override
   */
  disposeInternal(){
    super();
    this.storage_ = null;
  }

  /**
   * Clears wrapped storage.
   */
  clear(){
    this.storage_.clear();
  }

  /**
   * @param {boolean} enabled
   */
  save(enabled){
    this.storage_.set(
      KeepMeContributing.NotificationStatusStore.KEY,
      enabled ?
          KeepMeContributing.NotificationStatusStore.ENABLED.TRUE
        : KeepMeContributing.NotificationStatusStore.ENABLED.FALSE
    );
  }

  /**
   * Returns true if the notification feature is enabled.
   * True by default.
   * @returns {boolean}
   */
  isEnabled(){
    let /** string? */ s = this.storage_.get(KeepMeContributing.NotificationStatusStore.KEY);
    return s === null || s === KeepMeContributing.NotificationStatusStore.ENABLED.TRUE;
  }

};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.NotificationStatusStore.Events = {
  LOADED: 'loaded'
};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.NotificationStatusStore.ENABLED = {
  TRUE:  '1',
  FALSE: '0'
};

/**
 * @const {string}
 */
KeepMeContributing.NotificationStatusStore.KEY = 'enabled';
