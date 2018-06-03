小米直达号 文档
===========

app.mix
manifest.json
page.mix

- 路由
- 数据绑定
- 基础组件(h5: div a input; native: slider switch list)
- 原生接口


目录结构
---

文件存储
---
cache  internal://cache/path/to/file  
files internal://files/path/to/file  
mass internal://mass/path/to/file  
temp internal://temp/path/to/file  

uri
---
被导入文件 资源引用用绝对路径，如： a.css -> b.mix a中的外部资源引用用绝对路径

    a.css
    div.foo {background-image: url(/common/images/a.jpg)}

manifest.json 
---
包含应用描述 接口声明 和路由设置  
{package, name, icon, versionName, versionCode, minPlatformVersion, features, config, router, display}

config: {logLevel, designWidth, data}  
router: {entry, pages: {comName: {component, path, filter}}}  
display: {backgroundColor, fullScreen, titleBar, titleBarBackgroundColor, titleBarTextColor, titleBarText, menu, pages: {comName: {...}}}

mix文件
---
### page.mix
template, script, style  
页面生命周期 onInit onReady onShow onHide onDestroy onBackPress onMenuPress
this.$app 获取app对象, 从而可访问app.mix中配置的数据和方法  
{props, data, onInit, ...otherMethods}

### app.mix
引入公共的脚本，避免各个页面中引入，导致重复打包  
import util from './util';  
{util: util}  
应用生命周期 onCreate onDestroy  

### template
基础组件 自定义组件 事件系统  
只有1个根节点

	<template>
		<div>
			<text>{{msg}}</text>
			<div class="div1" onclick="handler"><text>bind style 1</text></div>
			<div class="div2" @click="handler2(msg, 'sindy')"><text>bind style 2</text></div>
		</div>
	</template>
	<script>
		export default {
			data() {
				return {msg: 'hello'}
			},
			handler(ev) {
				this.msg = 'hihi';
			},
            handler2(msg, suffix, ev) {
                this.msg = msg + '-' +suffix
            }
		}
	</script>

列表渲染

    <template>
        <div class="page">
            <!-- <div for="product in goods" tid="id"> -->
            <!-- <div for="(pindex, product) in goods" tid="id"> -->
            <div for="list" tid="uniqueId">
                <text>{{$idx}}</text>
                <text>{{$item.uniqueId}}</text>
            </div>
        </div>
    </template>
    <script>
    export default {
        data() {
            return {
                list: [{uniqueId:1}, {uniqueId:2}]
            }
        }
    }
    </script>

条件渲染
`if/elif/else`和`show`

    <template>
        <div class="page">
            <text if="{{n == 1}}">hi 1</text>
            <text elif="{{n == 2}}">hi 2</text>
            <text else>hi 3</text>
            <text show="{{visible}}">nickname</text>
        </div>
    </template>
    <script>
    export default {
        data() {
            return {n: 1, visible: false}
        }
    }
    </script>


    <template>
        <list>
            <block for="cities">
                <list-item type="city">
                    <text>{{$item.name}}</text>
                </list-item>
                <block for="$item.spots" if="false">
                    <list-item type="spot">
                        <text>{{$item.address}}</text>
                    </list-item>
                </block>
            </block>
        </list>
    </template>

    <script>
      module.exports= {
        data: {
          cities: [
            {name:"beijing", spots:[{name:"XXX",address:"XXX"},{name:"XXX",address:"XXX"}]},
            {name:"shanghai", spots:[{name:"XXX",address:"XXX"},{name:"XXX",address:"XXX"}]}
          ]
        }
      }
    </script>

引用自定义组件

    <import name="comp" src="./comp" ></import>
    <template>
        <div>
            <comp prop1="hero" @event1="handler"></comp>
        </div>
    </template>

组件定义  
支持内容分发

    <template>
        <div>
            <text>header</text>
            <slot></slot>
            <text>footer</text>
        </div>
    </template>

样式
---
响应式单位px  
支持sass less  
伪类 :disabled :checked :focus...  
导入样式 
    
        <style src="./foo.css"></style>
        <style>
            @import "./foo.css";
            .aoo {..}
        </style>


脚本
---
引入功能模块 `import fetch from '@system.fetch'` 或全部引入 `import system from '@system'`

+ this.$page page对象
+ this.$app  app对象

页面组件  
+ this.$valid
+ this.$visible

app对象 (this.$app)  
+ this.$app.$def  可以获取app.mix中定义的数据和方法
+ this.$app.$data  app.mix中 config.data 定义的全局数据

page对象 (this.$page)  
+ this.$page == {action, uri, setTitleBar}
+ this.$page.setTitleBar({text, textColor, backgroundColor});

vm对象的方法
+ $set   添加响应式属性。  
必须在 onInit 中调用，如：`this.$set('foo', 'hi');  this.$vm('id').$set('fi', 'fine')`
+ $delete  删除数据属性
+ $element([id]) 获取指定id组件的dom元素
+ $root()  顶层组件的vm
+ $parent() 父组件vm
+ $child(id) 指定id子组件的vm
+ $vm(id) 同$child
+ $forceUpdate() 强制页面刷新   和 $apply 一样的作用?
+ $on(ev, fn)
+ $off(ev, [fn])
+ $dispatch(ev, [data])   ev.stop()
+ $broadcast(ev, [data])
+ $emit(ev, [data])  ev.detail === data
+ $emitElement(ev, [data], [id]) 触发指定元素上的事件 this.$emitElement('submit', {foo: 'ok'}, 'submitBtn')
+ $watch 监听属性变化 this.$watch('a', 'methodName')


组件
---

通用事件  
click longpress focus blur appear disappear

通用属性  
class style id disabled
for if show

通用样式
+ 盒子模型 width height padding margin border
+ 显示 background-image background-color opacity visibility
+ 定位 display  position

transform translateX/Y scaleX/Y rotateX/Y
animation
@keyframes  (background-color  opacity width height transform)

渐变
+ background: linear-gradient(direction, color-stop1, color-stop2...)
+ background: repeating-linear-gradient(direction, color-stop1, color-stop2...)

### 容器组件
+ div  
默认无宽度(*自适应内容宽度，类似inline-block*) 需设置width, 否则 justify-content 无效
+ list[scrollpage  style="columns,flex-direction" onscroll onscrollbotton onscrolltop] scrollTo({index})  
仅支持子组件为 list-item
+ list-item[type style="column-span"]  
相同type的list-item必须具有相同的dom结构，所以内部慎用if/for
+ refresh[offset refreshing style="background-color, progress-color" onrefresh ]  
下拉刷新容器组件
+ richtext[type=html/mix]  
富文本容器
+ stack  
子组件依次堆叠
+ swiper[index auto-play interval indicator style="indicator-color,indicator-selected-color, indicator-size" onchange] swipeTo({index})
+ tabs[index onchange]  
支持子组件  tab-bar tab-content
+ tab-bar[mode=scrollable/fixed style="height"]
+ tab-content

### 基础组件
+ a[href]  
子组件只能为 span
+ image[src alt style="resize-mode:cover/contain/stretch/center"]
+ progress[type=circle/horizontal percent style="color, stroke-width"]
+ span  
文本容器，支持文本相关样式；不支持子组件
+ text[style="lines,text-align,line-height,text-overflow:cilp/ellipsis"]  
文本容器，子组件可以是 a 和 span


### 表单组件
+ input[type="button/checkbox/radio/text/number/password/email/date/time" name value checked placeholder style="placeholder-color, width, height" onchange] focus({focus})
+ label[target]  
表单元素文本标签
+ picker[type="text/date/time" start end range selected value onchange] show()
+ slider[min max step value style="color, selected-color, padding-left, padding-right" onchange]
+ switch[checked onchange]
+ textarea[placeholder style="placeholder-color" onchange] focus()


### 媒体组件
+ video[src poster autoplay onprepare onstart onpause onfinish onerror onseeking onseeked ontimeupdate onfullscreenchange] start() pause() setCurrentTime() requestFullScreen() exitFullScreen()

### 其他组件
+ web[src onpagestart onpagefinish ontitlerecieve onerror] reload() forward() back() canForward() canBack()

接口
---

### 基本功能

获取应用信息

    import app from '@system.app';
    app.getInfo() // => {name, versionName, versionCode, logLevel, source: {packageName, type, extra}}

日志打印

    console.log() // 同chrome
    console.warn();
    console.info();
    console.debug();
    console.error();

页面路由

    import router from '@system.router';
    router.push({uri, params});
    router.replace({uri, params});
    router.back();
    router.clear();
    router.getLength();
    router.getState(); // => {index, name, path}

### 界面交互

分享

    import share from '@system.share';
    share.share({type, data, success, fail, cancel, complete});

弹窗
    
    import prompt from '@system.prompt';
    prompt.showToast({message, duration});
    prompt.showDialog({title, message, buttons, success,..});
    prompt.showContextMenu({itemList, itemColor, success,...});

打开网页

    import webview from '@system.webview';
    webview.loadUrl({url}); // webview跳回当前引用 system.go(path)

通知消息
    
    import notification from '@system.notification';
    notification.show({contentTitle, contentText, clickAction: {uri}});

震动

    import vibrator from '@system.vibrator';
    vibrator.vibrate();

### 网络访问
上传下载

    import request from '@system.request';
    // request.upload({method, url, header, files:[{filename, name, uri, type}], success,..});

    request.load({
        "url": "http://www.example.com",
        "files": [
            {
                "uri": "internal://xxx/xxx/test",
                "name": "file1",
                "filename": "test.png"
            }
        ],
      　success:function(data){console.log("handling success");}
        fail: function(data, code) {
          console.log("handling fail, code=" + code);
        }
    })

    // request.download({url, header, success,...}) // 返回token
    // request.onDownloadComplete({token, success,...}) // 使用token
    request.download({
        "url": "http://www.example.com",
      　 success:function(data){console.log("handling success" + data.token);}
         fail: function(data, code) {
          console.log("handling fail, code=" + code);
         }
    });
    request.onDownloadComplete({
        "token": "123",
      　 success:function(data){
          console.log("handling success" + data.uri);
        },
        fail: function(data, code) {
          console.log("handling fail, code=" + code);
        }
    })


数据请求

    import fetch from '@system.fetch';
    fetch.fetch({url, method, header, data, success,...});

### 数据存储

    import storage from '@system.storage';
    storage.get({key, default, success,...});
    storage.delete({key, default, success,...});
    storage.set({key, value, success,...});
    storage.clear({success,...});

文件

    import file from '@system.file';
    file.move({src, dest, success,...});
    file.copy({src, dest, success,...});
    file.list({uri, success,...});
    file.get({uri, success,...});
    file.delete({uri, success,...});


系统能力

    import barcode from '@system.barcode';
    barcode.scan({success});
    sensor.subscribeAccelerometer({callback})
    sensor.unsubscribeAccelerometer()
    sensor.subscribeCompass({callback});
    sensor.unsubscribeCompass();
    clipboard.set();
    clipboard.get();
    geolocation.getLocation();
    geolocation.subscribe();
    geolocation.unsubscribe();
    shortcute.hasInstalled();
    shortcute.install();
    calendar.insert();
    network.getType();
    network.subscribe();
    network.unsubscribe();
    device.getInfo();
    device.getId();
    media.takePhoto();
    media.takeVideo();
    media.pickImage();
    media.pickVideo();

服务

    import push from '@service.push';
    push.subscribe();
    push.unsubscribe();
    push.on();
    push.off();

    import pay from '@service.pay';
    pay.pay();

    import wxpay from '@service.wxpay';
    wxpay.getType();
    wxpay.pay();

    import alipay from '@service.alipay';
    alipay.pay();

    import share from '@service.share';
    share.share();

