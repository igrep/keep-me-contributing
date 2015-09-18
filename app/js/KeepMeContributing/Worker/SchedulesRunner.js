/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.Worker.SchedulesRunner');

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.array');

/**
 * @fileoverview Class to handle schedule to check contribution status in the background.
 */

/**
 * @constructor
 * Decides when to check contribution status next based on its TimeOfDay-s collection.
 */
KeepMeContributing.Worker.SchedulesRunner = class {
  constructor(){
    /**
     * public for testing.
     * @type {Array<KeepMeContributing.Worker.TimeOfDay>}
     */
    this.notYets = [];

    /**
     * public for testing.
     * @type {Array<KeepMeContributing.Worker.TimeOfDay>}
     */
    this.dones = [];

    /**
     * public for testing.
     * @type {number}
     */
    this.runsAfterMillisecs = 0;
  }

  /**
   * @param {!Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   * @returns {KeepMeContributing.Worker.SchedulesRunner}
   */
  update(schedules){
    let /** !Date */ now = new Date();
    ( // <- parenthesis required when using desctructuring assignment like below.
      { 'true': this.dones, 'false': this.notYets } = goog.array.bucket(schedules, (
        /** KeepMeContributing.Worker.TimeOfDay */ timeOfDay
      ) => {
        return timeOfDay.millisecsAfter(now) <= 0;
      })
    );
    goog.array.sortByKey(this.dones, (time) => { return time.toMinutes(); });
    goog.array.sortByKey(this.notYets, (time) => { return time.toMinutes(); });
    return this;
  }

  /**
   * @param {function():boolean} task
   */
  run(task){
  }

};
