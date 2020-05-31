# h5 notes

## FormData

XMLHttpRequest Level 2 添加了一个新的接口——FormData。利用 FormData 对象，我们可以通过 JavaScript 用一些键值对来模拟一系列表单控件，我们还可以使用 XMLHttpRequest 的 send() 方法来异步的提交表单。

与普通的 Ajax 相比，使用 FormData 的最大优点就是我们可以异步上传二进制文件。

### 创建 FormData 对象

```js
var formData = new FormData();
// 字段的值可以是一个 Blob 对象，File对象或者字符串，剩下其他类型的值都会被自动转换成字符串
formData.append("name", "sandy");
formData.append("pwd", 123);
formData.append("upfile", fileEle.files[0]);
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://a.com/test.php");
xhr.send(formData);
```

### 使用 HTML 表单来初始化一个 FormData 对象

可以用一个已有的 form 元素来初始化 FormData 对象，只需要把这个 form 元素作为参数传入 FormData 构造函数即可：

```js
var formData = new FormData(document.getElementById("myform"));
// 可以通过这种方式添加一些不想让用户编辑的固定字段,然后再发送.
formData.append("other", "some data");
var xhr = new XMLHttpRequest();
xhr.open("POST", "test.php");
xhr.send(formData);
```

### 使用 FormData 对象发送文件

```html
<form enctype="multipart/form-data" method="post" name="fileInfo">
  <label>email:</label>
  <input
    type="email"
    autocomplete="on"
    autofocus
    name="userEmail"
    required
    size="30"
    maxlength="12"
  />
  <label>file field:</label>
  <input type="text" name="fileField" size="12" maxlength="20" />
  <label>file:</label>
  <input type="file" name="upfile" required />
</form>
<div id="output"></div>
<a href="javascript: sendForm();">upload file</a>
<script>
  function sendForm() {
    var output = document.querySelector("#output");
    var formData = new FormData(document.forms.namedItem("fileInfo"));
    formData.append("customField", "extra data");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "test.php");
    xhr.onload = function () {
      if (xhr.status == 200) {
        output.innerHTML = "uploaded!!";
      } else {
        output.innerHTML = "Error:" + xhr.status;
      }
    };
    xhr.send(formData);
  }

  // 还可以不借助 HTML 表单，直接向 FormData 对象中添加一个 File 对象或者一个 Blob 对象：

  formData.append("myfile", myBlob, "myfile.txt");
</script>
```

## XMLHttpRequest

构造函数初始化一个 XMLHttpRequest 对象 `var xhr = new XMLHttpRequest()`

### 属性

- onreadystatechange
  当 readyState 属性改变时的回调
- readyState - 0 UNOPEN 未打开 - 1 OPENED 未发送 - 2 HEADERS_RECIEVED 收到响应头 - 3 LOADING 接收响应体 - 4 DONE 完成
- response
  响应体的类型(由 responseType 指定)
- responseType
  期望的响应类型，arrayBuffer, blob, json, document, text
- responseText
- responseXML
- status
- statusText
- upload
  可添加监听事件，跟踪上传过程
- withCredentials
  跨域时，带上 cookie

### 方法

- xhr.abort()
  终止请求
- xhr.getAllResponseHeaders()
- xhr.getResponseHeader(header)
- xhr.open(method, url, async, user, pwd)
- xhr.overrideMimeType(mime)
  重写服务器返回的 Mine-type, 需在 xhr.send() 之前，调用
- xhr.send(data)
- xhr.setRequestHeader(header, value)
  自定义请求头，需在 xhr.open() 之后，调用

---

HTML5 新版本特性

- 淘汰过时的或冗余的属性
- 脱离 Flash 和 Silverlight 直接在浏览器中显示图形或动画 (`canvas` `audio` `video`)
- 对本地离线存储的更好的支持 (`Indexed DB` 本地存储功能 , `localStorage`, `sessionStorage`)
- 新的特殊内容元素，比如 `article` `footer` `header` `nav` `section`
- 新的表单控件，比如 `calendar` `date` `time` `email` `url` `search`
- 一个 HTML5 文档到另一个文档间的拖放功能
- 提供外部应用和浏览器内部数据之间的开放接口
