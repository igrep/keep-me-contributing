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

  describe('#update', function(){
    let describedFunction = (timeOfDays) => {
      return (new describedClass).update(timeOfDays);
    };

    context('when some of the timeOfDays have already passed,', function(){
      let passedTimes = [
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours(), noon.getMinutes()),
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours() - 1, noon.getMinutes())
      ];
      let nonPassedTimes = [
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours(), noon.getMinutes() + 2),
        new KeepMeContributing.Worker.TimeOfDay(noon.getHours(), noon.getMinutes() + 1)
      ];
      let times = passedTimes.concat(nonPassedTimes);

      beforeEach(function(){
        this.result = describedFunction(times);
      });

      it('contains passed times in dones by ascending order.', function(){
        expect(this.result.dones).to.eql([passedTimes[1], passedTimes[0]]);
      });

      it('contains non passed times in notYets by ascending order.', function(){
        expect(this.result.notYets).to.eql([nonPassedTimes[1], nonPassedTimes[0]]);
      });
    });
  });

  describe('#run', function(){
  });

});
