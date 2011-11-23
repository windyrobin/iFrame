###General JS

###V8 JS

###Node 

* Event 

    Node 有两种Event: hard/soft,  hard event 是指文件、网络可读写这些物理上的event, 其他的用  
    户设置的事件都是 soft event ，    当你通过   ```obj.on("eid" , function(){})```  来添加事件时，  
    此 obj 内部会维护一个对应此 “eid” 的事件队列，所以，当你多次调用此函数时，会把相同的  
    处理函数设置多次。（Node 为了避免这种情况，设置了一个上限提示出错，用来避免内存泄  
    露）,当程序调用 ```obj.emit("eid" , data)```  ,不要被假象所迷惑，这会立即调用设置的回调  
    函数，它根本不是异步的
    

* Buffer 

    避免不必要的拷贝以及与 ```string ``` 的相互转换  
    比如你可能这样写:
    
    ```
    var trucks = []
    stream.on("data", function(truck){
      trucks.push(truck);
    });

    stream.on("end", function(){
      var buf = new Buffer(...);
      for(var i=0; i<trucks.length; i++){
        trucks[i].copy(buf, ....)
      }
    });
    ```
    
    但其实很多时候，仅仅只有一个truck ，完全可以避免多余的copy操作，  
    我们可以参看 Node 的源码实现：
    
    ```
    readStream.on('end', function() {
         // copy all the buffers into one
         var buffer;
         switch (buffers.length) {
           case 0: buffer = new Buffer(0); break;
           case 1: buffer = buffers[0]; break;
           default: // concat together
             buffer = new Buffer(nread);
             var n = 0;
           buffers.forEach(function(b) {
              var l = b.length;
              b.copy(buffer, n, 0, l);
              n += l;
            });
            break;
          }
          ...
    ```
    
* Http Agent 

    从 Node V0.5.3 开始，Node 提供了这种方式来支持 keep-alive/连接池
    但注意它的文档说明
    
    >If no pending HTTP requests are waiting on a socket to become free the socket is closed. 
    

    即它没有我们传统意义上的keep-avlie time的设置，比如当你在一个请求返回之后再申请下一个，   
    这时这个连接池是没有启用的.
    
    ```  
      var count = 10;
      var agent = new http.Agent({"maxSockets" : 3});
      var options = {
      host: 'localhost',
        port: 3458,
        path: '/',
        method: 'GET',
        agent : agent,
        headers : {"Connection" : "keep-alive"}
      };
      function looptest(){
       var req = http.request(options, function(res){
          res.on("end", function(){
              console.log("count : " + count);
              if(--count <= 0){ 
      
               }else{
                  process.nextTick(function(){
                  looptest();
                }); 
              }   
          }); 
      }); 
       req.end();
      }
      
      looptest();
    ```
    
    
    