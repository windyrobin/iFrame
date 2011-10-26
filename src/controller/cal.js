require("../lib/env");
 
function cal(){
}

exports.ctor = cal;

App.declare(cal);

cal.actions = {
  index : true,
  add   : true,
  sub   : true
};

cal.prototype.index = function(req, res){
  this.add(req, res);
}

cal.prototype.add = function(req, res){
  //debug("add method");
  var self = this;
  var params = self.query;
  var lnum = parseInt(params["lnum"]);
  var rnum = parseInt(params["rnum"]);
  var result = lnum + rnum
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("" + result);
}

cal.prototype.sub = function(req, res){
  var self = this;
  var params = self.query;
  var lnum = parseInt(params["lnum"]);
  var rnum = parseInt(params["rnum"]);
  var result = lnum - rnum
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("" + result);

}
