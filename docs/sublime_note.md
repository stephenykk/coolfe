# sublime_text 使用总结

1.  设置某后缀对应的语法, 右下角 _点击文件类型/选择 打开具有当前扩展名的.._  
    比如：把 `.wxml` 的文件，识别为 html； 实际上是在 `data/packages/user` 下新建了 _HTML.sublime-settings_ 文件，内容如下:

          {
              "extension": ["wxml"]
          }

2.  设置 _全部保存_ 菜单的快捷键  
    `ctrl+shift+p` 打开命令面板 -> 输入 `key bindings user` -> 填入 `{ "keys": ["ctrl+alt+s"], "command": "save_all" }`

3.  临时禁用已安装的插件包  
    `ctrl+shift+p` 打开命令面板 -> 输入 `disable pkg` -> 选择包

4.  修改 sublime_text 自带的 snippet  
    用解压工具，打开安装目录下的*packages/JavaScript.sublime-package*, 选择对应的 snippet 文件(_如：if.sublime-snippet_), `ctrl+enter` 打开文件并编辑保存(_注意：需关闭 sublime，才能保存成功_)，保存后压缩
    包将被更新.

5.  `Emmet` 可用快捷键查询  
    `C:\Program Files\Sublime Text 3\Data\Packages\Emmet\emmet\snippet.json` 定义了 `emmet` 中，可用的 snippet

6.  自定义 snippet  
    每个 `*.sublime-snippet` 文件，只能定义一个 snippet, 如 (_console.log.sublime-snippet_)

7.  设置快速切换项目快捷键

`json {"keys": ["ctrl+alt+o"], "command": "prompt_open_project"}, // open project {"keys": ["ctrl+alt+w"], "command": "prompt_switch_project"}, // switch project {"keys": ["ctrl+alt+p"], "command": "prompt_select_workspace"} // 对应菜单 quick switch project`

## sublime_text 快捷键

1. `F11` 切换全屏模式
2. `shift+F11` 切换无干扰模式
3. `ctrl+shift+t` 打开最近关闭的文件
4. `ctrl+k, ctrl+b` 切换 sidebar 显示/隐藏
5. `ctrl+shift+backspace` 删除光标前的内容
6. `ctrl+k, ctrl+k` 删除光标后的内容
7. `shift+delete` 剪切
8. `ctrl+insert` 复制
9. `shift+insert` 粘贴
10. `ctrl+shift+v` 粘贴并缩进
11. `ctrl+k, ctrl+v` 从列表选择并粘贴
12. `ctrl+alt+up` 向上选择，多行编辑
13. `ctrl+alt+down` 向下选择，多行编辑
14. `ctrl+l` 选择行
15. `ctrl+shift+space` 从内到外扩展选择范围
16. `ctrl+shift+m` 选择括号(中括号，花括号)内的内容
17. `ctrl+m` 定位到括号的开始/结束
18. `ctrl+shift+j` 选择相同缩进的部分
19. `ctrl+shift+a` 选择 html 标签之间的内容
20. `ctrl+q` 开始/结束 macro 的记录
21. `ctrl+shift+q` 播放 macro
22. `ctrl+f2` 添加/取消书签
23. `f2` 按顺序定位到书签
24. `ctrl+shift+f2` 取消所有书签
25. `f12` 转到函数定义
26. `f3` 查找下一个
27. `ctrl+shift+f` 在文件夹中查找
28. `f4` 下一个结果, `shift+f4` 上一个结果
29. `ctrl+space` 打开自动完成选择列表
30. `f9` 行排序
31. `ctrl+k, ctl+1,2,3` 按层级折叠代码
32. `Ctrl+Shift +k` 删除一行
33. `Alt + .` 快速闭合标签
34. `Alt + F3` 全选相同的词(光标所在的词/选择的内容)
35. `Ctrl + Shift + D` 复制这行文本
36. `ctrl + k, c` 滚动文档，让光标所在行垂直居中
37. `alt+-` 返回之前的焦点位置
38. `alt+shift+-` 前进到后来的焦点位置 与 `alt+-` 相反
39. `ctrl+0` 定位焦点到 sidebar, `esc`让焦点回到编辑区
40. `ctrl+k ctrl+v` 从复制历史记录中 选择粘贴哪项

## sublime text 3 安装 package control

通过 github 的方式手动安装

1. 打开 [package control 的 github 仓库](https://github.com/wbond/package_control)
2. 下载 zip 压缩包
3. 打开 sublime, Preferences -- browser packages
4. 然后把压缩包解压到该目录，重命名为 _Package Control_
5. 重启 sublime
6. 但是国内用户此时，还是无法安装插件，需要加其他 channel
7. ctl+shift+p, pcac
8. 加入如下几个 channel

   ```
   // 打开package control的设置文件: 首选项 -- 插件设置 -- package control -- 用户设置
   // 加入 channels
   "channels": [
     "http://static.bolin.site/channel_v3.json",
     "https://gist.githubusercontent.com/nick1m/660ed046a096dae0b0ab/raw/e6e9e23a0bb48b44537f61025fbc359f8d586eb4/channel_v3.json"
   ]

   ```

9. 添加后可查看配置 preferences -- package settings -- package control -- user
10. 访问不了的 channel，最好注释掉，避免查找时间过长

## sublime text3 问题

win10 下侧边栏和底部状态栏，中文出现乱码，变成口字方块

1. 打开设置 ctrl+shift+p, 输入 settings
2. 添加或修改配置项 dpi_scale: 1.0, 然后重启
3. 重启后字体会变得很小，在配置文件中改一下 font_size:15

package control 安装不了插件

1. 下载 channel_v3.json
2. 修改 package control 配置，添加 channels

```
  // 打开package control的设置文件: 首选项 -- 插件设置 -- package control -- 用户设置
  // 加入 channels
  "channels": [
    "D:\\channel_v3.json", # 百度云有备份
    "http://static.bolin.site/channel_v3.json",
  ]
```
