require("./env");

const LOG_DIR = __dirname + "/../../log/"

const LOG_FILE = LOG_DIR + "iframe.log";
const LOG_FILE_OLD = LOG_DIR + "iframe.log.old";
const MAX_SIZE = 50*1024*1024;//50M
const CHECK_INTERVAL = 2*3600*1000;//2h

var logStream = null;
var checkEvent = null;

//default mode,when you don't call log.init 
var logWrite = function(str){
  console.log(str);
}

exports.init = function(mode){  
  if(mode){//worker mode
    logWrite =  function(str){
      process.send({"log" : str});
    };
  }else{
    logStream = fs.createWriteStream(LOG_FILE, {flags : "a"});
    logWrite = function(str){
      logStream.write(str + "\n");
    };
    checkEvent = setInterval(function(){
      fs.stat(LOG_FILE, function(err, stats){
        if(err || stats.size >= MAX_SIZE){
          exports.destroy();
          try{
            fs.unlinkSync(LOG_FILE_OLD);  
            debug("delete old log");
          }catch(e){
          }
          fs.renameSync(LOG_FILE ,LOG_FILE_OLD);
          debug("rename ok");
          exports.init();
        }
      });
    }, CHECK_INTERVAL);
    debug("master log init ok");
  } 
},

exports.destroy = function(){
  if(checkEvent != null){
    clearInterval(checkEvent);
    checkEvent =  null;
  }
  if(logStream){
    logStream.end();
    logStream.destroySoon();
  }
}

exports.write = function(str){
  logWrite(str);
}
exports.error = function(str){
  logWrite("[Error]\t" + str + "\t"+ new Date());
},

exports.warning = function(str){
  logWrite("[Warning]\t" + str + "\t" + new Date());
}

exports.info = function(str){
  logWrite("[Info]\t" + str + "\t"  + new Date());
}

