require('./env');

var App = require('./app_ctrl');
var route = require('./route').fn;

exports.fn = dispatch;

var CTRL_DIR = __dirname + '/../controller';
var PUBLIC_DIRECTORY = __dirname + '/../../public';

function loadCtrl(ctrlname){
  var fpath = CTRL_DIR + '/' + ctrlname;
  return require(fpath).ctor;
}

function isCtrlAccessed(ctrlname){
  var fpath = CTRL_DIR + '/' + ctrlname + '.js';
  return access(fpath);
}

function sendfile(req ,res, path ,ext){
  var type = require('./misc').getType(ext);
  var rpath = PUBLIC_DIRECTORY + path;
  log.info('get static file :' + rpath);
  fs.readFile(rpath , function(err, data){
    if(err){
      log.error(err);
      replyError(req, res, 404);
    }else{
      //log.info('writeHead :' + type);
      res.writeHead(200, {'Content-Type' : type});
      res.end(data);
    }
  });
}

function endTest(res){
  res.writeHead(200 ,{'content-type' : "text/html"});
  res.end('hello,world');
}

/*to decide it's a static request of or a bad request,
**if checking is ok ,we will create a dynamic instance
**and run it...
*/
function dispatch(req , res){
  var path = require('url').parse(req.url).pathname;
  var ext = require('path').extname(path);

  if(ext != ''){
    sendfile(req, res ,path, ext);
    return;
  }
  
  //get info like
  //{
  // ctrl : 'str', 
  // action : 'str',
  // query: {} ,
  // path: ''
  //}
  var meta = route(req.url);

  //log.info('req.url : ' + req.url);

  //endTest(res);
  //return;

  //inspect(meta);
  //TODO here we should first check the extname ,to decide
  //whether it's a dynamic request or not 
  
  var ctrl = null;
  try{
    ctrl = loadCtrl(meta['ctrl']);
  }catch(err){
    //two possibility:
    //#1 file syntax error
    //#2 file not accessible
    log.error('ctrl load exception : ' + meta["ctrl"] + err.toString());
    //replyError(req, res ,500);
    if(isCtrlAccessed(meta['ctrl'])){
      replyError(req, res, 500);
    }else{
      replyError(req, res, 404);
    }
    return;
  }

  if(ctrl == null){
    replyError(req, res, 500, 'controller not exported..');
    return;
  }

  //endTest(res);
  //return;

  var key = meta['action'];
  var map = ctrl.actions;
  //action not supported in the controller
  if((key != 'index' && (!map || !map[key])) ||//the action not exsited...
     (key == 'index' && map && !map["index"])//actions is set ,but index is prohibited
    ){
    log.error('action not found : ' + key);
    replyError(req, res, 404);
    return;
  }
  //endTest(res);
  //return;

  //if run here ,means everything is ok
  //create an instance to process it
  try{
    var inst = App.create(ctrl);
    //endTest(res);
    //return;
    inst.run(meta, req, res);
  }catch(err){
    replyError(req, res, 500, err);
  }
}

