/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents form to edit schedules (collection of timeOfDays)
 */

goog.provide('KeepMeContributing.ScheduleInputView');

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.ui.Control');
goog.require('goog.ui.ComboBox');
goog.require('goog.dom');

goog.require('goog.array');

KeepMeContributing.ScheduleInputView = class extends goog.ui.Control {

  /**
   * @override
   * @param {KeepMeContributing.Worker.TimeOfDay=} time
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(time = undefined, domHelper = undefined){
    super();

    /**
     * @private
     * @type {string}
     */
    this.timeString_ = time ? time.toHHMM() : '';

    let /** goog.ui.ComboBox */ comboBox = new goog.ui.ComboBox(
      undefined, undefined, new goog.ui.LabelInput('HH:MM')
    );
    for (let /** number */ hour = 0; hour < 23; ++hour){
      let /** string */ hh00 =
        (new KeepMeContributing.Worker.TimeOfDay(hour, 0)).toHHMM();
      comboBox.addItem(new goog.ui.MenuItem(hh00));
    }

    this.addChild(comboBox);
  }

  /**
   * Retrieve timeOfDay from user-input value.
   * TODO: add / remove class to the element by the result of fromHHMM().
   * @returns {?KeepMeContributing.Worker.TimeOfDay}
   */
  parseInputTimeOfDay(){
    return KeepMeContributing.Worker.TimeOfDay.fromHHMM(
      this.comboBox.getInputElement().value
    );
  }

  /**
   * Returns whether nothing has been input.
   * @returns {boolean}
   */
  hasNoInput(){
    return this.comboBox.getInputElement().value.length === 0;
  }

  /**
   * @returns {goog.ui.ComboBox}
   */
  get comboBox(){
    return /** @type {goog.ui.ComboBox} */ (this.getChildAt(0));
  }

  /**
   * This component can't be decorated because the child comboBox
   * can't be decorated.
   *
   * @override
   * @param {Element} _element ignored.
   * @returns {boolean}
   **/
  canDecorate(_element){
    return false;
  }

  /**
   * Prepare comboBox to accept input.
   *
   * @override
   */
  createDom(){
    super();

    this.comboBox.createDom();
    this.getDomHelper().appendChild(
      this.getElement(), this.comboBox.getElement()
    );

    this.comboBox.getInputElement().value = this.timeString_;

    // TODO: add button to close
  }

};
