# Node 编码规范

* 缩进 ，2 个 space，tab要转换成2 space. (入乡随俗，这是Node 源码及module 采用的标准)   
    [Eclipse设置](http://ww3.sinaimg.cn/large/6cfc7910jw1dnf44jzellj.jpg)

* 永远用 var 声明变量，不加 var 时，会污染顶层上下文

* 操作符与操作算子之间要有空格

    Right：

    ```js
    var string = 'Foo' + bar;
    ```
    Wrong:
  
    ```js
    var string = 'Foo'+bar;
    ```

* 使用string 时，用单引号替代双引号（写JSON 时除外）
  
    Right：

    ```js
    var foo = 'bar';
    
    var http = require('http');
    ```
    
    Wrong：
    
    ```js
    var foo = "bar";
    
    var http = require("http");
    ```
    
*  大括号位置
  
    Right：

    ```js
    if (true) {
      console.log('winning');
    }
    ```
    
    Wrong：
    
    ```js
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
  
    ```js
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

    ```js
    var admin_user = db.query('SELECT * FROM users ...');
    
    function bankAccount() {
    }
    ```

* 文件命名

    单词之间使用 ‘_’ underscore 来 分割，如果你不想暴露某个文件给用户 ，
    你也可以用‘_’ 来开头
   
    Right :
    
    ```js
    child_process.js
    string_decoder.js
    _linklist.js
    ```


* 不使用 ```const``` 关键字
  虽然V8 和 Mozilla 都支持它，但它不是ECMA 标准，我们用以下方式定义常量：
    
    Right：

    ```js
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

    ```js
    var a = 0;
    if (a === '') {
      console.log('winning');
    }
    ```
    
    Wrong：
    
    ```js
    var a = 0;
    if (a == '') {
      console.log('losing');
    }
    ```
    
* 使用字面表达式，用 '{}' ,'[]' 代替 ``` new Array ``` ，```new Object```

    不要使用 ```string```，```bool```，```number``` 的对象类型，即不要调用 ```new String``` ，```new Boolean``` ，```new Number``` 

* Object ，Array 创建，当有多个元素时，注意分行排列时逗号的位置
  
    Right：

    ```js
    var a = ['hello', 'world'];
    var b = {
      good: 'code',
      'is generally': 'pretty',
    };
    ```
      
    Wrong:
    
    ```js
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
  
    ```js
    var a = []; // use '{}' instead
    a['hello'] = 'shit';
    a['foo'] = 'bar';
    ```

* Node 的异步回调函数的第一个参数应该是错误指示

    ```js
    function cb(err, data , ...) {...}
    ```
    
* 类继承写法，尽管有各种方式来实现继承，但最为推荐的是Node 的标准写法

    ```js
    function Socket(options) {
      // ...
      stream.Stream.call(this);
      // ...
    }
    
    util.inherits(Socket, stream.Stream);
    ```

* 如果你在模块中 exports 一个类，对于此类的私有成员变量，建议加上 "_"  前缀以示区分

* 变量声明时，应该每行声明一个，不应该都写在一行（尽管这被JSLint 所推荐）。

    Right：

    ```js
    var assert = require('assert');
    var fork = require('child_process').fork;
    var net = require('net');
    var EventEmitter = require('events').EventEmitter;
    ```
    
    Wrong：( Node 源代码已经将此方式全部修正)

    ```js
    var assert = require('assert')
      , fork = require('child_process').fork
      , net = require('net')
      , EventEmitter = require('events').EventEmitter;
    ```
    
* 注释规范，采用 [Google 的js 规范](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml#Comments)

    Right :
    
    ```js
    /**
     * Queries a Baz for items.
     * @param {number} groupNum Subgroup id to query.
     * @param {string|number|null} term An itemName,
     *     or itemId, or null to search everything.
     */
    goog.Baz.prototype.query = function (groupNum, term) {
      // ...
    };
    ```
    
    更多案例请参看以上链接

* 多参考、模仿 Node 源码的编程风格 ^_^