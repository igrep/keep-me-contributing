'use strict';

goog.require('KeepMeContributing.Worker.TimeOfDay');

goog.require('KeepMeContributing.Worker.SchedulesRunner');

describe('SchedulesRunner', function(){
  let describedClass = KeepMeContributing.Worker.SchedulesRunner;

  let noon = new Date();
  noon.setHours(12);
  noon.setMinutes(0);
  noon.setSeconds(0, 0);

  beforeEach(function () { this.clock = sinon.useFakeTimers(noon.getTime()); });
  afterEach(function () { this.clock.restore(); });

  describe('.run', function(){
    let describedFunction = (times, task) => {
      describedClass.run(times, task);
    };

    beforeEach(function(){ this.spy = sinon.spy(); });
    afterEach(function(){ this.spy.reset(); });

    context('Start running after giving some schedules', function(){
      let passedTimes = [new KeepMeContributing.Worker.TimeOfDay(noon.getHours() - 1, noon.getMinutes())];
      let nonPassedTimes = [
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours() + 1, noon.getMinutes()),
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours() + 2, noon.getMinutes()),
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours() + 4, noon.getMinutes())
      ];
      let times = passedTimes.concat(nonPassedTimes);

      beforeEach(function(){
        describedFunction(times, this.spy);
      });

      it("does nothing when time doesn't pass.", function(){
        expect(this.spy.called).to.be(false);
      });

      context('when it becomes the earliest not-yet time', function(){
        beforeEach(function(){ this.clock.tick(nonPassedTimes[0].millisecsAfter(noon)); });
        it('executes the task for first not-yet time once.', function(){
          expect(this.spy.callCount).to.be(1);
          expect(this.spy.calledWithExactly(nonPassedTimes[0])).to.be(true);
        });
      });

      context('when it becomes the second earliest not-yet time', function(){
        beforeEach(function(){ this.clock.tick(nonPassedTimes[1].millisecsAfter(noon)); });
        it('executes the task twice: for first not-yet time and the second one.', function(){
          expect(this.spy.callCount).to.be(2);
          expect(this.spy.getCall(0).calledWithExactly(nonPassedTimes[0])).to.be(true);
          expect(this.spy.getCall(1).calledWithExactly(nonPassedTimes[1])).to.be(true);
        });
      });

      context('when it becomes the last not-yet time', function(){
        beforeEach(function(){
          this.clock.tick(nonPassedTimes[nonPassedTimes.length - 1].millisecsAfter(noon));
        });

        it('executes the task as many as the number of the not-yet times: for all not-yet times.', function(){
          expect(this.spy.callCount).to.be(nonPassedTimes.length);
          expect(this.spy.callCount).to.be(nonPassedTimes.length);
          goog.array.forEach(nonPassedTimes, (nonPassedTime, i) => {
            expect(this.spy.getCall(i).calledWithExactly(nonPassedTime)).to.be(true);
          });
        });

      });

      context("when it becomes the next day's first time to run task (the done time when the instance got initialized)", function(){

        beforeEach(function(){
          let firstTaskTimeTomorrow = new Date(noon.valueOf());
          firstTaskTimeTomorrow.setDate(firstTaskTimeTomorrow.getDate() + 1);
          firstTaskTimeTomorrow.setHours(passedTimes[0].hour);
          firstTaskTimeTomorrow.setMinutes(passedTimes[0].minute);
          firstTaskTimeTomorrow.setSeconds(0, 0);
          this.clock.tick(firstTaskTimeTomorrow - noon);
        });

        it('executes the task as many as the number of the not-yet times plus 1.', function(){
          expect(this.spy.callCount).to.be(nonPassedTimes.length + 1);
        });

        it("executes the task for the next day's first time", function(){
          expect(this.spy.lastCall.calledWithExactly(passedTimes[0])).to.be(true);
        });
      });

      context("when it becomes the next day's second time to run task (the first not-yet time when the instance got initialized)", function(){

        beforeEach(function(){
          let secondTaskTimeTomorrow = new Date(noon.valueOf());
          secondTaskTimeTomorrow.setDate(secondTaskTimeTomorrow.getDate() + 1);
          secondTaskTimeTomorrow.setHours(nonPassedTimes[0].hour);
          secondTaskTimeTomorrow.setMinutes(nonPassedTimes[0].minute);
          secondTaskTimeTomorrow.setSeconds(0, 0);
          this.clock.tick(secondTaskTimeTomorrow - noon);
        });

        it('executes the task as many as the number of the not-yet times plus 2.', function(){
          expect(this.spy.callCount).to.be(nonPassedTimes.length + 2);
        });
      });

      context("when it becomes the next day's third time to run task (the second not-yet time when the instance got initialized)", function(){

        beforeEach(function(){
          let thirdTaskTimeTomorrow = new Date(noon.valueOf());
          thirdTaskTimeTomorrow.setDate(thirdTaskTimeTomorrow.getDate() + 1);
          thirdTaskTimeTomorrow.setHours(nonPassedTimes[1].hour);
          thirdTaskTimeTomorrow.setMinutes(nonPassedTimes[1].minute);
          thirdTaskTimeTomorrow.setSeconds(0, 0);
          this.clock.tick(thirdTaskTimeTomorrow - noon);
        });

        it('executes the task as many as the number of the not-yet times plus 3.', function(){
          expect(this.spy.callCount).to.be(nonPassedTimes.length + 3);
        });
      });

      context("when it becomes the next day's last time to run task (the last not-yet time when the instance got initialized)", function(){

        beforeEach(function(){
          let lastTaskTimeTomorrow = new Date(noon.valueOf());
          lastTaskTimeTomorrow.setDate(lastTaskTimeTomorrow.getDate() + 1);
          lastTaskTimeTomorrow.setHours(nonPassedTimes[nonPassedTimes.length - 1].hour);
          lastTaskTimeTomorrow.setMinutes(nonPassedTimes[nonPassedTimes.length - 1].minute);
          lastTaskTimeTomorrow.setSeconds(0, 0);
          this.clock.tick(lastTaskTimeTomorrow - noon);
        });

        it('executes the task as many as the number of the not-yet times today plus the number of all (done and not-yet) tasks.', function(){
          expect(this.spy.callCount).to.be(nonPassedTimes.length + times.length);
        });
      });

      context('given an empty schedules after start running', function(){
        beforeEach(function(){
          describedFunction([], this.spy);
        });

        context('when it becomes the earliest not-yet time', function(){
          beforeEach(function(){ this.clock.tick(nonPassedTimes[0].millisecsAfter(noon)); });
          it('does nothing.', function(){
            expect(this.spy.called).to.be(false);
          });
        });
      });

    });

  });

});
