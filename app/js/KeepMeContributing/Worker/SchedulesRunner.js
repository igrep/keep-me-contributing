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
    goog.array.sortByKey(this.times_, (time) => { return time.toMillisecs(); });

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
    this.nextTimeIndex_ =
      goog.array.findIndex(this.times_, (time) => { return time.millisecsAfter(now) > 0; });

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
   * @param {number|undefined} after
   */
  run(after = void 0){
    if (goog.array.isEmpty(this.times_)){
      return;
    }

    if (after === void 0){
      after = this.times_[this.nextTimeIndex_].millisecsAfter(new Date());
    }

    this.timerId_ = setTimeout(() => {
      this.task_(this.times_[this.nextTimeIndex_]);
      ++this.nextTimeIndex_;
      if (this.nextTimeIndex_ >= this.times_.length){
        this.nextTimeIndex_ = 0;

        let tomorrowFirstTimeOfDay = this.times_[0];
        let now = new Date();
        let tomorrowFirstTime = new Date(now.valueOf());
        tomorrowFirstTime.setDate(tomorrowFirstTime.getDate() + 1);
        tomorrowFirstTime.setHours(tomorrowFirstTimeOfDay.hour);
        tomorrowFirstTime.setMinutes(tomorrowFirstTimeOfDay.minute);

        this.run(tomorrowFirstTime - now);
      } else {
        this.run();
      }
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

/**
 * Used when calculate the next time when the scheduler checks
 * if the scheduled time has passed or not.
 * On the assumption that the scheduled time set by `setTImeOut`
 * is often delayed by the environment (i.e. the other processes etc.).
 *
 * @const {number}
 */
//KeepMeContributing.Worker.SchedulesRunner.DELAY_COEFFICIENT = 0.75;
