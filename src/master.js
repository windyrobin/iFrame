//var http = require('http');
require('./lib/env');
var cp = require('child_process');
var childMng = require('./lib/child_mng');

var PORT = 3459;
var WORKER_NUMBER = 5;
var GRACE_EXIT_TIME = 2000;//2s
var WORKER_PATH = __dirname + '/worker.js';
var WORKER_HEART_BEAT = 10*1000;//10s, update memory ,etc

function startWorker(handle){
  output('start workers :' + WORKER_NUMBER);
  for(var i=0; i<WORKER_NUMBER; i++){
    var c  =  cp.fork(WORKER_PATH);
    c.send({'server' : true}, handle);

    childMng.push(c);
  }

  setInterval(function(){
    inspect(childMng.getStatus());
    childMng.updateStatus();
  },WORKER_HEART_BEAT);
}

var exitTimer = null;
function aboutExit(){
  if(exitTimer) return;

  childMng.kill();
  exitTimer = setTimeout(function(){
    output('master exit...');

    log.destroy();
    process.exit(0);
  }, GRACE_EXIT_TIME);
}

function startServer(){
  var tcpServer = net.createServer();
  tcpServer.on('error', function(err){
    output('server error ,check the port...');
    aboutExit();
  })
  tcpServer.listen(PORT , function(){
    startWorker(tcpServer._handle);
    tcpServer.close();
  });
}

void main(function(){
  
  startServer();
  //reset teh log in env.js
  global.log = require('./lib/log');
  log.init();

  output('master is running...');
  process.on('SIGINT'  , aboutExit);
  process.on('SIGTERM' , aboutExit);

});
