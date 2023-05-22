# nodejs child_process

在 node 中，child_process 这个模块非常重要。掌握了它，等于在 node 的世界开启了一扇新的大门。熟悉 shell 脚本的同学，可以用它来完成很多有意思的事情，比如文件压缩、增量部署等

简单例子

```js
const spawn = require("child_process").spawn;
const ls = spawn("ls", ["-lh", "/usr"]); // 命令参数以数组形式传入
ls.stdout.on("data", (data) => {
  console.log("stdout:", data);
});

ls.stderr.on("error", (data) => {
  console.log("stderr:", data);
});

// 监听子进程关闭
ls.on("close", (code) => {
  console.log(`child process exited with code: ${code}`);
});
```

## 几种创建子进程的方式

- `child_process.exec()` 、`child_process.execFile()`、`child_process.fork()` 底层都是通过 `child_process.spawn()`实现的
- `child_process.exec()` 、`child_process.execFile()` 都传入回调，在子进程停止时执行
- 以上方法都有同步版本

```js
child_process.spawn(command, [args], [options]);
child_process.exec(command, [options], [callback]);
child_process.execFile(file, [args], [options], [callback]);
child_process.fork(modulePath, [args], [options]);
```

### child_process.exec()

创建一个 shell，然后在 shell 里执行命令。执行完成后，将 stdout、stderr 作为参数传入回调方法。

```js
var exec = require("child_process").exec;

exec("ls -al", function (err, stdout, stderr) {
  // stdout stderr默认为字符串，除非设置了options.encoding: buffer
  if (err) {
    console.error("error:", err);
    throw err;
  }
  console.log("stdout: ", stdout);
  console.log("stderr:", stderr);
});
```

**options 参数**

- `cwd`：当前工作路径。
- `env`：环境变量。
- `encoding`：编码，默认是 utf8。
- `shell`：用来执行命令的 shell，unix 上默认是/bin/sh，windows 上默认是 cmd.exe。
- `timeout`：默认是 0。
- `killSignal`：默认是 SIGTERM。
- `uid`：执行进程的 uid。
- `gid`：执行进程的 gid。
- `maxBuffer`： 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是 200\*1024（就是 200k 啦）

### child_process.exeFile()

跟 child_process.exec()类似，不同点在于，没有创建一个新的 shell, 效率要高一些。

```js
    // open.cmd ->
    @echo off
    echo %1 %2


    var child_process = require('child_process')
    child_process.execFile('open.cmd', ['hello', 'world'], function(err, stdout) {
        if(err) throw err;
        console.log('OPEN DONE ', stdout);
    });
```
