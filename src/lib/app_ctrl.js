require('./env');

//exports.ctor = AppCtrl;
exports.create = ctrlCreate;
exports.declare = ctrlDeclare;

function AppCtrl(req, res){
  this.path  = '';
  this.query = {};
  //if the request method is POST ,we will set it in
  //process function
}

AppCtrl.prototype.run = function(meta, req, res){
  //get the sub-controller(method)
  var action = meta['action'];
  var func = this[action];

  this.path = meta.path;
  this.query = meta.query;
  
  var self = this;
  //maybe we should add file upload support in future
  
  if(req.method == 'POST'){
    self.body = [];
    req.on('data', function(chuck){
      self.body.push(chuck.toString());
    });
  }
  req.on('end',function(){
    if(self.body){
      self.body = self.body.join('');
    }
    try{
      func.call(self, req, res);
    }catch(ex){
      log.error(ex.toString());
      replyError(req, res, 500);
    }
  });
}

AppCtrl.prototype.preFilter = function(){
}

function ctrlCreate(Ctrl){
  var inst = new Ctrl();
  AppCtrl.call(inst);
  return inst;
}

function ctrlDeclare(Ctrl){
  util.inherits(Ctrl, AppCtrl);
}
