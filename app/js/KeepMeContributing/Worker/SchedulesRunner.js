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
     * @private
     * @type {Array<KeepMeContributing.Worker.TimeOfDay>}
     */
    this.times_ = [];

    /**
     * @private
     * @type {number}
     */
    this.nextTimeIndex_ = KeepMeContributing.Worker.SchedulesRunner.NO_SUCH_INDEX;

    /**
     * @private
     * @type {number|null}
     */
    this.timerId_ = null;
  }

  /**
   * @param {!Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   * @returns {KeepMeContributing.Worker.SchedulesRunner}
   */
  update(schedules){
    if (this.timerId_ !== null){
      clearTimeout(this.timerId_);
    }

    this.times_ = schedules;
    goog.array.sortByKey(this.times_, (time) => { return time.toMillisecs(); });

    let /** !Date */ now = new Date();
    this.nextTimeIndex_ =
      goog.array.findIndex(this.times_, (time) => { return time.millisecsAfter(now) > 0; });
    return this;
  }

  /**
   * @param {function()} task
   */
  run(task, after = void 0){
    if (goog.array.isEmpty(this.times_)){
      return;
    }

    if (after === void 0){
      after = this.times_[this.nextTimeIndex_].millisecsAfter(new Date());
    }

    this.timerId_ = setTimeout(() => {
      task();
      ++this.nextTimeIndex_;
      if (this.nextTimeIndex_ >= this.times_.length){
        this.nextTimeIndex_ = 0;

        let tomorrowFirstTimeOfDay = this.times_[0];
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

/**
 * A result of goog.array.findIndex showing that no element that the given function returns true.
 * @const {number}
 */
KeepMeContributing.Worker.SchedulesRunner.NO_SUCH_INDEX = -1;
