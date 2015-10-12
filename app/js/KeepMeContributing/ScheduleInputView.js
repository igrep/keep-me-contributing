/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Represents form to edit schedules (collection of timeOfDays)
 */

goog.provide('KeepMeContributing.ScheduleInputView');

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('goog.ui.Component');
goog.require('goog.ui.Button');
goog.require('goog.ui.ComboBox');
goog.require('goog.dom');
goog.require('goog.dom.classlist');

goog.require('goog.array');

KeepMeContributing.ScheduleInputView = class extends goog.ui.Component {

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
    for (let /** number */ hour = 0; hour <= 23; ++hour){
      let /** string */ hh00 =
        (new KeepMeContributing.Worker.TimeOfDay(hour, 0)).toHHMM();
      comboBox.addItem(new goog.ui.MenuItem(hh00));
    }

    this.addChild(new goog.ui.Button('Ｘ'));
    this.addChild(comboBox);
  }

  /**
   * Public only for testing.
   * @returns {goog.ui.Button}
   */
  get closeButton(){
    return /** @type {goog.ui.Button} */ (this.getChildAt(0));
  }

  /**
   * Public only for testing.
   * @returns {goog.ui.ComboBox}
   */
  get comboBox(){
    return /** @type {goog.ui.ComboBox} */ (this.getChildAt(1));
  }

  /**
   * @param {boolean} enabled
   */
  setEnabled(enabled){
    this.closeButton.setEnabled(enabled);
    this.comboBox.setEnabled(enabled);

    goog.dom.classlist.enable(this.getElement(), 'ScheduleInputView-invalid', false);
    this.getElement().title = '';
  }

  /**
   * Retrieve timeOfDay from user-input value.
   * @returns {?KeepMeContributing.Worker.TimeOfDay}
   */
  parseInputTimeOfDay(){
    let /** ?KeepMeContributing.Worker.TimeOfDay */ maybeTime =
      KeepMeContributing.Worker.TimeOfDay.fromHHMM(
        this.comboBox.getInputElement().value
      );

    let /** boolean */ invalid = maybeTime === null;
    goog.dom.classlist.enable(this.getElement(), 'ScheduleInputView-invalid', invalid);
    if (invalid){
      this.getElement().title = 'Enter an HH:MM format time (e.g. "12:34").';
    } else {
      this.getElement().title = '';
    }
    return maybeTime;
  }

  /**
   * Returns whether nothing has been input.
   * @returns {boolean}
   */
  hasNoInput(){
    return this.comboBox.getInputElement().value.length === 0;
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

    this.forEachChild((child) => {
      child.createDom();
      this.getDomHelper().appendChild(
        this.getElement(), child.getElement()
      );
    });

    this.comboBox.getInputElement().value = this.timeString_;
  }

  /**
   * @override
   */
  enterDocument(){
    super();

    this.getHandler().listen(
      this.closeButton, goog.ui.Component.EventType.ACTION, () => {
        this.getParent().removeChild(this, true);
      }
    );
  }

  /**
   * @param {string} value
   */
  setValue(value){
    this.comboBox.setValue(value);
  }

};
