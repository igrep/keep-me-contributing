/**
 * @fileoverview
 * FaviconView for ContributionStatus. Change the favicon according to today's contribution status.
 */

goog.provide('KeepMeContributing.FaviconView');

goog.require('KeepMeContributing.ContributionStatus');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.dom.TagName');

KeepMeContributing.FaviconView = class extends goog.ui.Component {

  /**
   * @param {KeepMeContributing.ContributionStatus} contributionStatus
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(contributionStatus, domHelper = undefined){
    super(domHelper);
    this.setModel(contributionStatus);
  }

  /** @override */
  enterDocument(){
    super();

    this.attachContentToEvent_(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED);
    this.attachContentToEvent_(KeepMeContributing.ContributionStatus.Events.NOT_YET);
    this.attachContentToEvent_(KeepMeContributing.ContributionStatus.Events.ERROR);
  }

  /**
   * @override
   * @param {Element} e must be a <link> element.
   * @returns {boolean}
   **/
  canDecorate(e){
    return e.tagName === goog.dom.TagName.LINK;
  }

  /**
   * @private
   * @param {KeepMeContributing.ContributionStatus.Events} eventName
   */
  attachContentToEvent_(eventName){
    let /** KeepMeContributing.ContributionStatus */ contributionStatus =
      /** @type {KeepMeContributing.ContributionStatus} */ (this.getModel());
    this.getHandler().listen(contributionStatus, eventName, () => {
      this.getElement().href = `img/favicon-${eventName}.ico`;
    });
  }

};
