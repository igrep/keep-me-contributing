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
    return this.toMillisecs() - (date.getHours() * 60 + date.getMinutes()) * 60 * 1000;
  }

  /**
   * @returns {number} total milliseconds since the beginning of the day.
   */
  toMillisecs(){
    return (this.hour_ * 60 + this.minute_) * 60 * 1000;
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
   * @returns {{id: number, title: string, text: string, every: string, at: Date, icon: string}}
   */
  toCordovaPluginsNotificationArgument(){
    let /** Date */ now = new Date();

    let /** Date */ at = new Date(now.getTime());
    at.setHours(this.hour_);
    at.setMinutes(this.minute_);
    if (this.millisecsAfter(now) <= 0){
      at.setDate(at.getDate() + 1);
    }

    return {
      id: this.toMillisecs(),
      title: 'Have I contributed today?',
      text: 'Loading my contribution status...',
      every: 'day',
      at: at,
      icon: 'img/icon.png'
    };
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

  /**
   * Used when receiving data from postMessage
   * @param {{hour_: number, minute_: number}} data
   * @returns {KeepMeContributing.Worker.TimeOfDay}
   */
  static fromData(data){
    return new this(data.hour_, data.minute_);
  }

};
