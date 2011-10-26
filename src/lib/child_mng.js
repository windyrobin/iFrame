require("./env");

var childs = [];
var childStatus = [];

exports.push =  function(c){
  childs.push(c);
  c.on("message", msg_ctrl_factory(childs.length - 1));
}

exports.getStatus = function(){
  return childStatus;
}

exports.kill = function(pos){
  pos = pos || -1;
  pos = parseInt(pos);
  if(pos < 0){
    childs.forEach(function(c){
      process.kill(c.pid);
    }); 
  }else if(pos > 0 &&  pos < childs.length){
    process.kill(childs[pos].pid);
  }
}

exports.updateStatus = function(){
  childs.forEach(function(c){
    c.send({status : "update"});
  })
}

function simple_hash(str){
  var sum = 0;
  for(var i=0; i<str.length ;i++){
    sum += str.charCodeAt(i);
  }
  return sum;
}

//distinct which child sent the message ,closure the position
function msg_ctrl_factory(pos){
  return function(m){
    //debug("get child log info :");
    //debug(m);
    //if the message if log info,just write to log file
    if(m.log){
      log.write(m.log);
    }
    if(m.status){
      log.info("get child status");
      childStatus[pos] = m.status;
    }
  }
}
