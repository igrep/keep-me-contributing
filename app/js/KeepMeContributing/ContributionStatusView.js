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

    this.getHandler().listen(
      this.contributionStatus_,
      KeepMeContributing.ContributionStatus.Events.CONTRIBUTED,
      () => {
        // TODO: switch class using goog.dom.classes.addRemove
        this.getDomHelper().setTextContent(
          this.getElement(), `Congratulations! ${this.username_} has already contributed today!`
        );
      }
    );
    this.getHandler().listen(
      this.contributionStatus_,
      KeepMeContributing.ContributionStatus.Events.NOT_YET,
      () => {
        this.getDomHelper().setTextContent(
          this.getElement(), `Oh my... ${this.username_} has NOT contributed yet today!`
        );
      }
    );
    this.getHandler().listen(
      this.contributionStatus_,
      KeepMeContributing.ContributionStatus.Events.ERROR,
      () => {
        this.getDomHelper().setTextContent(
          this.getElement(), 'An error occurred while loading contribution status. See the developer console for details.'
        );
      }
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

}

KeepMeContributing.ContributionStatusView = ContributionStatusView;
