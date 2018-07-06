phantomjs教程
========

[教程链接](http://www.phperz.com/special/45.html)

简介
---
PhantomJS 是一个基于WebKit的服务器端 JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。PhantomJS可以用于页面自动化，网络监测，网页截屏，以及无界面测试等



linux下使用phantomjs的问题
---
### 字体乱码，中文变方块
linux下保存截图发现会乱码，则可以安装一下字体解决
`yum install bitmap-fonts bitmap-fonts-cjk`

### 中文字体大小不对
多安装几个中文字体，如安装simsun.ttf

    // 下载字体文件， 通过xshell的sftp,上传到 /usr/share/fonts
    sftp:> cd /usr/share/fonts
    sftp:> put  #上传文件
    回到xshell
    cd /usr/share/fonts
    > mkfontscale
    > mkfontdir
    > fc-cache -fv #刷新字体缓存
    > fc-list :lang=zh #查看中文字体
    > fc-match Arial -s #字体匹配方式..




