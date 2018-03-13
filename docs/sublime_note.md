sublime_text使用总结
======

1. 设置某后缀对应的语法, 右下角 *点击文件类型/选择 打开具有当前扩展名的..*  
  比如：把 `.wxml` 的文件，识别为 html； 实际上是在 `data/packages/user` 下新建了 *HTML.sublime-settings* 文件，内容如下:

        {
            "extension": ["wxml"]
        }

2. 设置 *全部保存* 菜单的快捷键   
`ctrl+shift+p` 打开命令面板 -> 输入 `key bindings user` -> 填入 ` { "keys": ["ctrl+alt+s"], "command": "save_all" }`

3. 临时禁用已安装的插件包  
`ctrl+shift+p` 打开命令面板 -> 输入 `disable pkg` -> 选择包

4. 修改sublime_text自带的snippet  
用解压工具，打开安装目录下的*packages/JavaScript.sublime-package*, 选择对应的snippet文件(*如：if.sublime-snippet*), `ctrl+enter` 打开文件并编辑保存(*注意：需关闭sublime，才能保存成功*)，保存后压缩
包将被更新.

5. `Emmet` 可用快捷键查询  
`C:\Program Files\Sublime Text 3\Data\Packages\Emmet\emmet\snippet.json` 定义了 `emmet` 中，可用的snippet

6. 自定义snippet  
每个 `*.sublime-snippet` 文件，只能定义一个 snippet, 如 (*console.log.sublime-snippet*)


sublime_text 快捷键
-------------
1. `F11` 切换全屏模式
2. `shift+F11` 切换无干扰模式
3. `ctrl+shift+t` 打开最近关闭的文件
4. `ctrl+k, ctrl+b` 切换sidebar显示/隐藏
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
19. `ctrl+shift+a` 选择html标签之间的内容
20. `ctrl+q` 开始/结束macro的记录
21. `ctrl+shift+q` 播放macro
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
