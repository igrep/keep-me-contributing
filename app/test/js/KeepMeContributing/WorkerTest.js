goog.require('KeepMeContributing.Worker.Scheduler');
goog.require('KeepMeContributing.Worker.TimeOfDay');
goog.require('KeepMeContributing.Worker.Utils');

describe('/js/worker.js', function(){
  context('After registration', function(){
    before(function(done){
      navigator.serviceWorker.register('/js/worker.js').then(
        (registration) => {
          // ensure the worker script is up-to-date.
          registration.update();

          this.worker = KeepMeContributing.Worker.Utils.workerOfRegistration(registration);
          done();
        },
        function(e) {
          expect().fail(`ServiceWorker registration failed: ${e}`);
          done();
        }
      );
    });

    context('by sending time of days', function(){

      before(function(done){
        this.result = null;
        this.worker.addEventListener('message', (event) => {
          result = event.data;
          done();
        });

        new KeepMeContributing.Worker.Scheduler.Updater(
          KeepMeContributing.Worker.Scheduler.Updater.Actions.REFRESH,
          [new KeepMeContributing.Worker.TimeOfDay(15, 30)]
        ).sendTo(this.worker);
      });

      it('receives and replies', function(){
        expect(this.result).to.match(/^Next job after/);
      });

    });

  });

});
