require('../lib/env');

function Index(){}

exports.ctor = Index;

App.declare(Index);

Index.prototype.index = function(req, res){
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end("<center><br /><h2>Welcome</h2><br /><br /><p style='color:red'>a new web framework based on NodeJS</p><p align='right' style='font-size:9pt'>Edward Zhang July 5, 2011</p></center>");
}
