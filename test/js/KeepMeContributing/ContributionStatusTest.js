'use strict';

import assert from 'power-assert';
import path from 'path';
import * as nws from 'node-web-server';

import jsdom from 'mocha-jsdom';
jsdom();

import ContributionStatus from '../../../app/js/KeepMeContributing';

describe('ContributionStatus', function(){
  before(function(){
    /**
     * @type {ContributionStatus}
     */
    this.describedInstance = new ContributionStatus({
      username: 'igrep',
      // access to js-dev-server on test
      // FIXME: use sinon.js fakeServer
      apiUrl: 'http://localhost:9876/fixtures/github.com'
    });
  });

  after(() => { nws.stop(); });

  describe('#queryHasContributedAt', function(){
    before(function(){
      /**
       * @type {function(Date): boolean}
       */
      this.subjectFunction = function(date){
        return this.describedInstance.queryHasContributedAt(date);
      };
    });

    context('given a response of https://github.com/users/igrep/contributions', function(){
      before(() => {
        /**
         * serve fixtures because sinon.js didn't work maybe because
         * fakeServer can't modify XMLHttpRequest correctly.
         */
        nws.run(
          {
            host: 'localhost',
            port: 8999,
            docRoot: 'github.com',
            MIME: { '': 'text/html; charset=utf-8' }
          },
          path.normalize(path.join(__dirname, '../../fixtures/'))
        );
      });

      context("the argument date's contribution count is 0", function(){
        it('returns false', function(){
          return this.subjectFunction(new Date('2015-07-31')).then((result) => { assert(result === false); });
        });
      });

      context("the argument date's contribution count is 2", function(){
        it('returns true', function(){
          return this.subjectFunction(new Date('2015-07-23')).then((result) => { assert(result === true); });
        });
      });

      context("the argument date's contribution count is 1", function(){
        it('returns true', function(){
          return this.subjectFunction(new Date('2015-07-29')).then((result) => { assert(result === true); });
        });
      });

      context("the argument date's contribution count is present", function(){
        it('returns false', function(){
          return this.subjectFunction(new Date('2015-08-01')).then((result) => { assert(result === false); });
        });
      });

    });
  });
});
