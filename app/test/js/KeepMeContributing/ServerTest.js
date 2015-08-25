'use strict';

goog.require('goog.net.XhrIo');
goog.require('goog.Promise');

describe('The API server', function(){
  this.timeout(5000);

  describe('/users/:username/contributions.json', function(){
    it('returns a JSON with 200 OK', function(done){
      goog.net.XhrIo.send(
        '/users/igrep/contributions.json',
        function(event){
          let xhr = event.target;
          let responseJson = xhr.getResponseJson();
          expect(responseJson).to.be.an('object');
          expect(responseJson).not.to.be.empty();

          expect(xhr.getStatus()).to.be(200);

          done();
        },
        'GET'
      );
    });
  });
});
