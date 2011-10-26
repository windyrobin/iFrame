global.os = require("os");
global.fs = require("fs");
global.net = require("net");
global.http = require("http");
global.util = require("util");
global.App = require("./app_ctrl");

global.mode = "DEBUG";
//global.mode = "DEBUG";

global.debug = function(str){
  if(mode == "DEBUG")
    console.log(str);
}

global.output = function(str){
  console.log(str);
}

global.inspect = function(obj){
  if(mode == "DEBUG")
    debug(util.inspect(obj));
}

global.main = function(fn){
  fn();
}

global.isEmpty = function(obj){ 
  for(var i in obj){ 
    return false; 
  } 
  return true;
}

//shallow extend
global.extend = function(des, src){
  for(var key in src){
    if(src.hasOwnProperty(key))
      des[key] = src[key];
  }
}

//shallow clone
global.clone = function(obj){
  var ret = {};
  for(var key in obj){
    if(obj.hasOwnProperty(key))
      ret[key] = obj[key];
  }
  return ret;
}

// the member function to be used as callback
// and set 'this' as the context
global.memcb = function(context, mem){
  return function(){
    context[mem].apply(context, arguments);
  }
}

/*this function will throw an exception ,
**so it will end the request ,I use this way to 
substitute the combination of :
** #1 send_error
** #2 return
*/
global.reply_error = function(req, res, code ,info){
  var  map = {
    404 : "Not Found",
    400 : "Bad Request",
    500 : "Internal Server Error"
  }
  var err_str = map[code] || "error occurred";
  var body = info || err_str; 
  res.writeHead(code , {"Content-Type" : "text/plain"});
  res.end(body.toString());
  //throw (new NullExcp());
}

//we throw this type of exception to
//stop the process
global.SExcp = function(err){
 this.err = err; 
}

//empty exception,just for jump out of process
//maybe throwed by controllers
global.NullExcp = function(){
  this.type = "null";
}

//default we send http 500 error
/*
process.on('uncaughtException', function(obj) {
  if(obj instanceof NullExcp){
    //log.error(obj.info);
  }else if(obj instanceof SExcp){
    log.error(obj.err);
    process.exit(-1);
  }else{
    log.error(obj.toString());
  }
  delete obj;
});
*/
//test the file's accessibility
global.access = function(filepath){
  var ok = true;
  try{
    fs.readFileSync(filepath);
  }catch(e){
    ok =false;
  }
  return ok;
}

//would be reset when require log.js
global.log =  { 
  error : function(str){
    console.log("[Error]\t" + str + "\t"+ new Date());
  },
  warning : function(str){  
    console.log("[Warning]\t" + str + "\t" + new Date());
  },
  info : function(str){
    console.log("[Info]\t" + str + "\t"  + new Date());
  }
};

