'use strict';

/**
 * @fileoverview
 * This file tests KeepMeContributing.Worker.ContributionStatusNotifier#askToNotifyAt
 * by actually accessing to the API server.
 *
 * Why not unit test of KeepMeContributing.Worker.ContributionStatusNotifier?
 * ----------------
 *  I'm concerned about some edge cases which occurrs only when communicating with
 *  the server, especially the slowness of the response of API,
 *  which I guess has caused a timing error when wrapping goog.XhrIo.send
 *  with goog.Promise.
 *
 *  Related commits:
 *    - https://github.com/igrep/keep-me-contributing/commit/e94e5401005d92151b01462e4caa2888ac01b2d4
 *    - https://github.com/igrep/keep-me-contributing/commit/8a9dbf355e03f37a6efb28978629439606911266
 */

describe('ContributionStatusNotifier', function(){
  this.timeout(5000);

  let describedClass = KeepMeContributing.Worker.ContributionStatusNotifier;
  let describedFunction = (username, dateToAsk) => {
    let describedInstance = new describedClass(
      username,
      new KeepMeContributing.ContributionStatus(
        new KeepMeContributing.Github({
          username: username, format: KeepMeContributing.Github.Formats.JSON, apiUrl: ''
        })
      )
    );

    // sleep 2 seconds to reduce access to github.com, indirectly accessed by the API server.
    let now;
    let end = new Date().getTime() + 2000;
    do {
      now = new Date().getTime();
    } while (now < end)

    return describedInstance.askToNotifyAt(timeWhenExecuted, dateToAsk);
  };

  let timeWhenExecuted = new KeepMeContributing.Worker.TimeOfDay(9, 30);

  beforeEach(function(){
    this.registrationStub = sinon.stub(
      describedClass.prototype, 'showNotification', console.log.bind(console)
    );
    this.permissionStub = sinon.stub(describedClass.prototype, 'getPermission');
    this.warnSpy = sinon.spy(console, 'warn');
  });
  afterEach(function(){
    describedClass.prototype.showNotification.restore();
    describedClass.prototype.getPermission.restore();
    console.warn.restore();
  });

  context('when accessing to an existing user (such as igrep)', function(){
    let username = 'igrep';

    context('asking contribution status at the day the user has contributed (this test assumes I have actually contributed today!)', function(){
      let date = new Date();

      context('when the user has permitted to notify', function(){
        beforeEach(function(){ this.permissionStub.returns('granted'); });

        it('notifies that the user has contributed', function(done){
          describedFunction(username, date).thenAlways(() => {
            sinon.assert.alwaysCalledWith(
              this.registrationStub,
              `Congratulations! ${username} has already contributed today!`
            );
            done();
          });
        });
      });

      context('when the user has not permitted to notify', function(){
        beforeEach(function(){ this.permissionStub.returns('default'); });

        it('warns that the user has not permitted to notify', function(done){
          describedFunction(username, date).thenAlways(() => {
            sinon.assert.calledWith(
              this.warnSpy,
              `Denied to show notification. Current Notification.permission is ${Notification.permission}`
            );
            done();
          });
        });
      });

    });

    context('asking contribution status at the (future) day the user has never contributed', function(){
      let date = new Date();
      date.setDate(date.getDate() + 1);

      context('when the user has permitted to notify', function(){
        beforeEach(function(){ this.permissionStub.returns('granted'); });

        it('notifies that the user has not contributed', function(done){
          describedFunction(username, date).thenAlways(() => {
            sinon.assert.alwaysCalledWith(
              this.registrationStub,
              `Oh my... ${username} has NOT contributed yet today!`
            );
            done();
          });
        });
      });

    });

  });

  context('when accessing to a non-existing user (at least invisible from the API server)', function(){
    let username = 'users';
    let date = new Date();

    context('when the user has permitted to notify', function(){
      beforeEach(function(){ this.permissionStub.returns('granted'); });

      it('notifies that an error has occurred', function(done){
        describedFunction(username, date).then(() => {
          sinon.assert.alwaysCalledWith(
            this.registrationStub,
            'An error occurred while asking if contributed'
          );
          done();
        });
      });
    });

  });

});
