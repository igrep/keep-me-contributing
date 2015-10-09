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

  /**
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} times
   * @param {function(KeepMeContributing.Worker.TimeOfDay)} task
   *   function to run. should accepts the time when the task runs.
   */
  static run(times, task){
    if (this.currentRunner){
      this.currentRunner.stop();
    }
    this.currentRunner = new this(times, task);
    this.currentRunner.run();
  }

  /**
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} times
   * @param {function(KeepMeContributing.Worker.TimeOfDay)} task
   */
  constructor(times, task){
    /**
     * @private
     * @type {Array<KeepMeContributing.Worker.TimeOfDay>}
     */
    this.times_ = times;
    goog.array.sortByKey(this.times_, (time) => time.toMillisecs());

    /**
     * @private
     * @type {function(KeepMeContributing.Worker.TimeOfDay)?}
     */
    this.task_ = task;


    let /** !Date */ now = new Date();

    /**
     * @private
     * @type {number}
     */
    this.firstTimeIndex_ =
      goog.array.findIndex(this.times_, (time) => time.millisecsAfter(now) > 0);

    /**
     * @private
     * @type {number|null}
     */
    this.timerId_ = null;
  }

  /**
   * Start to run at the given times (this.times_).
   * When finished all the given tasks in the day,
   * prepare to run the tasks again in the next day.
   *
   * @param {number} nextIndex
   */
  run(nextIndex = this.firstTimeIndex_){
    if (goog.array.isEmpty(this.times_)){
      return;
    }

    let /** KeepMeContributing.Worker.TimeOfDay? */ next = this.times_[nextIndex];

    let /** number */ after = 0;
    let /** number */ nextNextIndex = 0;
    if (next){
      after = next.millisecsAfter(new Date());
      nextNextIndex = nextIndex + 1;
    } else {
      let /** KeepMeContributing.Worker.TimeOfDay */ tomorrowFirst = this.times_[0];
      let /** Date */ now = new Date();
      let /** Date */ tomorrowFirstTime = new Date(now.valueOf());
      tomorrowFirstTime.setDate(tomorrowFirstTime.getDate() + 1);
      tomorrowFirstTime.setHours(tomorrowFirst.hour);
      tomorrowFirstTime.setMinutes(tomorrowFirst.minute);

      next = tomorrowFirst;
      after = tomorrowFirstTime - now;
      nextNextIndex = 1;
    }

    this.timerId_ = setTimeout(() => {
      this.task_(next);
      this.run(nextNextIndex);
    }, after);
  }

  /**
   * stop to run the tasks
   */
  stop(){
    clearTimeout(this.timerId_);

    this.times_ = [];
    this.task_ = null;
  }

};

/**
 * @type {KeepMeContributing.Worker.SchedulesRunner}
 */
KeepMeContributing.Worker.SchedulesRunner.currentRunner = null;
