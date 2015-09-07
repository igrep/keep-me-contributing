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

  describe('#toHHMM', function(){
    let describedFunction = function(hour, minute){
      return new describedClass(hour, minute).toHHMM();
    };

    it('converts into HH:MM formatted string', function(){
      expect(describedFunction(12, 34)).to.be('12:34');
    });

    it('converts into HH:MM formatted string with zero padding', function(){
      expect(describedFunction(2, 4)).to.be('02:04');
    });

  });

  describe('.fromHHMM', function(){
    let describedFunction = function(string){
      return describedClass.fromHHMM(string);
    };

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
