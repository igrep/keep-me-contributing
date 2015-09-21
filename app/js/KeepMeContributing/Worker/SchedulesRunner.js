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
     * @private
     * @type {number|null}
     */
    this.timerId = null;
  }

  /**
   * @param {!Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   * @returns {KeepMeContributing.Worker.SchedulesRunner}
   */
  update(schedules){
    if (this.timerId !== null){
      clearTimeout(this.timerId);
    }

    if (goog.array.isEmpty(schedules)){
      this.notYets = [];
      this.dones = [];
      return this;
    }
    let /** !Date */ now = new Date();
    ( // <- parenthesis required when using desctructuring assignment like below.
      { 'true': this.dones, 'false': this.notYets } = goog.array.bucket(schedules, (
        /** KeepMeContributing.Worker.TimeOfDay */ timeOfDay
      ) => {
        return timeOfDay.millisecsAfter(now) <= 0;
      })
    );
    goog.array.sortByKey(this.dones, (time) => { return time.toMillisecs(); });
    goog.array.sortByKey(this.notYets, (time) => { return time.toMillisecs(); });
    return this;
  }

  /**
   * @param {function()} task
   */
  run(task, after = void 0){
    if (goog.array.isEmpty(this.notYets) && goog.array.isEmpty(this.dones)){
      return;
    }

    if (after === void 0){
      after = this.notYets[0].millisecsAfter(new Date());
    }

    this.timerId = setTimeout(() => {
      task();
      this.dones.push(this.notYets.shift());
      if (goog.array.isEmpty(this.notYets)){
        if (goog.array.isEmpty(this.dones)){
          return;
        }

        this.notYets = this.dones;
        this.dones = [];

        let tomorrowFirstTimeOfDay = this.notYets[0];
        let now = new Date();
        let tomorrowFirstTime = new Date(now.valueOf());
        tomorrowFirstTime.setDate(tomorrowFirstTime.getDate() + 1);
        tomorrowFirstTime.setHours(tomorrowFirstTimeOfDay.hour);
        tomorrowFirstTime.setMinutes(tomorrowFirstTimeOfDay.minute);

        this.run(task, tomorrowFirstTime - now);
      } else {
        this.run(task);
      }
    }, after);
  }

};
