'use strict';

describe('TimeOfDay', function(){
  let describedClass = KeepMeContributing.Worker.TimeOfDay;

  describe('#millisecsAfter', function(){
    it('returns same value with <date> - <same date with different time>', function(){
      let date1 = new Date(2015, 9, 7, 14, 56);
      let date2 = new Date(2015, 9, 7, 12, 34);
      let result = new describedClass(date1.getHours(), date1.getMinutes()).millisecsAfter(date2);
      expect(result).to.be(date1 - date2);
    });
  });

  describe('#toMillisecs', function(){
    it('returns an integer representing total milliseconds since the beginning of the day.', function(){
      let hour   = 2;
      let minute = 3;

      let hourInMillisecs   = hour * 60 * 60 * 1000;
      let minuteInMillisecs =    minute * 60 * 1000;
      let millisecs = hourInMillisecs + minuteInMillisecs;

      expect((new describedClass(hour, minute)).toMillisecs()).to.be(millisecs);
    });
  });

  describe('#toHHMM', function(){
    let describedFunction = (hour, minute) =>
      new describedClass(hour, minute).toHHMM();

    it('converts into HH:MM formatted string', function(){
      expect(describedFunction(12, 34)).to.be('12:34');
    });

    it('converts into HH:MM formatted string with zero padding', function(){
      expect(describedFunction(2, 4)).to.be('02:04');
    });

  });

  describe('#toCordovaPluginsNotificationArgument', function(){
    let now = new Date();
    now.setHours(17);
    now.setMinutes(0);
    now.setSeconds(0, 0);

    beforeEach(function (){ this.clock = sinon.useFakeTimers(now.getTime()); });
    afterEach(function (){ this.clock.restore(); });

    let describedFunction = (hour, minute) =>
      new describedClass(hour, minute).toCordovaPluginsNotificationArgument();

    describe('its id property', function(){
      it('same time has same id', function(){
        let resultA = describedFunction(now.getHours(), now.getMinutes());
        let resultB = describedFunction(now.getHours(), now.getMinutes());
        expect(resultA.id).to.be(resultB.id);
      });

      it('different time has different id', function(){
        let resultA = describedFunction(now.getHours(), now.getMinutes());
        let resultB = describedFunction(now.getHours(), now.getMinutes() + 1);
        expect(resultA.id).not.to.be(resultB.id);
      });
    });

    describe('its at property', function(){
      it("is at the current day's same time when given non passed time.", function(){
        let expectedMinutes = now.getMinutes() + 1;
        let nonPassedTimeResult = describedFunction(now.getHours(), expectedMinutes);

        let expectedDate = new Date(now.getTime());
        expectedDate.setMinutes(expectedMinutes);

        expect(nonPassedTimeResult.at).to.eql(expectedDate);
      });

      it("is at the next day's same time when given already passed time.", function(){
        let expectedMinutes1 = now.getMinutes() - 1;
        let passedTimeResult1   = describedFunction(now.getHours(), expectedMinutes1);
        let passedTimeResult2   = describedFunction(now.getHours(), now.getMinutes());

        let expectedDate1 = new Date(now.getTime());
        expectedDate1.setDate(now.getDate() + 1);
        expectedDate1.setMinutes(expectedMinutes1);

        let expectedDate2 = new Date(now.getTime());
        expectedDate2.setDate(now.getDate() + 1);

        expect(passedTimeResult1.at).to.eql(expectedDate1);
        expect(passedTimeResult2.at).to.eql(expectedDate2);
      });
    });

  });

  describe('.fromHHMM', function(){
    let describedFunction = (string) => describedClass.fromHHMM(string);

    it('converts HH:MM formatted string into a described instance', function(){
      let result = describedFunction('23:59');
      expect(result.hour).to.be(23);
      expect(result.minute).to.be(59);
    });

    it('converts HH:MM formatted string that can be interpreted as a hex into a described instance with 0', function(){
      let result = describedFunction('0x13:0x45');
      expect(result.hour).to.be(0);
      expect(result.minute).to.be(0);
    });

    it('converts HH:MM formatted string containing zero into a described instance', function(){
      let result = describedFunction('09:00');
      expect(result.hour).to.be(9);
      expect(result.minute).to.be(0);
    });

    it('converts HH:MM formatted string containing hour with hyphen into null', function(){
      let result = describedFunction('-9:01');
      expect(result).to.be(null);
    });

    it('converts HH:MM formatted string containing minute with hyphen into null', function(){
      let result = describedFunction('09:-1');
      expect(result).to.be(null);
    });

    it('converts HH:MM formatted string containing too large hour into null', function(){
      let result = describedFunction('24:59');
      expect(result).to.be(null);
    });

    it('converts an empty hour into null', function(){
      let result = describedFunction(':09');
      expect(result).to.be(null);
    });

    it('converts an empty minute into null', function(){
      let result = describedFunction('09:');
      expect(result).to.be(null);
    });

  });

});
