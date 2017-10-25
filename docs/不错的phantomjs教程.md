phantomjs教程
========

[教程链接](http://www.phperz.com/special/45.html)

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




