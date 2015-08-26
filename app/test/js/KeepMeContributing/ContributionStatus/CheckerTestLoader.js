'use strict';

context('Loading ContributionStatus.CheckerTest', function(){
  it('passes all tests', function(done){
    navigator.serviceWorker.register('/test/js/KeepMeContributing/ContributionStatus/CheckerTest.js').then(
      function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        done();
      },
      function(e) {
        expect().fail(`ServiceWorker registration failed: ${e}`);
        done();
      }
    );
  });
});
