require('../lib/env');

function PostTest(){}

exports.ctor = PostTest;

App.declare(PossTest);

PostTest.prototype.index = function(req, res){
  var self = this;
  res.writeHead(200, {'Content-Type' : 'text/plain' ,'connection' : 'keep-alive'});
  res.write(self.body);
  res.end('');
}
