/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents form to edit schedules (collection of timeOfDays)
 */

goog.provide('KeepMeContributing.SchedulesView');

goog.require('KeepMeContributing.Worker.TimeOfDay');
goog.require('KeepMeContributing.SchedulesController');
goog.require('KeepMeContributing.SchedulesStore');
goog.require('KeepMeContributing.NotificationStatusViewModel');
goog.require('KeepMeContributing.NotificationStatusStore');
goog.require('KeepMeContributing.ScheduleInputView');

goog.require('goog.ui.Component');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.dom');
goog.require('goog.events.Event');

goog.require('goog.array');

KeepMeContributing.SchedulesView = class extends goog.ui.Component {

  /**
   * @override
   * @param {KeepMeContributing.SchedulesController} controller
   * @param {KeepMeContributing.SchedulesStore} store
   * @param {KeepMeContributing.NotificationStatusStore} notificationStatusStore
   * @param {{update: goog.ui.Button, add: goog.ui.Button}} controls
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(controller, store, notificationStatusStore, controls, domHelper = undefined){
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
     * @type {KeepMeContributing.NotificationStatusStore}
     * @private
     */
    this.notificationStatusStore_ = notificationStatusStore;
    this.registerDisposable(this.notificationStatusStore_);

    /**
     * @public for testing use only.
     * @type {goog.ui.Button}
     */
    this.updateButton = controls.update;
    this.registerDisposable(this.updateButton);

    /**
     * @public for testing use only.
     * @type {goog.ui.Button}
     */
    this.addButton = controls.add;
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
        this.sendInputSchedulesIfValid_();
      }
    );

    this.getHandler().listen(
      this.addButton, goog.ui.Component.EventType.ACTION, () => { this.addNewInput(); }
    );

    this.getHandler().listen(
      this.store_,
      KeepMeContributing.SchedulesStore.Events.LOADED,
      (/** goog.events.Event */ event) => {
        let /** {schedules: !Array<KeepMeContributing.Worker.TimeOfDay>} */ eventWithSchedules =
          /** @type {{schedules: !Array<KeepMeContributing.Worker.TimeOfDay>}} */ (event);

        this.replaceWith(eventWithSchedules.schedules);
      }
    );

    this.getHandler().listen(
      this.notificationStatusStore_,
      KeepMeContributing.NotificationStatusStore.Events.UPDATED,
      () => {
        let /** boolean */ enabled = this.notificationStatusStore_.isEnabled();
        this.forEachChild((/** KeepMeContributing.ScheduleInputView */ input) => {
          input.setEnabled(enabled);
        });
        this.addButton.setEnabled(enabled);

        if (enabled){
          this.sendInputSchedulesIfValid_();
        } else {
          this.controller_.stop();
        }
      }
    );

    this.controller_.beginLoading();

    // Ask initial status
    this.notificationStatusStore_.notifyUpdated();
  }

  /**
   * Add an empty schedule input to add new one.
   */
  addNewInput(){
    this.addChild(new KeepMeContributing.ScheduleInputView(), true);
  }

  /**
   * @private
   */
  sendInputSchedulesIfValid_(){
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

};
