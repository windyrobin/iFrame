# Node 陷阱与优化

## General JS

* 遍历效率比较

    - forEach 很慢
    - for(var in in obj) 较慢
    - for(var i = 0; i < len; i++) 最快
    - Array 的遍历比 Object 要快的多
    
* 避免重复计算
    
    Wrong: 

    ```
    for(var i = 0; i < arr.length; i++) {
      // ...    
    }
    ```

    在arr 长度较大时，应该引入临时量
    
    Right:

    ```
    var len = arr.length;
    for(var i = 0; i < len; i++) {
      // ...
    }
    
    // or
    
    for(var i = 0, l = arr.length; i < l; i++) {
      // ...
    }
    ```
    
* 使用临时变量，避免对象的多次查找
    
    Wrong:
    
    ```
    var a = {
      b: {
        c: 'd'
      }
    };
    for(;;) {
      if (a.b.c) {
        // ...
      }
      // ...
    }
    ```
    
    Right:

    ```
    var o = a.b.c;
    for(;;) {
      if (o) {
        // ...
      }
      // ...
    }
    ```
  
## V8 JS

* 使用 V8 支持的功能列表 [V8-ECMA](https://github.com/joyent/node/wiki/ECMA-5-Mozilla-Features-Implemented-in-V8)
    如 : 
    - ```Array.isArray```
    - ```Array.indexOf```
    - ```Object.keys```
    - ```String.trim/trimLeft/trimRight```
    - ...

* 理解V8 对 ```Object``` 属性查找机制的改进，在构造函数中预先初始化所有属性

* Try/Catch  位置
    对较为复杂的函数运算，你应该在调用它时```try/catch``` ,这样效率更高 [V8_Catch](https://github.com/joyent/node/wiki/Best-practices-and-gotchas-with-v8)
    
    Wrong:
    
    ```
    function tfn() {
      try{
        @#dsC23
        @##sd
        @#$d
      } catch(e) {
        // ...
      }
    }
    ```

    Right:
    
    ```
    try {
      tfn();
    } catch(e) {
      // ...
    }
    ```
    
* 使用 WebGL 类型扩展: ```Int8Array```, ```Int16Array```, ```Float32Array``` ...

  这些类型的数值运算、二进制运算非常快 （参见Node 自带的```benchamrk/array```）;
  
## Node JS

* Event 

  Node 有两种Event: hard/soft,  hard event 是指文件、网络可读写这些物理上的event, 
  其他的用户设置的事件都是 soft event。

  当你通过 ```obj.on('eid', function(){})``` 来添加事件时，
  此 obj 内部会维护一个对应此 ```'eid'``` 的事件队列，所以，当你多次调用此函数时，会把相同的处理函数设置多次。
  （Node 为了避免这种情况，设置了一个上限提示出错，用来避免内存泄露）

  当程序调用 ```obj.emit('eid', data)``` ，不要被假象所迷惑，这会立即调用设置的回调函数，它根本不是异步的。
    
* Timer
    
    * 使用 ```process.nextTick``` 替代 ```setTimeout(fun, 0)```
    * 可以的话，尽量 ```setTimeout(fun, timeout)``` 设置相同的超时值，timeout 值相同，node 会使用同一个定时器处理

    ```
    // come from `node/lib/timers.js`

    // IDLE TIMEOUTS
    //
    // Because often many sockets will have the same idle timeout we will not
    // use one timeout watcher per item. It is too much overhead.  Instead
    // we'll use a single watcher for all sockets with the same timeout value
    // and a linked list. This technique is described in the libev manual:
    // http://pod.tst.eu/http://cvs.schmorp.de/libev/ev.pod#Be_smart_about_timeouts
    ```
    
* Buffer 

    避免不必要的拷贝以及与 ```string``` 的相互转换  
    比如你可能这样写:
    
    Wrong:

    ```
    var chunks = [], nread = 0;
    stream.on('data', function(chunk) {
      chunks.push(chunk);
      nread += chunk.length;
    });

    stream.on('end', function() {
      var buf = new Buffer(nread);
      for(var i = 0, l = chunks.length; i < l; i++) {
        chunks[i].copy(buf, ....);
      }
    });
    ```
    
    但其实**很多时候**，仅仅**只有一个chunk**，完全可以避免多余的copy操作，  
    我们可以参看 Node 的源码实现：
    
    Right:

    ```
    readStream.on('end', function() {
      // copy all the buffers into one
      var buf;
      switch (buffers.length) {
        case 0: buf = new Buffer(0); break;
        case 1: buf = buffers[0]; break;
        default: // concat together
          buffer = new Buffer(nread);
          for(var i = 0, p = 0, l = buffers.length; i < l; i++) {
            var b = buffers[i];
            var size = b.length;
            b.copy(buf, p, 0 size);
            p += size;
          }
          break;
        }
        // ... use buf ...
    ```
    
* File System

  * 在读取文件时，可以的话，尽量传入适当的```bufferSize```
  * 谨慎使用**同步**操作函数组 - 除非你清楚知道这样带来的后果
    
* Stream

  * ```Stream```类的抽象是 Node 的亮点之一，也是一个非常重要的基础类，你应该深刻的了解它
  * 不要持久引用 ```stream('on', data)``` 上浮的 ```Buffer```
    
* Net/Http Request

  你应当给 ```request``` 加上超时控制

* Http Agent 

  从 Node V0.5.3 开始，Node 提供了这种方式来支持 keep-alive/连接池
  但注意它的文档说明
    
>If no pending HTTP requests are waiting on a socket to become free the socket is closed. 
    
    即它没有我们传统意义上的keep-avlie time的设置，比如当你在一个请求返回之后再申请下一个，   
    这时这个连接池是没有启用的.
    
    ```  
    var count = 10;
    var agent = new http.Agent({ "maxSockets": 3 });
    var options = {
      host: 'localhost',
      port: 3458,
      path: '/',
      method: 'GET',
      agent: agent,
      headers: { "Connection" : "keep-alive" }
    };
    function looptest() {
      var req = http.request(options, function(res) {
        res.on("end", function() {
          console.log("count : " + count);
          if(--count <= 0) { 
    
          } else {
            process.nextTick(function() {
              looptest();
            }); 
          }   
        }); 
      }); 
      req.end();
    }
      
    looptest();
    ```
    
* Http Response

  * 不要多次调用 ```res.write``` ,这会极大的影响性能，最好仅调用一次```res.end(buf/string)``` 方法
  * 尽量在 ```res.writeHead``` 时设置 ```Content-Length```
    