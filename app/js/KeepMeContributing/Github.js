/*global goog:false KeepMeContributing:false*/

/**
 * @fileoverview Wrapper of github.js or implements some API endpoints
 * which are not supported by github.js.
 */

goog.provide('KeepMeContributing.Github');

goog.require('goog.net.XhrIo');
goog.require('goog.Promise');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.xml');
goog.require('goog.dom.dataset');

/**
 * The only class that directly sends XHRs to GitHub.
 * @constructor
 */
KeepMeContributing.Github = class {
  /**
   * @nosideeffects
   * @param {{username: string, apiUrl: string, format: (KeepMeContributing.Github.Formats|undefined)}} config
   */
  constructor(config){
    /**
     * @type {string}
     * @private
     */
    this.username_ = config.username;

    /**
     * @type {KeepMeContributing.Github.Formats}
     * @private
     **/
    this.format_ =
      config.format === undefined ? KeepMeContributing.Github.Formats.DEFAULT : config.format;

    /**
     * @type {string}
     * @private
     **/
    this.endPointUrl_ = `${config.apiUrl}/users/${this.username_}/contributions`;

    if (this.format_ !== KeepMeContributing.Github.Formats.DEFAULT){
      this.endPointUrl_ += `.${this.format_}`;
    }
  }

  /**
   * @returns {goog.Promise<KeepMeContributing.Github.ContributionsCalendar, ?>}
   */
  fetchContributionsCalendar(){
    return new goog.Promise(
      (
        /** function(KeepMeContributing.Github.ContributionsCalendar) */ resolve,
        /** function(Error) */ reject
      ) => {
        goog.net.XhrIo.send(
          this.endPointUrl_,
          (event) => {
            let /** ?KeepMeContributing.Github.ContributionsCalendar */ calendar =
              KeepMeContributing.Github.ContributionsCalendar.parse(
                event.target.getResponseText(), this.format_
              );
            if(calendar){
              resolve(calendar);
            } else {
              reject(new Error(`Couldn't get contribution calendar of ${this.username_}`));
            }
          },
          'GET'
        );
      }
    );
  }

  /**
   * @returns {string}
   * Public only for testing
   */
  getEndpointUrl(){
    return this.endPointUrl_;
  }
};

/**
 * @constructor
 * Key-value store representing a contribution calendar in GitHub profile page.
 * Its key is the date of contribution.
 * And the value contains a set of contribution of the day.
 */
KeepMeContributing.Github.ContributionsCalendar = class {
  /**
   * @nosideeffects
   * @param {Object<string, KeepMeContributing.Github.Contributions>} contributionCountByDateString
   */
  constructor(contributionCountByDateString){
    /**
     * @type {Object<string, KeepMeContributing.Github.Contributions>}
     * @private
     */
    this.contributionCountByDateString_ = contributionCountByDateString;
  }

  /**
   * Retrieve Contributions set by Date
   * @nosideeffects
   * @param {Date} date
   * @returns {?KeepMeContributing.Github.Contributions}
   */
  contributionsAt(date){
    let /** number */ month = date.getMonth() + 1;
    let /** number */ day   = date.getDate();

    let /** string */ yyyy = date.getFullYear().toString();
    let /** string */ mm   = month < 10 ? `0${month}` : month.toString();
    let /** string */ dd   = day   < 10 ? `0${day}`   : day.toString();

    let /** string */ dateString = `${yyyy}-${mm}-${dd}`;

    return this.contributionCountByDateString_[dateString];
  }

  /**
   * @nosideeffects
   * @param {string} data Response body from github.com/users/<username>/contributions
   * @param {KeepMeContributing.Github.Formats} format response body format
   * @returns {?KeepMeContributing.Github.ContributionsCalendar}
   */
  static parse(data, format){
    if (format === KeepMeContributing.Github.Formats.JSON){
      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(data);
      } catch (_){ }
      if (parsedResponse){
        return new this(parsedResponse);
      } else {
        return null;
      }
    }

    let /** goog.array.ArrayLike */ elements =
      goog.dom.getElementsByClass('day', goog.dom.xml.loadXml(data));

    if(goog.array.isEmpty(elements)){
      return null;
    }

    let /** Object<string, KeepMeContributing.Github.Contributions> */ result = {};
    goog.array.forEach(elements, (/** Element */ element) => {
      let /** ?string */ dateString = goog.dom.dataset.get(element, 'date');
      let /** ?string */ countString = goog.dom.dataset.get(element, 'count');
      let /** number */ count = parseInt(countString, 10);
      if(!dateString || isNaN(count)){
        console.warn(`Invalid day of contribution calendar: data-date: ${dateString}, data-count: ${countString}`);
        return;
      }
      result[dateString] = { length: count };
    });
    return new this(result);
  }
};

/**
 * @typedef {{length: number}}
 * Currently it represents only count of the contributions of the day.
 */
KeepMeContributing.Github.Contributions;

/**
 * Constants for format names. Used to suffix the request URL.
 * @enum {string}
 */
KeepMeContributing.Github.Formats = {
  DEFAULT: '',
  JSON: 'json'
};
