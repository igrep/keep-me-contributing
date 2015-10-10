/*global goog:false*/
'use strict';

goog.provide('KeepMeContributing.WorkerHandler');

goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');

goog.require('goog.array');

/**
 * Start and stop running the worker to check contribution status.
 */
KeepMeContributing.WorkerHandler = class extends goog.events.EventTarget {
  /**
   * Register the service worker and listen events from the given controller.
   *
   * @override
   * @param {Worker} worker
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(worker, controller){
    super();

    /**
     * @type {Worker}
     */
    this.worker_ = worker;

    /**
     * @private
     * @type {goog.events.EventHandler}
     */
    this.handler_ = new goog.events.EventHandler(this);
    this.registerDisposable(this.handler_);

    /*
     * Start the worker with initial schedules on loaded events.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.LOADED,
      (/** goog.events.Event */ event) => { this.handleEventWithSchedules_(event); }
    );

    /*
     * Sends schedules and run the worker on updated events.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.UPDATED,
      (/** goog.events.Event */ event) => { this.handleEventWithSchedules_(event); }
    );

    /*
     * Stops the worker on stopped events.
     */
    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.STOPPED,
      () => { this.stop(); }
    );
  }

  /**
   * Stops the worker
   */
  stop(){
    this.worker_.terminate();
  }

  /**
   * @private
   * @param {goog.events.Event} event
   */
  handleEventWithSchedules_(event){
    let /** {schedules: Array<KeepMeContributing.Worker.TimeOfDay>} */ eventWithSchedules =
      /** @type {{schedules: Array<KeepMeContributing.Worker.TimeOfDay>}} */ (event);
    if (!(goog.array.isEmpty(eventWithSchedules.schedules))){
      this.worker_.postMessage(eventWithSchedules.schedules);
    }
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
