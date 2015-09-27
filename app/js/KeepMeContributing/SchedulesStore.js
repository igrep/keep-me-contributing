/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.SchedulesStore');

goog.require('KeepMeContributing.Worker.TimeOfDay');
goog.require('KeepMeContributing.SchedulesController');

goog.require('goog.iter');
goog.require('goog.array');
goog.require('goog.storage.mechanism.PrefixedMechanism');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');

/**
 * @fileoverview Storage of TimeOfDay-s.
 */

/**
 * @constructor
 * Storage class of TimeOfDay-s. Wraps WebStorage.
 */
KeepMeContributing.SchedulesStore = class extends goog.events.EventTarget {

  /**
   * Load timeOfDays from the given WebStorage and
   * listen events from the given controller.
   *
   * @override
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(controller){
    super();

    /**
     * @private
     * @type {goog.storage.mechanism.PrefixedMechanism}
     */
    this.storage_ = new goog.storage.mechanism.PrefixedMechanism(
      new goog.storage.mechanism.HTML5LocalStorage(),
      'KeepMeContributing.SchedulesStore'
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
      KeepMeContributing.SchedulesController.Events.LOADED,
      () => {
        this.dispatchEvent({
          type: KeepMeContributing.SchedulesStore.Events.LOADED,
          schedules: this.load()
        });
      }
    );

    /*
     * Save schedules on updated events.
     * Then dispatch updated event to notify the view.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.UPDATED,
      (/** goog.events.Event */ event) => {
        let /** {schedules: Array<KeepMeContributing.Worker.TimeOfDay>} */ eventWithSchedules =
          /** @type {{schedules: Array<KeepMeContributing.Worker.TimeOfDay>}} */ (event);
        this.save(eventWithSchedules.schedules);
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
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  save(schedules){
    this.clear();
    goog.array.forEach(
      schedules,
      (/** KeepMeContributing.Worker.TimeOfDay */ schedule, /** number */ index) => {
        this.storage_.set(index.toString(), schedule.toHHMM());
      }
    );
  }

  /**
   * @returns {Array<KeepMeContributing.Worker.TimeOfDay>}
   */
  load(){
    return goog.iter.toArray(
        goog.iter.map(
        this.storage_.__iterator__(),
        (/** string */ hhmm) => {
          return KeepMeContributing.Worker.TimeOfDay.fromHHMM(hhmm);
        }
      )
    );
  }

};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.SchedulesStore.Events = {
  LOADED: 'loaded'
};
