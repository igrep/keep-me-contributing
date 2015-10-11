/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.WorkerHandler');

goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.Worker.TimeOfDay');
goog.require('KeepMeContributing.SchedulesExecutor');

/**
 * Start and stop running the worker to check contribution status.
 */
KeepMeContributing.WorkerHandler = class extends KeepMeContributing.SchedulesExecutor {
  /**
   * Register the worker and listen events from the given controller.
   *
   * @override
   * @param {Worker} worker
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(worker, controller){
    super(controller);

    /**
     * @type {Worker}
     */
    this.worker_ = worker;
  }

  /**
   * @override
   * Stops the worker
   */
  stop(){
    this.worker_.terminate();
  }

  /**
   * @override
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  receiveNewSchedules(schedules){
    this.worker_.postMessage(schedules);
  }

  /**
   * @override
   */
  disposeInternal(){
    super();
    this.worker_.terminate();
    this.worker_ = null;
  }

};
