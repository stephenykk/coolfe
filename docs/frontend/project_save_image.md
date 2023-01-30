前端截屏和保存到相册
===

## 需求
对页面截图，保存到用户相册

## 技术方案
### 截图
**第三方库** 
`html2canvas` `dom-to-image`  

**原理** 
前端的图片处理能力都依赖canvas，前端截屏原理：遍历dom节点，在canvas上绘制一样的UI

**问题** 

1. Canvas也有同源策略限制
     ```js
        const canvas = document.getElementById('mycanvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.src = url // 若图片URL不同源  
        image.onload = function() {
          ctx.drawImage(image, 0, 0) // 可绘制上去
          ctx.toDataURL('image/jpeg') // 导出数据失败，因为不同源
          ctx.toBlob(callback) // 同上
        }
        
        // !!!
        /*
        * 图片默认不受同源策略限制
        * 设置 crossOrigin 后，图片会受同源策略限制，跨域的图片请求，要求服务器返回CORS相关header
        * 通过同源策略校验的图片，绘制到cavas后，canvas可以导出数据
        */
        image.crossOrigin = 'Anonymous' 
     ```
  > 如果canvas数据不需要导出，不需要关心图片是否跨域，都能绘制上去

2. html2canvas不支持把跨域图片绘制出来  
   需求中的背景图是运营后台配置的，不同源；但是该背景图所在的服务器支持CORS，所以可以按照上面示例代码的方式
   得到图片的dataURL, 然后作为图片元素的src，此时，不再是跨域图片，`html2canvas`能绘制出来

### 保存到相册

浏览器环境下，JS没有访问文件系统的能力，需要SDK支持 或 HTML5 download属性

1. A标签download属性   
  钉钉/企微客户端都不可用（*无论是URL还是DataURL*）; 浏览器下可以触发下载弹窗

2. SDK支持  
  - 钉钉有SDK方法 `dd.biz.util.saveImage({image: 'xxx'})`   
    `saveImage({autoCapture: true})` 支持截屏并保存图片，但是只能截取一屏内容，当前需求内容可能超过1屏，因而不可用；      
    `saveImage({image: imageUrl})` 需要传入图片URL，所以需要把canvas导出的二进制数据上传，`yxtbiz-upload-h5`组件已封装上传逻辑，但是只接收file对象参数，所以需要dataURL 转换为 file对象   
      ```js
        // dataUrl like this: data:image/jpg;base64,iVBORw0KGgoA…
        function createFileByDataUrl (dataUrl, fileName) {
          var arr = dataUrl.split(',')
          var mime = arr[0].match(/:(.*?);/)[1]
          var bstr = atob(arr[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          var file = new File([u8arr], fileName, { type: mime })
          // file.lastModifiedDate = new Date()
          console.log('file::', file)
          return file
        }
      ```
3. 直接打开图片，长按保存    
   企微没有SDK方法保存图片，同钉钉上传图片后得到URL， `<a href="imageURL"></a>` 脚本触发一下A标签的点击，并提示长按
4. content-disposition     
   服务端针对图片请求返回header , `content-disposition: attachment;filename=demo.jpg`, 浏览器会触发下载弹窗


