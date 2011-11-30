require('../lib/env');
 
function Cal(){}

exports.ctor = Cal;

App.declare(Cal);

Cal.actions = {
  index : true,
  add   : true,
  sub   : true
};

Cal.prototype.index = function(req, res){
  this.add(req, res);
}

Cal.prototype.add = function(req, res){
  //debug('add method');
  var self = this;
  var params = self.query;
  var lnum = parseInt(params['lnum']);
  var rnum = parseInt(params['rnum']);
  var result = lnum + rnum
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('' + result);
}

Cal.prototype.sub = function(req, res){
  var self = this;
  var params = self.query;
  var lnum = parseInt(params['lnum']);
  var rnum = parseInt(params['rnum']);
  var result = lnum - rnum;
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('' + result);

}
