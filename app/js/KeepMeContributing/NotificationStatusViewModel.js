/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents checkbox to enable / disable notifications
 * (changes whether the schedule executor runs or not)
 */

goog.provide('KeepMeContributing.NotificationStatusViewModel');

goog.require('KeepMeContributing.NotificationStatusStore');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');
goog.require('goog.ui.CheckboxRenderer');
goog.require('goog.dom');

/**
 * @constructor
 * Represents a checkbox to enable / disable notifications.
 *
 * FIXME: Maybe delegating goog.ui.Checkbox is enough.
 * But I'm not sure how to do it...
 */
KeepMeContributing.NotificationStatusViewModel = class extends goog.ui.Checkbox {

  /**
   * @override
   * @param {KeepMeContributing.NotificationStatusStore} notificationStatusStore
   * @param {goog.ui.Checkbox.State=} checked
   * @param {goog.dom.DomHelper=} domHelper
   * @param {goog.ui.CheckboxRenderer=} renderer
   */
  constructor(notificationStatusStore, checked = undefined, domHelper = undefined, renderer = undefined){
    super(checked, domHelper, renderer);

    /**
     * While a SchedulesView emit UI changes via its SchedulesController,
     * a NotificationStatusViewModel calls its NotificationStatusStore's method directly.
     * Because the NotificationStatusStore is the only object that handles the changes
     * in a NotificationStatusViewModel, and it's sufficiently simple (at least so far).
     *
     * @type {KeepMeContributing.NotificationStatusStore}
     * @private
     */
    this.notificationStatusStore_ = notificationStatusStore;
    this.registerDisposable(this.notificationStatusStore_);
  }

  /**
   * @override
   */
  enterDocument(){
    super();

    this.setChecked(this.notificationStatusStore_.isEnabled());

    this.getHandler().listen(
      this, goog.ui.Component.EventType.CHANGE, () => {
        let /** boolean */ checked = this.getChecked() === true;
        this.notificationStatusStore_.save(checked);
      }
    );
  }

};
