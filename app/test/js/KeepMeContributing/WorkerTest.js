Notification.requestPermission(function(status){
  console.log('Permission: ', status);
});

describe('/js/worker.js', function(){
  it('passes all tests', function(done){
    navigator.serviceWorker.register('/js/worker.js').then(
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
