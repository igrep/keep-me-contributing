/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.SchedulesController');

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.events.EventTarget');

/**
 * Controller class for models who can handle schedules
 * such as SchedulesRunner and SchedulesStore.
 */
KeepMeContributing.SchedulesController = class extends goog.events.EventTarget {

  beginLoading(){
    this.dispatchEvent(KeepMeContributing.SchedulesController.Events.LOADING);
  }

  /**
   * @param {!Array<!KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  finishLoading(schedules){
    this.dispatchEvent({
      type: KeepMeContributing.SchedulesController.Events.LOADED,
      schedules: schedules
    });
  }

  /**
   * @param {!Array<!KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  update(schedules){
    this.dispatchEvent({
      type: KeepMeContributing.SchedulesController.Events.UPDATED,
      schedules: schedules
    });
  }

  stop(){
    this.dispatchEvent(KeepMeContributing.SchedulesController.Events.STOPPED);
  }

};

/**
 * Constants for event names.
 * @enum {string}
 */
KeepMeContributing.SchedulesController.Events = {
  LOADING: 'loading',
  LOADED:  'loaded',
  TOGGLED: 'toggled',
  UPDATED: 'updated',
  STOPPED: 'stopped'
};
