文档和示例代码
=========

避免所有文档都放到blog,有版本跟踪和方便提交的优点

githubpage提供web服务，可以随时查看


功能
----

+ 文档都放在docs中, 当有新文件添加到docs，则执行一下 `node build` 重新生成index.html *需先安装markdown-html(`cnpm i -g markdown-html`)*

+ docs中的 `*.md` 文件默认不编译成html， chrome插件可直接预览md


