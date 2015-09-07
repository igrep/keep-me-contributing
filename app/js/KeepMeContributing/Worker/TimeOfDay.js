/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.Worker.TimeOfDay');

/**
 * @fileoverview Class to represent a time of day.
 * The user classes know when to do their tasks by this class.
 * Intended to use both by worker and client app.
 */

/**
 * @constructor
 * Value object to represent a time of day (e.g. 09:00, 22:39).
 */
KeepMeContributing.Worker.TimeOfDay = class {

  /**
   * @param {number} hour
   * @param {number} minute
   */
  constructor(hour, minute){
    /**
     * @private
     * @type {number}
     */
    this.hour_ = hour;
    /**
     * @private
     * @type {number}
     */
    this.minute_ = minute;
  }

  /**
   * @returns {number}
   */
  get hour(){
    return this.hour_;
  }

  /**
   * @returns {number}
   */
  get minute(){
    return this.minute_;
  }

  /**
   * @param {!Date} date
   * @returns {number} how long does it take to get at the time from the datetime.
   */
  millisecsAfter(date){
    return 1000 * 60 * (
      (this.hour_ * 60 + this.minute_) - (date.getHours() * 60 + date.getMinutes())
    );
  }

  /**
   * @returns {string} HH:MM formatted String
   */
  toHHMM(){
    let /** string */ hh = this.hour_   < 10 ? `0${this.hour_}`   : this.hour_.toString();
    let /** string */ mm = this.minute_ < 10 ? `0${this.minute_}` : this.minute_.toString();
    return `${hh}:${mm}`;
  }

  /**
   * @param {string} string HH:MM formatted String
   * @returns {?KeepMeContributing.Worker.TimeOfDay}
   */
  static fromHHMM(string){
    let [/** string */ hh, /** string */ mm] = string.split(':');
    let /** number */ hour   = parseInt(hh, 10);
    let /** number */ minute = parseInt(mm, 10);

    if (0 <= hour && hour < 24 && 0 <= minute && minute < 60){
      return new this(hour, minute);
    } else {
      return null;
    }
  }

};
