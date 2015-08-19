/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * View for ContributionStatus.
 */

goog.provide('KeepMeContributing.ContributionStatusView');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventTarget');

/**
 * NOTE: extending by ES6 style, closure compiler warns a lot.
 *       report later if I remember.
 */
class ContributionStatusView extends goog.ui.Component {

  /**
   * @constructor
   * @extends {goog.ui.Component}
   * @param {string} username
   * @param {KeepMeContributing.ContributionStatus} contributionStatus
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(username, contributionStatus, domHelper = undefined){
    super(domHelper);

    /**
     * @type {goog.events.EventTarget}
     * @private
     */
    this.contributionStatus_ = contributionStatus;
    /**
     * @type {string}
     * @private
     */
    this.username_ = username;

    this.registerDisposable(this.contributionStatus_);
  }

  /** @override */
  enterDocument(){
    super();

    this.attachContentToEvent_(
      KeepMeContributing.ContributionStatus.Events.CONTRIBUTED,
      `Congratulations! ${this.username_} has already contributed today!`,
      'success'
    );
    this.attachContentToEvent_(
      KeepMeContributing.ContributionStatus.Events.NOT_YET,
      `Oh my... ${this.username_} has NOT contributed yet today!`,
      'danger'
    );
    this.attachContentToEvent_(
      KeepMeContributing.ContributionStatus.Events.ERROR,
      'An error occurred while loading contribution status. See the developer console for details.',
      'warning'
    );
  }

  /** @override */
  disposeInternal(){
    super();
    this.contributionStatus_ = null;
  }

  /**
   * {@code goog.ui.Component.prototype.render} is enough to use this component because it doesn't have any children.
   * @override
   * @param {Element} _element ignored.
   * @returns {boolean}
   **/
  canDecorate(_element){
    return false;
  }

  /**
   * @private
   * @param {ContributionStatus.Events} eventName
   * @param {string} message
   * @param {string} className
   */
  attachContentToEvent_(eventName, message, className){
    this.getHandler().listen(this.contributionStatus_, eventName, () => {
      let /** Element */ e = this.getElement();
      this.getDomHelper().setTextContent(e, message);
      goog.dom.classlist.set(e, className);
    });
  }

}

KeepMeContributing.ContributionStatusView = ContributionStatusView;