'use strict';

describe('ContributionStatus', function(){
  before(function(){
    let github = new KeepMeContributing.Github({
      username: 'igrep',
      // access to js-dev-server on test
      apiUrl: '/test/fixtures/github.com'
    });
    this.describedInstance = new KeepMeContributing.ContributionStatus(github);
  });

  describe('#queryHasContributedAt', function(){
    before(function(){
      this.subjectFunction = function(date){
        return this.describedInstance.queryHasContributedAt(date);
      };

      this.expectTheResultToBe = function(date, expected) {
        return this.subjectFunction(date).then(function(actual){ expect(actual).to.be(expected); });
      };
    });

    context('given a response of https://github.com/users/igrep/contributions', function(){

      context("the argument date's contribution count is 0", function(){
        it('returns false', function(){
          return this.expectTheResultToBe(new Date('2015-07-31'), false);
        });
      });

      context("the argument date's contribution count is 2", function(){
        it('returns true', function(){
          return this.expectTheResultToBe(new Date('2015-07-23'), true);
        });
      });

      context("the argument date's contribution count is 1", function(){
        it('returns true', function(){
          return this.expectTheResultToBe(new Date('2015-07-29'), true);
        });
      });

      context("the argument date's contribution count is present", function(){
        it('returns false', function(){
          return this.expectTheResultToBe(new Date('2015-08-01'), false);
        });
      });

    });
  });
});
