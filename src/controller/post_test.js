require("../lib/env");

function post_test(){}
exports.ctor = post_test;
App.declare(post_test);


post_test.prototype.index = function(req, res){
  var self = this;
  res.writeHead(200, {"Content-Type" : "text/plain" ,"connection" : "keep-alive"});
  res.write(self.body);
  res.end("");
}
