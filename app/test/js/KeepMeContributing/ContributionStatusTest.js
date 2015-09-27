'use strict';

goog.require('goog.Promise');

describe('ContributionStatus', function(){
  let describedClass = KeepMeContributing.ContributionStatus;
  let describedInstanceFor = function(username, opt_format){
    let github = new KeepMeContributing.Github({
      username: username,
      // access to development server on test
      apiUrl: '/test/fixtures/github.com',
      format: opt_format
    });
    return new describedClass(github);
  };

  describe('#queryHasContributedAt', function(){

    let returnsTrueOrFalseBasedOnContributionsCount = function(describedInstance){

      let expectTheResultToBe = function(date, expected) {
        return describedInstance.queryHasContributedAt(date)
          .then(function(actual){ expect(actual).to.be(expected); });
      };

      context("the argument date's contribution count is 0", function(){
        it('returns false', function(){
          return expectTheResultToBe(new Date('2015-07-31'), false);
        });
      });

      context("the argument date's contribution count is 2", function(){
        it('returns true', function(){
          return expectTheResultToBe(new Date('2015-07-23'), true);
        });
      });

      context("the argument date's contribution count is 1", function(){
        it('returns true', function(){
          return expectTheResultToBe(new Date('2015-07-29'), true);
        });
      });

      context("the argument date's contribution count is not present", function(){
        it('returns false', function(){
          return expectTheResultToBe(new Date('2015-08-01'), false);
        });
      });

    };

    context('given a response of https://github.com/users/igrep/contributions', function(){
      let describedInstance = describedInstanceFor('igrep');
      returnsTrueOrFalseBasedOnContributionsCount(describedInstance);

      it('has correct endpoint URL', function(){
        expect(describedInstance.endpointUrl).to.match(
          new RegExp('github\\.com/users/igrep/contributions$')
        );
      });
    });

    context('given a response of https://github.com/users/igrep/contributions.json', function(){
      let describedInstance = describedInstanceFor('igrep', KeepMeContributing.Github.Formats.JSON);
      returnsTrueOrFalseBasedOnContributionsCount(describedInstance);

      it('has correct endpoint URL', function(){
        expect(describedInstance.endpointUrl).to.match(
          new RegExp('github\\.com/users/igrep/contributions\\.json$')
        );
      });
    });

    context('given no response from github.com', function(){
      let username = 'non_existing_user';
      let describedInstance = describedInstanceFor(username);

      it('throws an error to show the reponse was unavailable.', function(){
        return describedInstance.queryHasContributedAt(new Date())
          .then(
            function(){ expect().fail(); },
            function(error){
              expect(error.toString()).to.match(
                new RegExp(`Error: Couldn't get contribution calendar of ${username}`)
              );
            }.bind(this)
          )
        ;
      });

    });
  });

  describe('startPolling', function(){
    // Immediately timeout to show failure when the specified event doesn't occur.
    this.timeout(100);

    before(function(){

      this.describedInstance = describedInstanceFor('igrep');

      this.stubQuery = sinon.stub(describedClass.prototype, 'queryHasContributedAt');

      this.expectTheDipatchedEventToBe = function(expectedEvent, done){

        goog.events.listen(this.describedInstance, expectedEvent, function(){
          expect(expectedEvent).to.be(expectedEvent);
          done();
        });
        this.describedInstance.startPolling(1);
      }.bind(this);
    });
    after(function(){
      this.stubQuery.restore();
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

    context('when failed to query contribution status', function(){
      before(function(){
        this.stubQuery.returns(
          new goog.Promise(function(_, reject){
            reject(new Error('error caused by test'));
          })
        );
      });

      it('dispatches an error event', function(done){
        this.expectTheDipatchedEventToBe(KeepMeContributing.ContributionStatus.Events.ERROR, done);
      });

    });

  });
});
