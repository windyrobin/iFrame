* 转变思想

    抛弃传统的 Php/RoR/Django/Asp.net 的随意的写法，Node 中间层/高性能开发  
    是个特殊的领域，需要足够的严谨与细致

* Node 中间层/高性能开发 = JavaScript + 系统编程 + 高性能服务器编程 

* 减少外部依赖，谨慎选择开源模块

* 面向接口编程，不管内部实现如何，接口定义要简洁、清晰、固定，参数、  
    返回值的详细说明，是否会抛出异常，有何陷阱与缺陷

* 对于复杂的逻辑运算，不仅要有unittest，还要有相应的benchmark test

* 启用 Node 的 profile ，有时能够有助于你对算法瓶颈的查找、优化

* 对于外部的网络请求，一定也要有相应的benchmark test ，摸清其 qps，response time ，  
     cpu 耗费

* 选择使用 http keep-alive 

* 选择使用 tcp/http/mysql/memcache ... 等等连接池

* 对于异步回调函数，一定要检查其是否错误，即第一个回调参数，并做相应处理

* 复杂的逻辑运算函数，要加 try/catch 进行安全控制

* 设置uncaughtException ，但你应该永远不让它有触发的机会

* JS 不能解决的问题，如 算法性能，可以考虑尝试 C++ 扩展