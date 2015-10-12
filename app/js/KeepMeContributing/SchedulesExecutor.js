'use strict';

goog.provide('KeepMeContributing.SchedulesExecutor');

goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');

goog.require('goog.Disposable');

/**
 * Base class for objects which receive events with schedules from
 * KeepMeContributing.SchedulesController.
 */
KeepMeContributing.SchedulesExecutor = class extends goog.Disposable {
  /**
   * Listen events from the given controller.
   *
   * @override
   * @param {KeepMeContributing.SchedulesController} controller
   */
  constructor(controller){
    super();

    /**
     * @private
     * @type {goog.events.EventHandler}
     */
    this.handler_ = new goog.events.EventHandler(this);
    this.registerDisposable(this.handler_);

    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.UPDATED,
      (/** goog.events.Event */ event) => { this.handleEventWithSchedules_(event); }
    );

    this.handler_.listen(
      controller,
      KeepMeContributing.SchedulesController.Events.STOPPED,
      () => { this.stop(); }
    );
  }

  /**
   * @private
   * @param {goog.events.Event} event
   */
  handleEventWithSchedules_(event){
    let /** Array<KeepMeContributing.Worker.TimeOfDay> */ schedules =
      /** @type {{schedules: Array<KeepMeContributing.Worker.TimeOfDay>}} */ (event).schedules;
    if (!(goog.array.isEmpty(schedules))){
      this.receiveNewSchedules(schedules);
    }
  }

  /**
   * Required to implement to extend this class.
   * Do something to stop notifying anymore.
   * You can still re-enable notifications by calling receiveNewSchedules.
   */
  stop(){
  }

  /**
   * Required to implement to extend this class.
   * Update scheduled notifications then (re-)enable them.
   *
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  receiveNewSchedules(schedules){
  }

};
