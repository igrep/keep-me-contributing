/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.Worker.SchedulesRunner');

goog.require('KeepMeContributing.Worker.TimeOfDay');

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
     * @type {!Array<KeepMeContributing.Worker.TimeOfDay>}
     */
    this.notYets = [];

    /**
     * public for testing.
     * @type {!Array<KeepMeContributing.Worker.TimeOfDay>}
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
   */
  update(schedules){
  }

  /**
   * @param {function():boolean} task
   */
  run(task){
  }

};
