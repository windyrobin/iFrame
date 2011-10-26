###IFrame

A simple framework based on some real-project demands, it's very fast/elegant.

It contains some components:

####Cluster 
   
  the cluster writen by me ,please see : https://github.com/windyrobin/iCluster

####Controller

  A controller template which is very elegant and similiar to Rails,
  for example ,if you want to implement an add caculation :

```
  http://.../cal/add?lnum=1&rnum=3
```

and you could write code like that :
  
  ```
  require("../lib/env");
   
  function cal(){
  }
  
  exports.ctor = cal;
  
  App.declare(cal);
  
  cal.actions = {
    index : true,
    add   : true
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
  ```
  
  and it will return "4" to the client,
  
  for more details ,please see the files in `controller` directory.
  
####Router & Dispatcher

  the Router is very simple ,now only `/:controller/:action` mode supported ,you
  could rewrite it freely depend on your own
  
####Static File server

  static file service is supported


####Multi-process logging system

  It supports MAX log file size and it will rotate the log file automatically.
  only the master opereates the log file directly ,the worker process just sends log content to
  master via `process.send()`
  
