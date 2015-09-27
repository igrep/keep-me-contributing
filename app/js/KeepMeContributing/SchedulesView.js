/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents form to edit schedules (collection of timeOfDays)
 */

goog.provide('KeepMeContributing.SchedulesView');

goog.require('KeepMeContributing.Worker.TimeOfDay');
goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.SchedulesStore');
goog.require('KeepMeContributing.ScheduleInputView');

goog.require('goog.ui.Component');
goog.require('goog.ui.Button');
goog.require('goog.dom');
goog.require('goog.events.Event');

goog.require('goog.array');

KeepMeContributing.SchedulesView = class extends goog.ui.Component {

  /**
   * @override
   * @param {KeepMeContributing.SchedulesController} controller
   * @param {KeepMeContributing.SchedulesStore} store
   * @param {{update: goog.ui.Button, stop: goog.ui.Button, add: goog.ui.Button}} buttons
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(controller, store, buttons, domHelper = undefined){
    super(domHelper);

    /**
     * @type {KeepMeContributing.SchedulesController}
     * @private
     */
    this.controller_ = controller;
    this.registerDisposable(this.controller_);

    /**
     * @type {KeepMeContributing.SchedulesStore}
     * @private
     */
    this.store_ = store;
    this.registerDisposable(this.store_);

    /**
     * @public for testing use only.
     * @type {goog.ui.Button}
     */
    this.updateButton = buttons.update;
    this.registerDisposable(this.updateButton);

    /**
     * @public for testing use only.
     * @type {goog.ui.Button}
     */
    this.stopButton = buttons.stop;
    this.registerDisposable(this.stopButton);

    /**
     * @public for testing use only.
     * @type {goog.ui.Button}
     */
    this.addButton = buttons.add;
    this.registerDisposable(this.addButton);

  }

  /**
   * Rerender with given timeOfDays.
   *
   * @param {Array<KeepMeContributing.Worker.TimeOfDay>} schedules
   */
  replaceWith(schedules){
    this.removeChildren(true);

    goog.array.forEach(schedules, (/** KeepMeContributing.Worker.TimeOfDay */ schedule) => {
      this.addChild(new KeepMeContributing.ScheduleInputView(schedule), true);
    });

    this.addNewInput();
  }

  /**
   * I'm not sure whether it is suitable to decorate...
   * @override
   * @param {Element} _element ignored.
   * @returns {boolean}
   **/
  canDecorate(_element){
    return false;
  }

  /**
   * @override
   */
  enterDocument(){
    super();

    this.getHandler().listen(
      this.updateButton, goog.ui.Component.EventType.ACTION, () => {

        let /** boolean */ valid = true;
        let /** !Array<!KeepMeContributing.Worker.TimeOfDay> */ schedules = [];
        this.forEachChild((/** KeepMeContributing.ScheduleInputView */ input) => {
          if (input.hasNoInput()){
            return;
          }

          let /** ?KeepMeContributing.Worker.TimeOfDay */ maybeTime = input.parseInputTimeOfDay();
          if (valid && maybeTime){
            schedules.push(maybeTime);
          } else {
            valid = false;
          }
        });

        if (!(valid)){
          return;
        }

        this.controller_.update(schedules);
      }
    );

    this.getHandler().listen(
      this.stopButton, goog.ui.Component.EventType.ACTION, () => {
        this.controller_.stop();
      }
    );

    this.getHandler().listen(
      this.addButton, goog.ui.Component.EventType.ACTION, () => { this.addNewInput(); }
    );

    this.getHandler().listen(
      this.store_,
      KeepMeContributing.SchedulesStore.Events.LOADED,
      (/** goog.events.Event */ event) => {
        let /** {schedules: Array<KeepMeContributing.Worker.TimeOfDay>} */ eventWithSchedules =
          /** @type {{schedules: Array<KeepMeContributing.Worker.TimeOfDay>}} */ (event);
        this.replaceWith(eventWithSchedules.schedules);
      }
    );

    this.controller_.load();
  }

  /**
   * Add an empty schedule input to add new one.
   */
  addNewInput(){
    this.addChild(new KeepMeContributing.ScheduleInputView(), true);
  }

};
