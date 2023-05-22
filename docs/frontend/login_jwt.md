登录方案JWT
===

[五分钟带你了解啥是JWT](https://zhuanlan.zhihu.com/p/86937325)
[JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

----

JWT与Session都是都是存储用户信息，它们的不同点有：  

- 存储位置
  Session的状态是存储在服务器端，客户端只有session id；而JWT Token的状态是存储在客户端。

  Session方式存储用户信息的最大问题在于要占用大量服务器内存，增加服务器的开销。
  而JWT方式将用户状态分散到了客户端中，可以明显减轻服务端的内存压力。
  ![对比图](https://pic3.zhimg.com/80/v2-b7eeaf69feb5cbbadea7e0c73056da7a_1440w.jpg)
- 用Token的好处 - 无状态和可扩展性
  没有会话信息意味着应用程序可以根据需要扩展和添加更多的机器，而不必担心用户登录是在哪台机器的问题，我们的负载均衡器可以将用户请求分配到任意服务器
  ![JWT认证过程](https://pic1.zhimg.com/80/v2-7789057d5744891fdf3366d7887ab6e8_1440w.jpg)
