cmder note 
====

常见问题
---

### 中文乱码问题
- 临时解决方法， chcp 65001 *(无效: ls, 输出中文文件夹名称还是乱码)*
- 修改设置 *有效*
	+ 安装完成之后，打开cmder,win+alt+p，进入setting界面
	+ 找到StartUp-Environment
	+ 在set PATH下一行输入下面两行设置内容，保存设置
	```bash		
	set LANG=zh_CN.UTF-8
	set LC_ALL=zh_CN.utf8
	```

	+ 关闭cmder，重新启动cmder，即可看到中文显示正常

### 自定义aliases不生效问题
win10下cmder很多命令history pwd无法使用，ls字体也没有颜色显示，其根本原因是win10下cmd控制台版本问题，切换回老版本就OK了
1. 开始运行 cmd , 打开命令行
2. 点击左上角标题，选择属性，勾选"使用旧版本控制台"
3. 重新打开cmder
4. alias 可查看当前别名定义
5. win + alt + p 打开设置，Startup -- Environment 可自定义别名 如: `alias kk=echo hello kk`


使用方法
---

### 快捷键
- `win+alt+p` 打开设置
- `菜单键(右边ctrl旁边) + f` 查找
- 双击tab栏空白处 新建tab