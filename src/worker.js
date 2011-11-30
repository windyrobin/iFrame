require('./lib/env');
var dispatch = require('./lib/dispatch').fn;

var GRACE_EXIT_TIME = 1500;

var server = null;
var exitTimer = null;
var childReqCount = 0;

function aboutExit(){
  if(exitTimer) return;

  server.close();
  exitTimer = setTimeout(function(){
    output('worker will exit...');
    output('child req total : ' + childReqCount);
    log.info('child req total : ' + childReqCount);

    //log.destroy should the lste action
    log.destroy();
    process.exit(0);
  },GRACE_EXIT_TIME);
}


void main(function(){
  process.on('SIGINT'  ,aboutExit)
  process.on('SIGTERM' ,aboutExit)

  //worker log mode
  global.log = require('./lib/log');
  log.init('WORKER');

  server = http.createServer(function(req, res){
    dispatch(req, res);
    /*
    res.writeHead(200 ,{'content-type' : "text/html"});
    res.end('hello,world');
    */
    childReqCount++;
  });

  process.on('message',function(m ,handle){
    if(handle){
      server.listen(handle, function(err){
        if(err){
          output('worker listen error');
        }else{
          process.send({'listenOK' : true});
          output('worker listen ok');
        }  
      });     
    }
    if(m.status == 'update'){
      util.inspect(process.memoryUsage());
      process.send({'status' : process.memoryUsage()});
    }
  });

  output('worker is running...');
});
