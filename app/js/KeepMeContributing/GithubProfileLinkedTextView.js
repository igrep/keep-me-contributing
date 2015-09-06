/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview
 * Add text with link to a user's GitHub profile page.
 */

goog.provide('KeepMeContributing.GithubProfileLinkedTextView');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.dom.TagName');

/**
 * @extends {goog.ui.Component}
 * @constructor
 */
KeepMeContributing.GithubProfileLinkedTextView = class extends goog.ui.Component {

  /**
   * @param {string} beforeUsername
   * @param {string} username
   * @param {string} afterUsername
   * @param {goog.dom.DomHelper=} domHelper
   */
  constructor(beforeUsername, username, afterUsername, domHelper = undefined){
    super(domHelper);

    /**
     * @type {string}
     * @private
     */
    this.username_ = username;

    /**
     * @type {string}
     * @private
     */
    this.beforeUsername_ = beforeUsername;

    /**
     * @type {string}
     * @private
     */
    this.afterUsername_ = afterUsername;
  }

  /** @override */
  createDom(){
    let /** goog.dom.DomHelper */ h = this.getDomHelper();
    let dom  = goog.bind(h.createDom,      h);
    let text = goog.bind(h.createTextNode, h);
    let element = dom(
      goog.dom.TagName.SPAN, null,
      text(this.beforeUsername_),
      dom(
        goog.dom.TagName.A, {
          href: `https://github.com/${this.username_}`, target: '_blank'
        },
        text(this.username_)
      ),
      text(this.afterUsername_)
    );
    this.setElementInternal(element);
  }

  /**
   * {@code goog.ui.Component.prototype.render} is enough to use this component.
   * @override
   * @param {Element} _element ignored.
   * @returns {boolean}
   **/
  canDecorate(_element){
    return false;
  }

};
