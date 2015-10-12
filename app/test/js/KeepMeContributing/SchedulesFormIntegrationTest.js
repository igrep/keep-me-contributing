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

    this.store = new kmc.SchedulesStore(
      'KeepMeContributing::SchedulesFormIntegrationTest::SchedulesStore', controller
    );
    this.notificationStatusStore = new kmc.NotificationStatusStore(
      'KeepMeContributing::SchedulesFormIntegrationTest::NotificationStatusStore', controller
    );

    this.worker = new Worker('/test/js/KeepMeContributing/Worker/dummy.js');
    this.postMessageSpy = sinon.spy(this.worker, 'postMessage');
    this.terminateSpy   = sinon.spy(this.worker, 'terminate');
    this.workerHandler = new kmc.WorkerHandler(this.worker, controller);

    this.view = new kmc.SchedulesView(
      controller, this.store, this.notificationStatusStore, {
        add: new goog.ui.Button()
      }
    );
    this.notificationStatusViewModel = new kmc.NotificationStatusViewModel(this.notificationStatusStore);
  });
  afterEach(function(){
    this.workerHandler.stop();
    this.notificationStatusStore.clear();
    this.store.clear();
    this.view.dispose();
    this.notificationStatusViewModel.dispose();
  });

  // common methods using the view.
  before(function(){
    this.render = () => {
      this.notificationStatusViewModel.decorate(domHelper.getElementByClass('toggleCheckbox', root));
      this.view.addButton.decorate(domHelper.getElementByClass('addButton', root));
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
      expect(this.notificationStatusViewModel.getChecked()).to.be(true);
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

      context('then setting some time to run', function(){
        before(function(){
          this.typeAndUpdate = (inputValues) => {
            this.view.forEachChild((child, index) => {
              child.setValue(inputValues[index]);
            });
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

    context('by clicking the toggle checkbox to uncheck', function(){
      beforeEach(function(){
        this.notificationStatusViewModel.getElement().click();
      });

      it('terminates the worker', function(){
        sinon.assert.calledOnce(this.terminateSpy);
      });

      it('disables the all inputs', function(){
        goog.array.forEach(this.collectInputs(), (input) => {
          expect(input.disabled).to.be(true);
        });
      });

      it('disables the add button', function(){
        expect(this.view.addButton.getElement().disabled).to.be(true);
      });

      it('saves info that notification is disabled', function(){
        expect(this.notificationStatusStore.isEnabled()).to.be(false);
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
    });

    let itRendersSavedTimes = () => {
      it('renders saved times on each input, with an empty input to create new one.', function(){
        let renderedStrings = goog.array.map(this.collectInputs(), (input) => input.value);
        expect(renderedStrings).to.eql(
          goog.array.map(this.savedTimes, (time) => time.toHHMM()).concat([''])
        );
      });
    };

    let itPassesSavedTimes = () => {
      it('the worker has received all the saved schedules.', function(){
        sinon.assert.calledOnce(this.postMessageSpy);
        sinon.assert.calledWith(this.postMessageSpy, sinon.match(this.savedTimes));
      });
    };

    let itDeletesTheScheduleInputByCloseButton = () => {
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

        it('the schedules store can reload all the input schedules except the closed schedule.', function(){
          let reloadedSchedules = this.store.load();
          this.savedTimes.splice(this.indexToDelete, 1);
          expect(reloadedSchedules).to.be.eql(this.savedTimes);
        });

      });
    };

    context('without notification status saved', function(){
      beforeEach(function(){
        this.render();
      });

      itRendersSavedTimes();
      itPassesSavedTimes();
      itDeletesTheScheduleInputByCloseButton();
    });

    context('with notification status saved as "enabled"', function(){
      beforeEach(function(){
        this.notificationStatusStore.save(true);
        this.render();
      });

      itRendersSavedTimes();
      itPassesSavedTimes();
      itDeletesTheScheduleInputByCloseButton();
    });

    context('with notification status saved as "disabled"', function(){
      beforeEach(function(){
        this.notificationStatusStore.save(false);
        this.render();
      });

      itRendersSavedTimes();

      it('the worker has never called.', function(){
        sinon.assert.notCalled(this.postMessageSpy);
      });

      it('disables the all input elements', function(){
        goog.array.forEach(this.collectInputs(), (input) => {
          expect(input.disabled).to.be(true);
        });
      });

      context('even by clicking the close button of an input', function(){
        beforeEach(function(){
          this.originalInputsCount = this.collectInputs().length;
          this.view.getChildAt(0).closeButton.getElement().click();
        });

        it('does not delete any schedule input', function(){
          expect(this.collectInputs().length).to.be(this.originalInputsCount);
        });

      });

      context('even by clicking the add button', function(){
        beforeEach(function(){
          this.originalInputsCount = this.collectInputs().length;
          this.view.addButton.getElement().click();
        });

        it('does not add a new schedule input', function(){
          expect(this.collectInputs().length).to.be(this.originalInputsCount);
        });

      });

      context('by clicking the toggle checkbox to check', function(){
        beforeEach(function(){
          this.notificationStatusViewModel.getElement().click();
        });

        itPassesSavedTimes();
      });
    });


  });

});
