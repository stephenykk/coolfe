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
用解压工具，打开安装目录下的*packages/JavaScript.sublime-package*, 选择对应的snippet文件(*如：if.sublime-snippet*), `ctrl+enter` 打开文件并编辑保存(*注意：需关闭sublime，才能保存成功*)，保存后压缩包将被更新.


