require('./env');

exports.fn = route;

/*give a url ,and it will return meta object which 
**indict the controller ,the sub method ,and also the 
*parsed query string map ,and the request path 
*/
function route(url){
  var meta = {
    ctrl       : 'index',
    action     : 'index',
    query      : null,
    path       : ''
  };

  var purl = require('url').parse(url, true);
  var arr = purl.pathname.split('/');
  //the pathname always startd with '/' ,for example '/index/helo'  
  //so arr[0] is always ''
  //console.log(util.inspect(arr));

  if(arr[1] && arr[1] != '')
    meta.ctrl = arr[1];
  if(arr[2] && arr[2] != '')
    meta.action = arr[2];

  //parsed usr object ,avoid parsing it again
  meta.query = purl.query;
  meta.path  =  purl.pathname;
  return meta;
}

/*
function debug(obj){
  console.log(util.inspect(obj));
}
debug(route('/hello?id=3'));
debug(route('/'));
debug(route('/hello/world?id=3'));
*/
