//var http = require("http");
require("./lib/env");
var cp = require("child_process");
var childMng = require("./lib/child_mng");

const PORT = 3458;
const WORKER_NUMBER = 5;
const GRACE_EXIT_TIME = 2000;//2s
const WORKER_PATH = __dirname + "/worker.js";
const WORKER_HEART_BEAT = 10*1000;//10s, update memory ,etc

function startWorker(handle){
  output("start workers :" + WORKER_NUMBER);
  worker_succ_count = 0;
  for(var i=0; i<WORKER_NUMBER; i++){
    var c  =  cp.fork(WORKER_PATH);
    c.send({"server" : true}, handle);

    childMng.push(c);
  }

  setInterval(function(){
    //inspect(childMng.getStatus());
    childMng.updateStatus();
  },WORKER_HEART_BEAT);
}

var exit_timer = null;
function about_exit(){
  if(exit_timer) return;

  childMng.kill();
  exit_timer = setTimeout(function(){
    output("master exit...");

    log.destroy();
    process.exit(0);
  }, GRACE_EXIT_TIME);
}

function startServer(){
  var tcpServer = net.createServer();
  tcpServer.on("error", function(err){
    output("server error ,check the port...");
    about_exit();
  })
  tcpServer.listen(PORT , function(){
    startWorker(tcpServer._handle);
    tcpServer.close();
  });
}

void main(function(){
  
  startServer();
  //reset teh log in env.js
  global.log = require("./lib/log");
  log.init();

  output("master is running...");
  process.on("SIGINT" , about_exit);
  process.on("SIGTERM" , about_exit);

});
