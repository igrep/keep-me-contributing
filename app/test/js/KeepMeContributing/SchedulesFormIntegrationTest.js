'use strict';

/**
 * @fileoverview
 * Integration tests of the components used to accept, save, and tell
 * the schedule of worker input by the user.
 */

goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Button');
goog.require('goog.dom');

describe('The form to input schedules', function(){
  let root = goog.dom.getElement('SchedulesFormIntegrationTest');
  let domHelper = new goog.dom.DomHelper();

  beforeEach(function(){
    let kmc = KeepMeContributing;

    let controller = new kmc.SchedulesController();

    this.store = new kmc.SchedulesStore('KeepMeContributing::SchedulesFormIntegrationTest', controller);
    this.notificationStatusStore =
      new kmc.NotificationStatusStore('KeepMeContributing::SchedulesFormIntegrationTest', controller);

    this.worker = new Worker('/test/js/KeepMeContributing/Worker/dummy.js');
    this.postMessageSpy = sinon.spy(this.worker, 'postMessage');
    this.terminateSpy   = sinon.spy(this.worker, 'terminate');
    this.workerHandler = new kmc.WorkerHandler(this.worker, controller);

    this.view = new kmc.SchedulesView(
      controller, this.store, this.notificationStatusStore, {
        toggle: new goog.ui.Checkbox(),
        update: new goog.ui.Button(),
        stop: new goog.ui.Button(),
        add: new goog.ui.Button()
      }
    );

    this.view.toggleCheckbox.decorate(domHelper.getElementByClass('toggleCheckbox', root));
    this.view.updateButton.decorate(domHelper.getElementByClass('updateButton', root));
    this.view.stopButton.decorate(domHelper.getElementByClass('stopButton', root));
    this.view.addButton.decorate(domHelper.getElementByClass('addButton', root));
  });
  afterEach(function(){
    this.workerHandler.stop();
    this.notificationStatusStore.clear();
    this.store.clear();
    this.view.dispose();
  });

  // common methods using the view.
  before(function(){
    this.render = () => {
      this.view.render(domHelper.getElementByClass('schedulesView', root));
    };

    this.collectInputs = () =>
      this.view.getContentElement().querySelectorAll("input[type='text']");
  });

  context('without any saved information', function(){
    beforeEach(function(){
      this.render();
    });

    it('has one empty enabled input element', function(){
      let inputs = this.collectInputs();
      expect(inputs.length).to.be(1);
      expect(inputs[0].value).to.be.empty();
      expect(inputs[0].disabled).to.be(false);
    });

    it('has the toggle checkbox checked', function(){
      expect(this.view.toggleCheckbox.getChecked()).to.be(true);
    });

    context('by clicking the add button', function(){
      beforeEach(function(){
        this.view.addButton.getElement().click();
      });
      it('has one another empty input element', function(){
        let inputs = this.collectInputs();
        expect(inputs.length).to.be(2);
        expect(inputs[0].value).to.be.empty();
        expect(inputs[1].value).to.be.empty();
      });

      context('then typing some time to run, and click update button', function(){
        before(function(){
          this.typeAndUpdate = (inputValues) => {
            let inputs = this.collectInputs();
            goog.array.forEach(inputValues, (inputValue, index) => {
              inputs[index].value = inputValue;
            });
            this.view.updateButton.getElement().click();
          };
        });

        context('if all of the times are valid', function(){
          beforeEach(function(){
            this.typeAndUpdate(['12:34', '03:21']);
            this.expectedTimes = [
              new KeepMeContributing.Worker.TimeOfDay(12, 34),
              new KeepMeContributing.Worker.TimeOfDay( 3, 21)
            ];
          });

          it('the schedules store can reload all the input schedules.', function(){
            let reloadedSchedules = this.store.load();
            expect(reloadedSchedules).to.be.eql(this.expectedTimes);
          });

          it('the worker has received all the input schedules.', function(){
            sinon.assert.calledOnce(this.postMessageSpy);
            sinon.assert.calledWith(this.postMessageSpy, sinon.match(this.expectedTimes));
          });
        });

        context('if one of the times is invalid', function(){
          beforeEach(function(){
            this.typeAndUpdate(['12:', '03:21']);
          });

          it('the schedules store can reload nothing.', function(){
            expect(this.store.load()).to.be.empty();
          });

          it('the worker has never called.', function(){
            sinon.assert.notCalled(this.postMessageSpy);
          });
        });

        context('if one of the times is empty', function(){
          beforeEach(function(){
            this.typeAndUpdate(['12:34', '']);
            this.expectedTimes = [new KeepMeContributing.Worker.TimeOfDay(12, 34)];
          });

          it('the schedules store can reload all the non-empty input schedules.', function(){
            let reloadedSchedules = this.store.load();
            expect(reloadedSchedules).to.be.eql(this.expectedTimes);
          });

          it('the worker has received all the non-empty input schedules.', function(){
            sinon.assert.calledOnce(this.postMessageSpy);
            sinon.assert.calledWith(this.postMessageSpy, sinon.match(this.expectedTimes));
          });
        });

      });
    });

    context('by clicking the stop button', function(){
      beforeEach(function(){
        this.view.stopButton.getElement().click();
      });
      it('terminates the worker', function(){
        sinon.assert.calledOnce(this.terminateSpy);
      });
    });

    context('by clicking the toggle checkbox to uncheck', function(){
      beforeEach(function(){
        this.view.toggleCheckbox.getElement().click();
      });

      it('terminates the worker', function(){
        sinon.assert.calledOnce(this.terminateSpy);
      });

      it('disables the all inputs', function(){
        goog.array.forEach(this.collectInputs(), (input) => {
          expect(input.disabled).to.be(true);
        });
      });

    });

  });

  context('when some times have already been saved', function(){
    beforeEach(function(){
      this.savedTimes = [
        new KeepMeContributing.Worker.TimeOfDay(12, 12),
        new KeepMeContributing.Worker.TimeOfDay(11, 22),
        new KeepMeContributing.Worker.TimeOfDay(22, 33)
      ];
      this.store.save(this.savedTimes);

      this.render();
    });

    it('renders saved times on each input, with an empty input to create new one.', function(){
      let renderedStrings = goog.array.map(this.collectInputs(), (input) => input.value);
      expect(renderedStrings).to.eql(
        goog.array.map(this.savedTimes, (time) => time.toHHMM()).concat([''])
      );
    });

    it('the worker has received all the saved schedules.', function(){
      sinon.assert.calledOnce(this.postMessageSpy);
      sinon.assert.calledWith(this.postMessageSpy, sinon.match(this.savedTimes));
    });

    context('then, clicking the close button', function(){
      beforeEach(function(){
        this.indexToDelete = 1;
        this.view.getChildAt(this.indexToDelete).closeButton.getElement().click();
      });

      it('there is no such schedule rendered.', function(){
        let renderedStrings = goog.array.map(this.collectInputs(), (input) => input.value);

        let withoutClosed = goog.array.map(this.savedTimes, (time) => time.toHHMM());
        withoutClosed.splice(this.indexToDelete, 1);
        withoutClosed.push(''); // contains the initial empty input

        expect(renderedStrings).to.eql(withoutClosed);
      });

      context('and by clicking the update button', function(){
        beforeEach(function(){
          this.view.updateButton.getElement().click();
        });

        it('the schedules store can reload all the input schedules except the closed schedule.', function(){
          let reloadedSchedules = this.store.load();
          this.savedTimes.splice(this.indexToDelete, 1);
          expect(reloadedSchedules).to.be.eql(this.savedTimes);
        });
      });

    });

  });

});
