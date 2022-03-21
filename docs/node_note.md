# nodejs note

[Node.js 简介](http://nodejs.cn/learn)

```shell
node [options] [V8 options] [script.js | -e "script" | - ] [arguments]
```

## 断言

断言失败将会抛出 assertError 错误, assert 本身是一个函数，它上面也有很多断言方法

- assert(val, msg) // 同 assert.ok(val, msg) 判断值是否为真
- assert.deepEqual(actual, expect, msg) //判断对象是否具有相同的字段，字段值是否相等, 只判断可枚举属性
- assert.deepStrictEqual(actual, expect, msg) //判断对象是否具有相同的字段，字段值是否严格相等, 判断字段的数据类型，也判断原型对象
- assert.doesNotThrow(testFn, error, msg); // 断言不会抛出指定类型的错误，抛出了指定类型错误则断言失败，抛出其他错误则直接抛出(还是断言成功的)，没抛出错误则断言成功
- assert.equal(actual, expect, msg) //断言两个值相等
- assert.strictEqual(actual, expect, msg) // 断言两个值严格相等

```js
var assert = require("assert");
var done = true;
assert(done, "not finish");
assert.ok(done, "not finish");
assert.deepEqual({ a: 1, b: 2 }, { a: "1", b: 2 }); // pass
assert.deepStrictEqual({ a: 1 }, { a: "1" }); // not pass

assert.doesNotThrow(
  () => {
    throw new TypeError("some type error");
  },
  SyntaxError,
  "抛出了类型错误"
);

assert.equal(1, "1"); // pass
assert.equal({ foo: 1 }, { foo: 1 }); // not pass
assert.strictEqual(1, "1"); // not pass
```

### Buffer

Buffer 对象是全局对象
Buffer 支持的编码方式：ascii, utf8, base64, binary

    new Buffer(size)  // var bf = new Buffer(8); bf.write('hello');
    new Buffer(array)
    new Buffer(str, encoding='utf8') // var bf = new Buffer('hello');

    buffer.write(str,offset=0, encoding='utf8')
    buffer.toString(encoding, start=0, end=buffer.length);

    buffer[index] // buffer对象index位置的字节值

    Buffer.byteLength(string, encoding='utf8')
    buffer.length //分配给buffer对象的内存大小 字节为单位

    buffer.copy(targetBuffer, targetStart, sourceStart, sourceEnd=buffer.length)
    buffer.slice(start, end);//返回引用同一段内存的buffer对象， 注意和str.slice()不同

### EventEmitter

所有能够触发事件的对象都是 events.EventEmitter 的实例。
注册新的事件监听器时，会触发 newListener 事件  
出错则触发 error 事件，若没被捕获，则输出调用栈，并退出应用

- event: newListener
- event: error

常用方法

- `emitter.on(event, listener)`
  向监听器数组添加 1 个监听器, 同 `emitter.addListener(event, listener)`

          server.on('stream', function(){
              console.log('someone connected');
          });

- `emitter.once(event, listener)`
  只监听一次的事件，回调后即取消监听

- `emitter.removeListener(event, listener)`
  从指定监听器数组，移除指定监听器 (监听器数组重新调整索引 splice)

          var callback = function(stream){
              console.log('someone connected!')
          };

          server.on('stream', callback);
          //...
          server.removeListener('stream', callback);

- emitter.removeAllListeners(event)

- emitter.listeners(event); //返回指定事件的监听器数组

- emitter.emit(event, [arg1], [arg2],...); //触发事件

> > streams
> > stream 是一个抽象接口，node 中很多对象都实现了这个接口(如 request, stdout), stream 对象是 EventEmitter 的实例。
> > stream 可以是 只读，只写，可读可写 的

> readable stream 只读流
> 只读流的方法、属性和事件

- event:data
  stream.on(data, function(data){
  //data: buffer or string (若调用过 setEncoding())
  });

- event:end
  流遇到 EOF 或 TCP 中的 FIN 时触发，表示不会再有数据进来
  stream.on('end', function(){ });

- event:error
  stream.on('error', function(exception){ });

- event:close
  内部的文件描述符被关闭时触发
  stream.on('close',function(){ });

- event:fd
  当数据流接收到文件描述符信息时触发 (一个文件的数据流信息包括 2 部分：文件描述符信息和文件的数据信息) unix 流
  stream.on('fd', function(fd){ });

- stream.readable

- stream.setEncoding(encoding);
  设置 data 事件返回的是字符串而不是 buffer 对象，编码方式有：ascii, utf8, base64

- stream.pause(); //暂停触发 data 事件

- stream.destroy();
  关闭内部的文件描述符，这样流不会再触发任何事件

> writable stream 可写流
> 可写流的方法、属性和事件：

- event:drain
  在一个 write 方法被调用并返回 false 后触发，表示可安全地再次写入该 stream
  stream.on('drain', function(){ });

- event:error
  stream.on('error', function(exception){ });

- event:close
  当底层的文件描述符已终止时触发
  stream.on('close', function(){ });

- stream.writable

- stream.write(string, encoding='utf8',[fd]);
  用指定的编码方式编码字符串后写入流中，若字符串被成功刷新到内核缓冲区则返回 true, 否则返回 false, 数据在未来写入。
  drain 事件通知内核缓冲区何时为空

- stream.write(buffer); 同上

- stream.end();
  通过 EOF 或 FIN 来终止流

- stream.end(string, encoding); //~~相当于 stream.write(string, encoding) 后，stream.end()

- stream.end(buffer); //同上

- stream.destroy();
  终止底层的文件描述符，之后流不会发出任何事件

> > global objects 全局对象

- global
  全局命名空间对象 ~~类似于浏览器环境下的 window?

- process 进程对象

- require() 加载依赖模块

- require.paths
  一个保存了 require 函数搜索路径的数组，可往里面添加自定义路径

- \_\_filename
  当前正在执行的脚本的绝对路径

- \_\_dirname
  当前正在执行脚本的文件夹

- module
  指向当前模块的引用， module.exports 和 exports 指向同一个引用

> process 进程
> process 对象是 EventEmitter 的实例

- event:exit
  进程退出时触发，是检查模块状态的好地方(如单元测试)
  process.on('exiti', function(){ });
  如：
  process.on('exit', function(){
  process.nextTick(function(){//下一次事件循环
  console.log('this will not run');
  });
  console.log('about to exit');
  });

- event:uncaughtException 未捕获异常
  process.on('uncaughtException', function(error){ });
  如：
  process.on('uncaughtException',function(error){
  console.log('caught exception:' + error);
  });

setTimeout(function(){
console.log('this will still run');
});

nosuchFn();
console.log('this will not run');

- signal events
  当进程接收到信号时被触发， POSIX 信号列表(SIGINT, SIGUSR1)

监听 SIGINT 信号示例：
var stdin = process.openStdin();
process.on('SIGINT', function(){
console.log('Got SIGINT, press ctrl+D to exit')
});
发送 SIGINT 信号最简单的方法 ctrl+C

- process.stdout
  一个代表标准输出的流对象
  console.log 的定义:
  console.log = function(m){
  process.stdout.write(d + '\n');
  };

- process.openStdin()
  打开标准输入流，返回一个只读流对象
  如：打开标准输入流，同时监听 2 个事件
  var stdin = process.openStdin();
  stdin.setEncoding('utf8');

stdin.on('data', function(chunk){
process.stdout.write('data:'+chunk);
});

stdin.on('end', function(){
process.stdout.write('end');
});

- process.argv
  保存命令行参数的数组，argv[0]是 node 的路径，argv[1]是现在执行 js 的路径，argv[2],...才是命令行输入的参数

- process.execPath
  进程可执行文件的绝对路径

  > console.log(process.execPath)
  > D:\Program Files\nodejs\node.exe

- process.chdir(directory)
  改变进程的当前目录，失败时抛出异常

- process.compile(code, filename); //process.compile->undefined??
  同 eval 方法，可以指定文件名，更友好地输出错误信息 ~~~把 code 看做是 filename 文件里的代码来执行
  code 参数的代码无法访问本地作用域
  eval(code); //code 可以访问本地作用域

如：
var localVar = 123, compiled, evaled;
compiled = process.compile('localVar=1', 'myfile.js');
console.log('localVar:' + localVar + ', compiled:' + compiled);

evaled = eval('localVar = 1');
console.log('localVar:' + localVar +', evaled:' + evaled);

- process.cwd()
  返回进程的当前工作目录

- process.env
  一个保存用户环境变量的对象

- process.exit(code=0)
  退出进程，返回退出状态码
  process.exit(0); //正常退出
  process.exit(1); //执行 node 的 shell 将会得到返回值 1. 非 0 则表示异常退出

- process.getgid(); //process.getgid -->undefined ??
  返回进程的用户组 id, 数字

- process.setgid(id) //undefined??
  设置当前进程的用户组 id, id 参数可以为数字 id 或组名字符串

- process.getuid() //当前进程的用户 id

- process.setuid(id) //设置当前进程的用户 id

- process.version //编译进可执行文件的属性， 代表 NODE_VERSION

- process.installPrefix //编译进可执行文件的属性， 代表 NODE_PREFIX undefined ??

- process.kill(pid, signal='SIGINT')
  向一个进程发送信号，pid 为进程 id, signal 描述要发送信号的字符串，默认为 SIGINT
  如：
  process.on('SIGHUP', function(){
  console.log('Got SIGHUP signal');
  });

setTimeout(function(){
console.log('exiting');
process.exit(0);
},100);

process.kill(process.pid, 'SIGHUP');

- process.pid //当前进程 id

- process.title //获取或设置命令行窗口的标题

- process.platform //平台

  > process.platform
  > 'win32'

- process.memoryUsage();
  返回一个描述 node 进程内存占用情况的对象

- process.nextTick(callback)
  在事件循环的下一轮调用这个回调。此函数不是 setTimeout(callback,0)的别名，它更高效

- process.umask([mask])
  设置或读取进程的文件创建模式掩码

> > sys

- sys.print(string) //同 console.log(),只是没有结尾的换行符

- sys.debug(string)
  同步输出函数，阻塞进程并将字符串打印到标准错误输出中(stderr) ~~~阻塞版的 console.error

- sys.log(string)
  将字符串输出到标准输出(stdout 即控制中)，并附加时间戳

- sys.inspect(object, showHidden=false, depth=2)
  序列化 调试中很有用
  showHidden 为 true，则非枚举属性也会被转化
  depth 为递归深度，null 则无限递归

- sys.pump(readableStream, writableStream, callback); //实验性的 api
  数据流从只读流到可写流

> > timers

- setTimeout(callback, delay, [arg],[...]);

- clearTimeout(timeoutId);

- setInterval(callback, delay,[arg],[...]);

- clearInterval(intervalId)

> > child_process 子进程
> > 程序可以通过子进程的 stdin, stdout,stderr 以完全非阻塞的方式传递数据
> > 创建子进程 require('child_process').spawn()
> > 每个子进程总带有 3 个流对象 child.stdin, child.stdout, child.stderr
> > 子进程的事件、方法和属性

- event:exit
  child.on('exit', function(code, signal){ });
  子进程结束后被触发，若正常结束 参数 code 为子进程的退出码，否则为 null; 若子进程因为信号而终止，signal 参数为信号名称，否则为 null

- child.stdin

- child.stdout

- child.stderr

- child.pid

- child.spawn(cmd, args=[], [options])
  使用指定的命令行参数创建新进程
  options 默认值如下
  {
  cwd:undefined, //指定新进程的工作目录
  env:process.env, //指定新进程可见的环境变量
  customFds:[-1,-1,-1] //[stdin, stdout, stderr]绑定到指定的流， -1 表示创建新的流
  }

- child.exec(command, [options], callback)
  使用子进程执行命令，并将子进程的输出以回调函数参数的形式返回

- child.kill(sigal='SIGTERM')
  向子进程发送信号 不指定则默认信号为 SIGTERM

> > Script
> > Script 类可以编译执行 js 代码
> > 访问 Script 类： var Script = process.binding('evals').Script;

- Script.runInThisContext(code,[filename]);
  编译 code 参数包含的代码，并返回结果，如同这些代码是从 filename 文件中加载的一样，同 process.compile()
  执行的代码并不访问本地作用域

var localVar = 123, usingScript, evaled,
Script = process.binding('evals').NodeScript;

console.log(typeof Script);
console.log(Script.runInThisContext);

usingScript = Script.runInThisContext('localVar = 1;', 'myfile.js');
console.log('localVar:' + localVar +' ,usingScript:' + usingScript);

evaled = eval('localVar = 1;');
console.log('localVar:' + localVar + ' , evaled:' + evaled);

- Script.runInNewContext(code, [sandbox],[filename]);
  编译代码并在 sandbox 参数指定的作用域中执行和返回结果，其他同 Script.runInThisContext()
  Script.runInNewContext()方法非常有用，它可以在一个独立的线程中执行不信任的代码，防止全局变量被意外修改。

- new Script(code, [filename]);
  返回包含编译好 code 参数代码的 Script 对象，这个 script 对象可以用下面的方法来执行内部编译好的代码，
  这个 script 对象可以在运行时绑定到指定的对象，每次绑定只在运行时有效

- script.runInThisContext() //与 Script.runInThisContext()类似(1 个是对象的方法，一个是类的方法)
  script.runInThisContext()执行的是 script 对象内包含的代码并返回结果，执行的代码不能访问本地作用域，但是可以访问全局作用域

script.runInThisContext 实现一次编译，多次执行：

var Script = process.binding('evals').NodeScript;
var scriptObj, i;
globalVar = 0;

scriptObj = new Script('globalVar += 1;', 'myfile.js');
for(i=0; i<1000; i++){
scriptObj.runInThisContext();
}

console.log('globalVar:' + globalVar);

- script.runInNewContext([sandbox]) //与 Script.runInNewContext(sandbox)函数类似
  将 sandbox 指定的对象作为全局对象来执行代码，并返回结果。不访问本地作用域

var sys = require('sys');
var Script = process.binding('evals').NodeScript;
var scriptObj, i;

var sandbox = {
animal:'cat',
count:2
};

scriptObj = new Script('count += 1; name="kitty";', 'myfile.js');
for(i=0; i<10; i++){
scriptObj.runInNewContext(sandbox);
}

console.log(sys.inspect(sandbox));

> > filesystem 文件系统
> > 文件的 I/O 是由标准的 POSIX 函数封装而成的。fs 的 api 都设有同步和异步方式。
> > //async unlink
> > var fs = require('fs');
> > fs.unlink('./note/hello.js', function(err){
> > if(err) throw err;
> > console.log('successfully delete the file');
> > });

console.log('last statement');

//sync unlink
var fs = require('fs');
fs.unlinkSync('./note/hello.js');
console.log('successfully delete the file');

//多个回调函数的执行顺序是不确定的，要有序的话，需要嵌套回调
// fs.rename() -> fs.stat
var fs = require('fs');
fs.rename('./note/hi.js', './note/hello.js', function(err){
if(err) throw err;
fs.stat('./note/hello.js', function(err, stats){
if(err) throw err;
console.log( JSON.stringify(stats) );
});
});

- fs.unlink(file, callback), fs.rename(oldfile, newfile, callback)
- fs.unlinkSync(file), fs.renameSync(oldfile, newfile)

- fs.truncate(fd, len, [callback]) //截取
- fs.truncateSync(fs, len)

- fs.chmod(path, mode, [callback])//异步更改文件权限
- fs.chmodSync(path, mode);

- fs.stat(path, [callback]); //异步读取文件属性
  fs.stat(path, function(err, stats){ })

- fs.lstat(path, [callback]) //利用路径异步读取链接的属性 path 参数为一个符号链接
  fs.lstat(path, function(err, lstats){ })

- fs.fstat(fd, [callback]); //利用文件描述符异步读取属性

- fs.link(srcpath, dstpath, function(err){ }); //异步建立连接

- fs.symlink(linkdata, path, function(err){ }); //异步建立符号连接

- fs.readlink(path, function(err, resolvedPath){ }) //异步读取连接

- fs.realpath(path, function(err, resolvedPath){ }) //异步读取绝对路径

- fs.unlink(path, fucntion(err){ }) // ~=delete

- fs.rmdir(path, function(err){ }) //

- fs.mkdir(path, mode, function(err){ }) //异步删除目录

- fs.readdir(path, function(err, arr){ }); //异步读取目录中的内容

- fs.close(fd, function(err){ });

- fs.open(path, flags, mode=066, callback);
  异步打开文件 flag 可以为：r , r+, w, w+, a

- fs.write(fd,buffer, offset, length, postion, callback)
  通过文件描述符 fd, 写入缓冲区到文件
  offset,length 决定哪部分缓冲区被写入
  position 决定写入位置

- fs.writeSync(fd, buffer, offset, length, position);
  fs.write(缓冲区)的同步方式，返回写入动作的数据大小

- fs.writeSync(fd, string, position, encode='utf8');
  fs.write(字符串)的同步方式，返回写入动作的数据大小

- fs.read(fd, length, position, encoding, callback)

- fs.readFile(filename, [encoding] , [callback])
  通过文件路径异步读取文件
  fs.readFile('note/hello.js', function(err, data){
  if(err) throw err;
  console.log(data);
  })

- fs.writeFile(filename, data, encoding='utf8', callback)

- fs.watchFile(filename, [options], listener)
  监听文件的变化
  options:{
  persistent: true | false, //是否持续检查
  interval: 200 //检测间隔 单位毫秒
  }

fs.watchFile('myfile.js', function(curr, prev){
console.log(curr.mtime, prev.mtime);
});

- fs.unwatchFile(filename);
  停止监听文件的变化

- fs.Stat 获取文件的信息
  fa.stat() 和 fs.lstat()函数返回 stats 对象：
  stats.isFile()
  stats.isDirectory()
  stats.isBlockDevice()
  stats.isCharacterDevice()
  stats.isSymbolicLink() ( only true width fs.lstat() )
  stats.isFIFO()
  stats.isSocket()

> fs.ReadStream 读取文件

- fs.createReadStream(path, [options]);
  新建一个只读流对象
  options 是一个默认值如下的对象：
  {
  flag:'r',
  encoding:null,
  mode:0666,
  bufferSize:4\*1024
  }
  options 对象可以包含 属性 start 和 end 从文件中读取一个范围的数据，而不是整个文件，start 和 end 必须同时指定。
  fs.createStream('sample.txt',{start:90, end:99});

> fs.WriteStream 写入文件

- ws = fs.createWriteStream(path, [options]);
  options 默认值：
  {
  flags:'w',
  encoding:null,
  mode:0666
  }

- event:open
  ws.on('open', function(fd){ });

> > HTTP
> > http.Server 模块

- event:request
  server.on('request',function(request, response){ })
  request 是 http.ServerRequest 的一个实例，response 是 http.ServerResponse 的一个实例
  每个请求发生时触发，每个连接可能会有多个请求(在 keep-alive 的情况下 )

- event:connection
  server.on('connection', function(stream){ })
  当一个新的 TCP stream 建立后发出此消息。 stream 是 net.Stream 的对象

- event:close
  server.on('close', function(errno){ })
  当服务器关闭时触发

- event:upgrade
  server.on('upgrade', function(request, socket, head){ })
  每当客户端请求一个 http upgrade 时触发，若 upgrade 事件没被监听，则请求 upgrade 的客户端的连接将被关闭
  参数：
  request: 一个 http 请求，http.ServerRequest 的实例
  socket:服务器和客户端之间连接用的网络 socket
  head: Buffer 的实例

- event:clientError
  server.on('clientError',function(exception){ })
  客户端连接出错时触发

- http.createServer(requestListener)
  返回一个新的 web server 对象
  requestListener 是一个 request 事件的监听器

- server.listen(port, [hostname], [callback])
  在指定的端口和主机上接受连接。若 hostname 没写，则在此机器的所有 ipV4 地址上接受连接(INADDR_ANY)
  若要在 UNIX SOCKET 上监听的话，则需要提供一个文件名来替代端口号和主机名
  server.listen()是一个异步方法，server 在指定端口绑定好后，执行回调 callback

- server.listen(path, callback)
  建议一个 UNIX SOCKET 服务器，并在指定路径上监听

- server.setSecure(credentials)
  允许此 server 支持 HTTPS

- server.close()
  不再接受任何新连接

- server.maxConnections
  最大连接数

- server.connections
  当前连接数

> http.ServerRequest
> http.ServerRquest 对象通常由 http.Server 建立而非用户手动建立，并且会作为 request 事件监听器的第一个参数传递进去

http.ServerRequest 对象的事件、方法和属性：

- event: data
  request.on('data', function(chunk){ })
  当接收到信息体中的一部分时触发
  request.setBodyEncoding()方法可设置消息体的编码 (注：传输编码不同于字符编码)

- event:end
  request.on('end', function(){ })
  每次完全接收消息后触发，该事件后不会触发其他事件

- request.method
  一个只读字符串 如：GET, DELETE

- request.url
  代表所请求的 url ，~~ 非完整 url? 如：'/status?name=ryan'
  解析 url 各个部分：依赖 url 模块
  require('url').parse(request.url);
  require('url').parse(request.url, true);
  require('querystring').parse(request.url)

- request.headers
  请求头部信息 只读

- request.httpVersion
  http 协议的版本 如 1.1, 1.0 request.httpVersionMajor, request.httpVersionMinor

- request.setEncoding(encoding=null)
  设置请求体的字符编码 utf8, binary, null. 默认为 null, 这个设置影响到 request 的 data 事件回调函数接收到的 data 是一个 buffer 对象还是字符串。

- request.pause()
  暂停请求，对于控制上传非常有用

- request.resume()
  恢复一个暂停的 request

- request.connection
  一个代表当前连接的 net.Stream 对象

> http.ServerResponse
> 这个对象一般有 http.Server 建立而非用户手动建立，作为 request 事件监听器的第二个参数，是一个可写流

- response.writeHead(statusCode, [reasonPhrase], [headers])
  用来发送一个响应报文头给本次的请求方
  如：
  var body = 'hello world';
  response.writeHead(200, {
  'content-length':body.length,
  'content-type': 'text/plain'
  })

- response.write(chunk, encoding='utf8');
  负责发送响应报文的部分数据，必须在 response.writeHead()方法之后调用
  参数：
  chunk:可以是字符串或 buffer 对象，若为字符串则用 encoding 参数指定的编码方式将其编码为字节流
  response 对象只缓存消息体的第一个数据块，其他的数据以流的方式发送，没被缓存

- response.end(data, encoding='utf8');
  通知服务器所有响应的报文头和报文体已全发出

> http.Client
> 使用服务器地址作为参数来构造一个 http.Client, 其返回的句柄可以用来发送一个或多个请求
> //连接到 baidu
> var http = require('http');
> var baidu = http.createClient(80, 'www.baidu.com');
> var request = baidu.request('GET' ,'/', {host:'www.baidu.com'});
> request.end();

request.on('response', function(response){
console.log('STATUS:' + response.statusCode);
console.log('HEADERS:' + JSON.stringify(response.headers));
response.setEncoding('utf8');
response.on('data', function(chunk){
console.log('BODY:' + chunk);
});
});

- event: upgrade
  client.on('upgrade', function(request, socket, head){ })
  当服务器响应 upgrade 请求时触发

- http.createClient(port, host='localhost', secure=false, [credentials])
  构建一个 http 客户端 port 和 host 指明要连接的目标

- client.request(method='GET' , path, [request_headers])
  发出一个 http 请求，必要时建立一个流，该函数返回 http.ClientRequest 对象
  若想发送一个信息体，记得要在头部信息中包含 content-length，以流的方式发送请求体，则设置 transfer-Encoding:chunked

- client.verifyPeer();
  返回 true/false 并在上下文附带服务器定义的或者缺省数字认证中心的有效证书列表。

- client.getPeerCertificate()
  返回用 JSON 结构详尽表述的服务器方证书

> http.ClientRequest
> http.Client 的 request()方法建立并返回 http.ClientRequest 对象。该对象代表一个进行中的请求，请求头已经发出去了。

- event:response
  request.on('response', function(response){ //response 为 http.ClientResponse 的实例
  response.on('data', function(chunk){
  console.log('BODY:' + chunk);
  });
  });

- request.write(chunk, encoding='utf8');
  发送请求体的部分数据，多次调用 write 方法，从而让请求体以流的方式发送到服务器。

- request.end([data], [encoding]);
  完成本次请求的发送

> http.ClientResponse
> 这个对象在 http.Client 发起请求时被创建，它会作为 request 对象的 response 事件回调函数的参数 ，为只读流
> http.ClientResponse 的事件、方法和属性：

- event:data
  response.on('data', function(chunk){ });
  当接收到消息体一部分时触发， response.setBodyEncoding()方法设置消息体的编码

- event:end
  response.on('end', function(){ })
  接收完

- response.statusCode
  http 状态码

- response.httpVersion
  所连接到服务器的 http 协议版本

- response.headers
  响应头

- response.setBodyEncoding(encoding=null)
  设置响应体编码

- response.pause()
  暂停 response 触发事件，通常用于控制下载动作

- response.resume()
  恢复暂停的 response

- response.client
  保存 response 所属的 http.Client 的引用

> > net.Server.TCP 服务器模块
> > net.Server 用来建立 TCP 或 UNIX 服务器的
> > 如：
> > var net = require('net');
> > var server = net.createServer(function(stream){
> > stream.setEncoding('utf8');
> > stream.on('connection', function(){
> > stream.write('hello\r\n');
> > });

stream.on('data',function(data){
stream.write(data);
});

stream.on('end', function(){
stream.write('goodbye \r\n');
stream.end();
});

}).listen(8124, 'localhost');

net.Server 对象的事件、方法和属性：

- event:connection
  server.on('connection', function(stream){ })
  建立新连接时触发，stream 是 net.Stream 的实例

- event:close
  server.on('close', function(){ })

- net.createServer(connectionListener)
  建立一个 TCP Server

- server.listen(port, [host], [callback]);
  监听指定端口，绑定好后执行回调

- server.listen(path, callback);
  建立一个 UNIX SOCKET 服务器，并在指定路径上监听

- server.listenFD(fd)
  监听指定的文件描述符

- servre.close()
  停止服务器，是异步方法，服务器触发 close 事件后才最终关闭

> net.Stream TCP 流模块
> 这个对象是对 TCP 或 UNIX SOCKET 的抽象，它实现了全双工的流接口。
> net.Stream 可以由用户手动建立，并作为一个客户端来使用

net.Stream 的事件、方法和属性：

- event:connect
  stream.on('connect',function(){ })
  成功建立连接后触发

- event:secure
  stream.on('secure', function(){ })
  建立一个安全的 SSL 握手后触发

- event:data
  stream.on('data', function(data){ })
  接收到数据时触发

- event:end
  stream.on('end',function(){ })
  当 stream 发出一个 FIN 包后触发

- event:timeout
  stream.on('timeout',function(){ })
  当流因为不活动而超时时触发，唯一一个因为 stream 空闲而通知的事件，这时用户必须手动关闭连接

- event:drain
  stream.on('drain',function(){ })
  当写缓冲区变空时触发，可用来控制上传

- event: error
  stream.on('error',function(exception){ })
  错误时触发

- event: close
  stream.on('close',function(had_error){ })
  当 stream 被完全关闭时触发

- net.createConnection(port, host=127.0.0.1)
  打开一个绑定到指定端口和主机的 stream 对象 host 参数默认为 localhost

- stream.connect(port, host=127.0.0.1)
  在指定的端口和主机上打开一个 stream, 建立连接后发触发 connect 事件

- stream.remoteAddress
  远程计算机的 ip

- stream.readyState
  流的状态：closed, opening, open, readOnly, writeOnly

- stream.setEncoding(encoding=null)
  为接收到的数据设置编码格式 ascii, utf8, base64

- stream.setSecure([credentials])
  支持 HTTPS

- stream.verifyPeer()

- stream.getPeerCertificate()

- stream.write(data, encoding='ascii');

- stream.end([data], [encoding]);

- stream.pause()

- stream.resume()

- stream.setTimeout()

- stream.setNoDelay(noDelay=true)

- stream.setKeepAlive(enable=false, [initailDelay])

> > crypto 加密模块

> > DNS 域名解析

dns = require('dns')
dns.resolve4(domain,callback)
dns.reverse(address, callback)

- dns.lookup(domain, family=null, function(err, address, family){ })
  将一个域名(www.baidu.com)解析为找到的第一个 A(IPV4)或 AAAA(IPV6)记录

- dns.resolve(domain, rrtype='A', function(err, address){ });
  将域名按照指定的类型解析到一个数组里面
  参数：
  rrtype：解析的类型，包括 A(ipv4 地址), AAAA(ipv6 地址), MX(mail exchange record), TXT(text records), SRV(SRV records), PTR(using for revers IP lookups);

dns.resolve()的快捷方法如下：

- dns.resolve4(domain, function(err, addresses){ })
  类似 dns.resolve()方法，只是仅对 ipv4 地址进行查询(即 A records), addresses 是一个 ip 地址的数组

- dns.resolve6(domain, function(err, addresses){ });
  对 ipv6 地址进行查询

- dns.resolveMx(domain, callback);

- dns.resolveTxt(domain, callback)

- dns.resolveSrv(domain, callback)

- dsn.reverse(ip, function(err, domains))
  反向解析一个 ip 地址到一个域名数组

> > dgram 数据报
> > dgram = require('dgram'),数据报一般用来处理 IP/UDP 信息
> > dgram 的事件、方法和属性：

- event:message
  dgram.on('message', function(msg, rinfo){ })
  当一个 SOCKET 接收到新的数据包时触发，msg:缓冲区变量, rinfo:包含发送者地址和数据包字节长度的对象

- event:listening
  dgram.on('listening', function(){ })
  当一个 SOCKET 开始监听数据包的时触发

- event:close
  dgram.on('close',function(){ })
  当一个 SOCKET 使用 close()方法关闭时触发

- dgram.createSocket(type, [callback]);
  建立一个指定类型的数据包 SOCKET, type 可以是: udp4, udp6, unix_dgram

- dgram.send(buf, offset, length, path, [callback]);

- dgram.send(buf, offset, length, port, address,[callback])

- dgram.bind(path)
  仅在 UNIX DOMAIN DATAGRAM SOCKET 中使用

- dgram.bind(port, [address]);
  对于 UDP SOCKET，在指定的端口和可选的地址上监听

- dgram.close()
  关闭非延迟的 SOCKET 并且停止监听数据

- dgram.address()
  返回包含 SOCKET 地址信息的一个对象

- dgram.setBroadcast(flag)
  设置或清除 SO_BROADCASET 选项

- dgram.setTTL(ttl)
  设置 IP_TTL 这个选项，ttl 用来设置 HOPS 的数值从 1 到 255，大多数系统默认设置为 64

> > Assert 断言
> > assert = require('assert') 此模块用来编写单元测试

- assert.fail(actual, expected, message, operator)
  用 operator 测试 actual 和 expected 是否相等

- assert.ok(value, [message]);
  测试 value 是否为 true 等价于 assert.equal(true, value, message)

- assert.equal(actual, expected, [message])
  用操作符== 比较 actual 和 expected 是否相等

- assert.notEqual(actual, expected,[message])
  用操作符!= 比较 actual 和 expected

- assert.deepEqual(actual, expected, [message])
  深度比较是否相等
  a = {a:1, b:2};
  b = {b:2, a:1};
  assert.equal(a,b) //false
  assert.deepEqual(a,b) //true
  assert.strictEqual(a,b) //false

- assert.notDeepEqual(actual, expected, [message])
  深度比较是否不相等

- assert.strictEqual(actual, expected, [message]), assert.notStrictEqual(..)
  用=== 和 !== 比较是否严格相等/不等

- assert.throw(block, [error], [message]), assert.notThrow(...)
  测试代码 期待其抛出(/不抛出)异常

- assert.ifError(value)
  value 不为 false，则抛出异常。 实现代码：assert.ifError = function(err){ if(err) throw(err)}

> > Path 模块
> > 此模块包含很多用来处理文件路径的小工具，
> > path = require('path');

- path.join([path1],[path2],...);
  将所有参数连起来解析成新的路径

- path.normalizeArray(arr) //? path.normalizeArray : undefined
  转化路径的各部分，将'..' 和 '.'替换为实际的路径

- path.normalize(path)
  转化路径字符串，将'..' 和 '.'替换为实际的路径

- path.dirname(path)
  返回代表文件夹的部分

- path.basename(path, [ext]);
  返回路径的最后一部分

- path.extname(path)
  返回路径中文件的扩展名

- path.exists(path, [callback]) ~~fs.exists()
  判断路径是否存在，传递 true/false 给 callback

> > URL 模块
> > url = require('url')
> > url: http://user:pass@host.com:8080/p/a/t/h?query=string#hash
> > 解析后的 url 对象
> > {
> > href:'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
> > ,protocol:'http'
> > ,host:'user:pass@host.com:8080'
> > ,auth:'user:pass'
> > ,hostname:'host.com'
> > ,port:8080
> > ,pathname:'/p/a/t/h'
> > ,search:'?query=string'
> > ,query:'query=string' //或 {query:'string'}
> > ,hash:'#hash'
> > }

- url.parse(urlStr, parseQueryString=false)
  解析 url 字符串返回一个对象

- url.format(urlObj)
  url 对象格式化为 url 字符串

- url.resolve(from, to)
  接收一个 base Url 和 href url，像解析锚点一样解析
  > url.resolve('www.baidu.com','#gogo')
  > 'www.baidu.com#gogo'

> > QueryString 查询字符串
> > querystring = require('querystring');

- querystring.stringify({foo:'bar'}); //foo=bar
  querystring.stringify({foo:'bar', baz:'boo'}, ';', ':'); //foo:bar;baz:boo

- querystring.parse(str, sep="&", eq="=");
  反序列化查询字符串

- querystring.escape
  querystring.stringify 中使用的 escape 方法，可以覆写它

- querystring.unescape
  querystring.parse 中使用的 unescape 方法，可以覆写它

> > REPL 交互执行 (Read Execute Print Loop)
> > node 的 REPL 模式可以单独执行，也可以嵌入到其他程序中。
> > 直接执行 node,不带任何参数，会进入 REPL 模式

设置环境变量 NODE_NO_READLINE=1，则可以启用高级行编辑功能

\_ 保存上一个表达式的值
REPL 提供访问全局作用域内变量的能力
repl = require('repl');
repl.start('node>').context.m = 'my message';

REPL 的一些命令：~~~ repl 环境下 .help 查看所有命令
.break, .clear, .exit, .help, .load, .save

> > Modules 模块
> > node 使用 commonJs 的模块系统

---

## ruanyifeng

> > fs 模块：
> > fs.readFile(path,function(err, file){..})
> > fs.readFile(path,coding, function(err, file){ ...})
> > fs.writeFile(path, data,function(err){...})

fs.readdir(path, function(err, files){..})
fs.rmdir(path);

fs.exists(path, function(exist){..});//指定文件或目录是否存在

fs.open(path, callback); //open 方法会检测文件是否存在

> > stream 模块
> > Stream 是数据处理的一种形式，可以用来取代回调函数。举例来说，传统形式的文件处理，必须先将文件全部读入内存，然后调用回调函数，如果遇到大文件，整个过程将非常耗时。Stream 则是将文件分成小块读入内存，每读入一次，都会触发相应的事件。只要监听这些事件，就能掌握进展，做出相应处理，这样就提高了性能。Node 内部的很多 IO 处理都采用 Stream，比如 HTTP 连接、文件读写、标准输入输出。

Stream 是一个抽象接口，定义了 readable、writable、drain、data、end、open、lose 等事件。它既可以读取数据，也可以写入数据。读写数据时，每读入（或写入）一段数据，就会触发一次 data 事件，全部读取（或写入）完毕，触发 end 事件。如果发生错误，则触发 error 事件。

fs 模块的 createReadStream 方法用于新建读取数据流，createWriteStream 方法用于新建写入数据流。使用这两个方法，可以做出一个用于文件复制的脚本 copy.js。

var readStream = fs.createReadStream(path)
var writeStream = fs.createWriteStream(path);

Streams 对象都具有 pipe 方法，起到管道作用，将一个数据流输入另一个数据流。
readStream.on('open',function(){
readStream.pipe(writeStream);
})

> > http 模块
> > var http = require('http');
> > var server = http.createServer(listener);
> > server.listen(post, host, callback)

response.writeHead(200,{'content-type':'text/html'});
response.write('welcome');
response.end('to homepage');

request 对象：
request.url：发出请求的网址。
request.method：HTTP 请求的方法。
request.headers：HTTP 请求的所有 HTTP 头信息。

当客户端采用 POST 方法发送数据时，服务器端可以对 data 和 end 两个事件，设立监听函数。
var listener = function(req, res){
var content = '';
res.on('data',function(chunk){
content += chunk;
});

res.on('end', function(){
res.writeHead(200, {'content-type':'text/plain'});
res.write(content);
res.end();
});
};

> http.request()方法 (也可以理解成 http 的 client 模式)
> var options = {
> host:'www.cnblogs.com',
> path: "/stephenykk/"
> /_,port:'80'
> ,method:'POST'
> ,headers:{header-name:header-val,..}_/
> };

var callback = function(response) {
var str = '';
response.on('data', function(chunk){
str += chunk;
});
response.on('end', function(){
console.log(str);
});
};
var req = http.request(options, callback);
req.write('hello world!');
req.end();

> > 搭建 HTTPs 服务器
> > 搭建 HTTPs 服务器需要有 SSL 证书。对于向公众提供服务的网站，SSL 证书需要向证书颁发机构购买；对于自用的网站，可以自制。

自制 SSL 证书需要 OpenSSL,生成两个文件：ert.pem（证书文件）和 key.pem（私钥文件）。有了这两个文件，就可以运行 HTTPs 服务器了。
var http = require('http');
var fs = require('fs');

var options = {
key: fs.readFileSync('key.pem'),
cert:fs.readFileSync('cert.pen')
};

var server = http.createServer(options, function(req, res){
res.writeHead(200);
res.end('hello world!');
}).listen(443);

> > events 模块
> > events 模块是 node.js 对“发布/订阅”模式（publish/subscribe）的部署。也就说，通过 events 模块的 EventEmitter 属性，建立一个消息中心；然后通过 on 方法，为各种事件指定回调函数，从而将程序转为事件驱动型，各个模块之间通过事件联系。
> > var EventEmitter = require('events').EventEmitter;
> > var emitter = new EventEmitter();
> > emitter.on('someEvent',function([data]){...}); //注册事件监听
> > emitter.once('someEvent',function(){ ..}) //监听事件 回调只执行一次
> > emitter.emit('someEvent', [data]); //触发事件
> > emitter.removeListener('someEvent', foo); //取消事件监听
> > emitter.removeAllListeners('someEvent');//移除 someEvent 的所有回调
> > emitter.removeAllListeners(); //移除所有事件的所有回调
> > emitter.listeners('someEvent'); //返回事件回调函数的数组

默认情况下，Node.js 允许同一个事件最多可以触发 10 个回调函数。超过 10 个回调函数，会发出一个警告。这个门槛值可以通过 setMaxListeners 方法改变。
emitter.setMaxListeners(20);

events 模块默认支持一些事件: newListener, removeListener
newListener 事件：添加新的回调函数时触发。
removeListener 事件：移除回调时触发。
emitter.on('newListener', function(eventName){
console.log("new listener:" + eventName);
});
emitter.on('removeListener', function(eventName){
console.log("remove listener:" + eventName);
});
