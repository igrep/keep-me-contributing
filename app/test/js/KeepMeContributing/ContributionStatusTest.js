'use strict';

goog.require('goog.Promise');
goog.require('goog.object');

describe('ContributionStatus', function(){
  before(function(){
    let github = new KeepMeContributing.Github({
      username: 'igrep',
      // access to js-dev-server on test
      apiUrl: '/test/fixtures/github.com'
    });
    this.describedClass = KeepMeContributing.ContributionStatus;
    this.describedInstance = new this.describedClass(github);
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

  /**
   * FIXME: complex test code.
   * Maybe I should test this method on the view model with less stubbed objects.
   */
  describe('startPolling', function(){
    before(function(){
      this.stubQuery = sinon.stub(this.describedClass.prototype, 'queryHasContributedAt');
      this.clock = sinon.useFakeTimers();

      this.subjectFunction = function(){
        this.describedInstance.startPolling(1);
        this.clock.tick(1);
      };

      this.expectTheDipatchedEventToBe = function(expectedEvent, done){
        goog.events.listen(this.describedInstance, expectedEvent, function(){
          expect(expectedEvent).to.be(expectedEvent);
          done();
        });
        this.subjectFunction();
      }.bind(this);
    });
    after(function(){
      this.stubQuery.restore();
      this.clock.restore();
    });

    context('when querying contribution status successfully', function(){
      before(function(){
        this.stubQueryResultAs = function(result){
          this.stubQuery.returns(new goog.Promise(function(resolve){ resolve(result); }));
        };
      });

      context('the answer is true', function(){
        before(function(){ this.stubQueryResultAs(true); });
        it('dispatches a contributed event', function(done){
          this.expectTheDipatchedEventToBe(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED, done);
        });
      });

      context('the answer is false', function(){
        before(function(){ this.stubQueryResultAs(false); });
        it('dispatches a not_yet event', function(done){
          this.expectTheDipatchedEventToBe(KeepMeContributing.ContributionStatus.Events.NOT_YET, done);
        });
      });
    });

  });
});
