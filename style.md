# Javascript 编码规范

* 缩进 ，2 个 space，tab要转换成2 space. [Eclipse的Javascript tab和缩进自动转换设置方法](http://ww3.sinaimg.cn/large/6cfc7910jw1dnf44jzellj.jpg)

* 永远用 var 声明变量，不加 var 时，会污染顶层上下文

* 操作符与操作算子之间要有空格

    Right：

    ```
      var string = 'Foo' + bar;
    ```
    Wrong:
  
    ```
      var string = 'Foo'+bar;
    ```



* 使用string 时，用单引号替代双引号（写JSON 时除外）
  
    Right：

    ```
    var foo = 'bar';
    ```
    
    Wrong：
    
    ```
    var foo = "bar";
    ```
    

*  大括号位置
  
    Right：

    ```
    if (true) {
      console.log('winning');
    }
    ```
    
    Wrong：
    
    ```
    if (true)
    {
      console.log('losing');
    }
    ```
    

* Camel 命名法

    采用以下规则：
    * 函数和变量：functionNamesLikeThis, variableNamesLikeThis, 
    * 类名和枚举类型：ClassNamesLikeThis, EnumNamesLikeThis, 
    * 类方法：methodNamesLikeThis 
    * 常量：SYMBOLIC_CONSTANTS_LIKE_THIS

    Right ：
  
    ```
    // var definition
    var adminUser = db.query('SELECT * FROM users ...');

    // function definition
    function run(){
    }

    // Class definition
    function BankAccount() {
    }
    ```

    Wrong：

    ```
    var admin_user = db.query('SELECT * FROM users ...");
    
    function bankAccount() {
    }
    ```
    

* 不使用 ```const``` 关键字
  虽然V8 和 Mozilla 都支持它，但它不是ECMA 标准，我们用以下方式定义常量：
    
    Right：
 
    ```
    var SECOND = 1 * 1000;
    function File() {
    }
    File.FULL_PERMISSIONS = 0777;
    ```

* 比较操作 有的场景下应该用 "===" 替代 "=="
  当你遇到这些符号比较时 ：``` 0 undefined null false true ```
  
    你应该小心谨慎
    比如　``` ' \t\r\n' == 0 ```　比较结果是true

    Right：

    ```
    var a = 0;
    if (a === '') {
      console.log('winning');
    }
    ```
    
    Wrong：
    
    ```
    var a = 0;
    if (a == '') {
      console.log('losing');
    }
    ```
    
* 使用字面表达式，用 '{}' ,'[]' 代替 ``` new Array ``` ，```new Object```

    不要使用 ```string```，```bool```，```number``` 的对象类型，即不要调用 ```new String``` ，```new Boolean``` ，```new Number``` 

* Object ，Array 创建，当有多个元素时，注意分行排列时逗号的位置
  
    Right：

    ```
    var a = ['hello', 'world'];
    var b = {
      good: 'code',
      'is generally': 'pretty',
    };
    ```
      
    Wrong:
    
    ```
    var a = [
      'hello', 'world'
    ];
    var b = {"good": 'code'
      , is generally: 'pretty'
    };
    ```


* 避免使用 “with” 与 “eval”

* for-in 循环，仅在 object/hash/map 时使用，绝不要对Array 使用

* 不要把Array 当做关联数组或Object 使用,即你不应该用非数字作为Array 的索引
        (Phper 尤其注意这点)  
    Wrong :
  
    ```
    var a = []; // use '{}' instead
    a['hello'] = 'shit';
    a['foo'] = 'bar';
    ```

* Node 的异步回调函数的第一个参数应该是错误指示

    ```
    function cb(err, data , ...) {...}
    ```
    
* 类继承写法，尽管有各种方式来实现继承，但最为推荐的是Node 的标准写法
  
    ```
    function Socket(options) {
      ...
      stream.Stream.call(this);
      ...
    }
  
    util.inherits(Socket, stream.Stream);
    ```

* 引用模块时，应该按行分别引用每一个模块，不应该都写在一行，或者使用逗号连续引用。

    Right：
    
    ```
    var assert = require('assert');
    var fork = require('child_process').fork;
    var net = require('net');
    var EventEmitter = require('events').EventEmitter;
    ```
    
    Wrong：( Node 源代码已经将此方式全部修正)
    
    ```
    var assert = require('assert')
      , fork = require('child_process').fork
      , net = require('net')
      , EventEmitter = require('events').EventEmitter;
    ```

* 多参考、模仿 Node 源码的编程风格 ^_^