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
 * Key-value store representing a contribution calendar in GitHub profile page.
 * Its key is the date of contribution.
 * And the value contains a set of contribution of the day.
 */
class ContributionsCalendar {
  /**
   * @nosideeffects
   * @constructor
   * @param {Object<string, KeepMeContributing.Github.Contributions>} contributionCountByDateString
   */
  constructor(contributionCountByDateString){
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
   * @param {string} svgData Response SVG Document from github.com/users/<username>/contributions
   * @returns {?KeepMeContributing.Github.ContributionsCalendar}
   */
  static parse(svgData){
    let /** goog.array.ArrayLike */ elements =
      goog.dom.getElementsByClass('day', goog.dom.xml.loadXml(svgData));

    if(goog.array.isEmpty(elements)){
      return null;
    }

    let /** Object<string, KeepMeContributing.Github.Contributions> */ result = {};
    goog.array.forEach(elements, (/** Element */ element) => {
      let /** ?string */ dateString = goog.dom.dataset.get(element, 'date');
      let /** number */ count = parseInt(goog.dom.dataset.get(element, 'count'), 10);
      if(!dateString || isNaN(count)){
        return;
      }
      result[dateString] = { length: count };
    });
    return new this(result);
  }
}

class Github {
  /**
   * @constructor
   * @nosideeffects
   * @param {{username: string, apiUrl: string}} config
   */
  constructor(config){
    /** @type {string} */
    this.endPointUrl_ = `${config.apiUrl}/users/${config.username}/contributions`;
  }

  /**
   * @returns {goog.Promise<ContributionsCalendar, ?>}
   */
  fetchContributionsCalendar(){
    return new goog.Promise(
      (
        /** function(ContributionsCalendar) */ resolve,
        /** function() */ reject
      ) => {
        goog.net.XhrIo.send(
          this.endPointUrl_,
          (event) => {
            let /** ?ContributionsCalendar */ calendar =
              ContributionsCalendar.parse(event.target.getResponseText());
            if(calendar){
              resolve(calendar);
            } else {
              reject();
            }
          },
          'GET'
        );
      }
    );
  }
}

/**
 * @typedef {Github}
 */
KeepMeContributing.Github = Github;

/**
 * @typedef {{length: number}}
 * Currently it represents only count of the contributions of the day.
 */
KeepMeContributing.Github.Contributions;

/**
 * @typedef {ContributionsCalendar}
 */
KeepMeContributing.Github.ContributionsCalendar = ContributionsCalendar;
