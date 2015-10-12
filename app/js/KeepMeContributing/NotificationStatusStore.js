/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.NotificationStatusStore');

goog.require('KeepMeContributing.SchedulesController');

goog.require('goog.storage.mechanism.PrefixedMechanism');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.events.EventTarget');

/**
 * @fileoverview Storage of notfication status (enabled or disabled)
 */

/**
 * @constructor
 * Storage class of notfication status (enabled or disabled)
 */
KeepMeContributing.NotificationStatusStore = class extends goog.events.EventTarget {

  /**
   * Load notification status from the given WebStorage
   *
   * @override
   * @param {string} prefix
   */
  constructor(prefix){
    super();

    /**
     * @private
     * @type {goog.storage.mechanism.PrefixedMechanism}
     */
    this.storage_ = new goog.storage.mechanism.PrefixedMechanism(
      new goog.storage.mechanism.HTML5LocalStorage(), prefix
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
    this.notifyUpdated();
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

  notifyUpdated(){
    this.dispatchEvent(KeepMeContributing.NotificationStatusStore.Events.UPDATED);
  }

};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.NotificationStatusStore.Events = {
  UPDATED: 'updated'
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
