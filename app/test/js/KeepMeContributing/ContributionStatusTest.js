'use strict';

describe('ContributionStatus', function(){
  before(function(){
    /**
     * @type {ContributionStatus}
     */
    this.describedInstance = new ContributionStatus({
      username: 'igrep',
      // access to js-dev-server on test
      // FIXME: use sinon.js fakeServer
      apiUrl: 'http://localhost:9876/test/fixtures/github.com'
    });
  });

  describe('#queryHasContributedAt', function(){
    before(function(){
      this.subjectFunction = function(date){
        return this.describedInstance.queryHasContributedAt(date);
      };
    });

    context('given a response of https://github.com/users/igrep/contributions', function(){

      context("the argument date's contribution count is 0", function(){
        it('returns false', function(){
          return this.subjectFunction(new Date('2015-07-31')).then(function(result){ assert(result === false); });
        });
      });

      context("the argument date's contribution count is 2", function(){
        it('returns true', function(){
          return this.subjectFunction(new Date('2015-07-23')).then(function(result){ assert(result === true); });
        });
      });

      context("the argument date's contribution count is 1", function(){
        it('returns true', function(){
          return this.subjectFunction(new Date('2015-07-29')).then(function(result){ assert(result === true); });
        });
      });

      context("the argument date's contribution count is present", function(){
        it('returns false', function(){
          return this.subjectFunction(new Date('2015-08-01')).then(function(result){ assert(result === false); });
        });
      });

    });
  });
});
