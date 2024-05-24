# web二进制数据的互相转换

> 原文地址[web二进制（string ----＞ Blob -----＞ (ArrayBuffer 、DataURL、ObjectURL、Text)相互转换）_string arraybuffer-CSDN博客](https://blog.csdn.net/hbiao68/article/details/123094909)

#### 文章目录

-   [一、文章参考](#_3)
-   [二、常见对象](#_6)
-   -   [2.1 存放数据的容器：ArrayBuffer（字节）](#21_ArrayBuffer_11)
    -   -   [2.1.1 概念](#211__13)
        -   [2.1.2 构造函数 new ArrayBuffer(length)](#212__new_ArrayBufferlength_21)
        -   [2.1.3 操作二进制数据的工具：DataView& TypedArray](#213_DataView_TypedArray_28)
        -   -   [2.1.3.1 TypedArray](#2131_TypedArray_32)
            -   [2.1.3.2 DataView 读写多种数值类型](#2132_DataView__58)
        -   [2.1.4 案例](#214__101)
    -   [2.2 Blob](#22_Blob_157)
    -   -   [2.2.1 概念](#221__159)
        -   [2.2.2 构造函数 Blob( array, options )](#222__Blob_array_options__164)
        -   [2.2.3 属性](#223__169)
        -   [2.2.4 方法](#224__175)
        -   [与 FileReader 的 readAsText() 的区别](#_FileReader__readAsText__193)
        -   [2.2.5 应用场景](#225__198)
    -   [2.3 FileReader](#23_FileReader_211)
    -   -   [2.3.1 概念](#231__212)
        -   [2.3.2 构造方法 new FileReader()](#232__new_FileReader_215)
        -   [2.3.3 属性](#233__218)
        -   [2.3.4 事件处理](#234__233)
        -   [2.3.5 方法](#235__244)
        -   [2.3.6 案例](#236__257)
    -   [2.4 File](#24_File_389)
    -   -   [2.4.1 概念](#241__391)
        -   [2.4.2 来源](#242__395)
        -   [2.4.3 构造函数 new File(bits, name\[, options\]);](#243__new_Filebits_name_options_400)
        -   [2.4.4 属性](#244__416)
    -   [2.5 DataURL](#25_DataURL_428)
    -   -   [2.5.1 FileReader.readAsDataURL(blob);](#251_FileReaderreadAsDataURLblob_430)
        -   [2.5.1个人理解](#251_433)
        -   [2.5.1数据案例](#251_436)
        -   [2.5.1Base64](#251Base64_439)
    -   [2.6 ObjectURL](#26_ObjectURL_450)
    -   -   [2.6.1 URL.createObjectURL() 静态方法](#261_URLcreateObjectURL__451)
        -   [2.6.1 URL](#261_URL_462)
        -   -   [2.6.2.1 概念](#2621__465)
            -   [2.6.2.2 构造函数 new URL(url, \[base\])](#2622__new_URLurl_base_468)
            -   [2.6.2.3 属性](#2623__473)
            -   [2.6.2.4 方法](#2624__491)
            -   [2.6.2.5 静态方法](#2625__498)
            -   [2.6.2.6 字符串转为Blob对象实现文件下载（因为Blob可以转为ObjectURL）](#2626_BlobBlobObjectURL_509)
-   [三、Canvas 保存图片](#Canvas__545)
-   -   [3.1 canvas.toDataURL('image/png')](#31_canvastoDataURLimagepng_546)
    -   [3.2 canvas.toDataURL('image/jpeg', quality)](#32_canvastoDataURLimagejpeg_quality_550)
    -   [3.3 canvas.toBlob(callback, type, encoderOptions)](#33_canvastoBlobcallback_type_encoderOptions_553)
-   [四、createObjectURL()和readAsDataURL()的区别](#createObjectURLreadAsDataURL_556)
-   -   [4.1 差异](#41__557)
    -   [4.2 使用区别](#42__567)
    -   [4.3 经验案例](#43__583)
-   [五、总结： 各种数据类型相互转换思路](#__586)

## 一、文章参考

1.  [玩转前端二进制](https://blog.csdn.net/qiwoo_weekly/article/details/107218381)

## 二、常见对象

![在这里插入图片描述](https://img-blog.csdnimg.cn/e76c1284a1d64edf89a969aa8232cbfa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6IOW6bmFNjg=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 2.1 存放数据的容器：[ArrayBuffer](https://so.csdn.net/so/search?q=ArrayBuffer&spm=1001.2101.3001.7020)（字节）

#### 2.1.1 概念

ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。

它是一个字节数组，通常在其他语言中称为“byte array”。

`你不能直接操作 ArrayBuffer 的内容，而是要通过 TypedArray 或 DataView 对象来操作`，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

#### 2.1.2 构造函数 new ArrayBuffer(length)

-   参数 length
    -   要创建的 ArrayBuffer 的大小，单位为字节。
-   返回值
    -   一个指定大小的 ArrayBuffer 对象，其内容被初始化为 0

#### 2.1.3 操作二进制数据的工具：DataView& TypedArray

Arraybuffer 中的内容是不能直接操作的，需要通过 TypedArray 和 DataView 对象来操作

##### 2.1.3.1 TypedArray

-   概念
    
    -   TypedArray 是一个接口，js 中是没有名为 TypedArray 的对象的
    -   对象描述了描述了一个底层的二进制数据缓冲区（binary data buffer）的一个类数组视图（view）
-   实现函数
    

| 函数名 | 解释 |
| --- | --- |
| new Int8Array(); |  |
| new Uint8Array(); |  |
| new Uint8ClampedArray(); |  |
| new Int16Array(); |  |
| new Uint16Array(); |  |
| new Int32Array(); |  |
| new Uint32Array(); |  |
| new Float32Array(); |  |
| new Float64Array(); |  |

-   个人理解
    -   ArrayBuffer定义的是一个字节（8bit）
    -   TypedArray的实现函数则是对ArrayBuffer中的二进制的bit位做如何解析
        -   比如解析1个字节，则是8bit, 使用Int8Array
        -   比如解析2个字节，则是16bit，使用 Int16Array

##### 2.1.3.2 DataView 读写多种数值类型

-   概念  
    DataView 视图是一个可以从 二进制ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序问题。
    
-   构造函数 DataView(buffer \[, byteOffset \[, byteLength\]\])
    
    -   参数 buffer
        -   一个 已经存在的ArrayBuffer 或 SharedArrayBuffer 对象，DataView 对象的数据源。
    -   byteOffset 可选
        -   此 DataView 对象的第一个字节在 buffer 中的`字节偏移`。如果未指定，则默认从第一个字节开始。
    -   byteLength 可选
        -   此 DataView 对象的`字节长度`。如果未指定，这个视图的长度将匹配buffer的长度。
    -   返回值
        -   一个表示指定数据缓存区的新DataView 对象。（这句话也许不是非常有助于说明清楚）
        -   可以把返回的对象想象成一个二进制字节缓存区 array buffer 的“解释器”——它知道如何在读取或写入时正确地转换字节码。这意味着它能在二进制层面处理整数与浮点转化、字节顺序等其他有关的细节问题。

读 函数

| 函数 | 说明 |
| --- | --- |
| DataView.prototype.getInt8() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个8-bit数(一个字节). |
| DataView.prototype.getUint8() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个8-bit数(无符号字节). |
| DataView.prototype.getInt16() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个16-bit数(短整型). |
| DataView.prototype.getUint16() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个16-bit数(无符号短整型). |
| DataView.prototype.getInt32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个32-bit数(长整型). |
| DataView.prototype.getUint32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个32-bit数(无符号长整型). |
| DataView.prototype.getFloat32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个32-bit数(浮点型). |
| DataView.prototype.getFloat64() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个64-bit数(双精度浮点型). |

写 函数

| 函数 | 说明 |
| --- | --- |
| DataView.prototype.setInt8() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个8-bit数(一个字节). |
| DataView.prototype.setUint8() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个8-bit数(无符号字节). |
| DataView.prototype.setInt16() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个16-bit数(短整型). |
| DataView.prototype.setUint16() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个16-bit数(无符号短整型). |
| DataView.prototype.setInt32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个32-bit数(长整型). |
| DataView.prototype.setUint32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个32-bit数(无符号长整型). |
| DataView.prototype.setFloat32() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个32-bit数(浮点型). |
| DataView.prototype.setFloat64() | 从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个64-bit数(双精度浮点型). |

#### 2.1.4 案例

1.  TypedArray 相同内存不同类型读取结果不一致

```js
'use strict';
// ArrayBuffer 不能直接操作，需要 DataView或者 TypeArray
const buffer = new ArrayBuffer(8);
// 8个字节的ArrayBuffer, 8 * 8 = 64 个bit位
console.log(buffer.byteLength); // 8

const int8Array = new Int8Array(buffer);
// 元素长度 1 个字节，占用 8 位
console.log(int8Array.length);

const int16Array = new Int16Array(buffer);
// 元素长度 2 个字节，占用 4 位
console.log(int16Array.length); // 4
12345678910111213
```

2.  DataView 自由读取多种数值类型

```js
'use strict';
// ArrayBuffer 不能直接操作，需要 DataView或者 TypeArray
// 创建2 个字节的ArrayBuffer
const buffer = new ArrayBuffer(2);

console.log(buffer.byteLength);

const dataView = new DataView(buffer);
dataView.setInt8(0, 1); // 设置第一个字节 为1，即 00000001 （二进制）
dataView.setInt8(1, 2); // 设置第二个字节 为2，即 00000010 （二进制）

console.log(dataView.getInt8(0)); // 1, asscii 码值
console.log(dataView.getInt8(1)); // 2, asscii 码值

// 去两个字节的值 258
// 00000001 00000010 (二进制)
console.log(dataView.getInt16(0));

// DataView 和 TypeArray 内部引用了buffer
console.log(dataView.buffer === buffer);
1234567891011121314151617181920
```

3.  UTF8转Base64(编码转换)

```js
'use strict';
const { Buffer } = require('buffer');

// 默认是 UTF8 编码
console.log(new Buffer.from('黄彪').toString('base64')); // 6buE5b2q

console.log(new Buffer.from('6buE5b2q', 'base64').toString()); // 黄彪
1234567
```

### 2.2 Blob

#### 2.2.1 概念

Blob 对象表示一个不可变、原始数据的类文件对象。  
Blob 表示的不一定是JavaScript原生格式的数据  
`Blob是用来支持文件操作的`

#### 2.2.2 构造函数 Blob( array, options )

-   array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。
-   options 是一个可选的BlobPropertyBag字典，它可能会指定如下两个属性：
    -   type，默认值为 “”，它代表了将会被放入到blob中的数组内容的MIME类型。
    -   endings，默认值为"transparent"，用于指定包含行结束符\\n的字符串如何被写入。 它是以下两个值中的一个： “native”，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 “transparent”，代表会保持blob中保存的结束符不变

#### 2.2.3 属性

-   Blob.size 只读  
    Blob 对象中所包含数据的大小（字节）。
-   Blob.type 只读  
    一个字符串，表明该 Blob 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。

#### 2.2.4 方法

-   Blob.slice(\[start\[, end\[, contentType\]\]\])  
    返回一个新的 Blob 对象，包含了源 Blob 对象中指定范围内的数据。
-   Blob.stream()  
    返回一个能读取blob内容的 ReadableStream。
-   Blob.text()
    -   功能: 返回一个promise且包含blob所有内容的UTF-8格式的 USVString。
    -   语法

```js
var textPromise = blob.text();
blob.text().then(text => /* 执行的操作…… */);
var text = await blob.text();
123
```

-   Blob.arrayBuffer()  
    返回一个promise且包含blob所有内容的二进制格式的 ArrayBuffer

#### 与 [FileReader](https://so.csdn.net/so/search?q=FileReader&spm=1001.2101.3001.7020) 的 readAsText() 的区别

Blob.text() 返回的是一个 promise 对象，而 FileReader.readAsText() 是一个基于事件的 API。  
Blob.text() 总是使用 UTF-8 进行编码，而 FileReader.readAsText() 可以使用不同编码方式，取决于 blob 的类型和一个指定的编码名称。

#### 2.2.5 应用场景

1.  文件下载

> 通过URL.[createObjectURL](https://so.csdn.net/so/search?q=createObjectURL&spm=1001.2101.3001.7020)(blob)生成的Blob URL,赋值给a.download属性

2.  图片展示

> 通过URL.createObjectURL(blob)生成的Blob URL,赋值给img.src属性

3.  分片上传

> 通过blob.slice可以分割二进制数据为子Blob上传

4.  本地读取文件

> Filereader的API可以将Blob或File转化为文件ArrayBuffer/DataURL

### 2.3 FileReader

#### 2.3.1 概念

允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据

#### 2.3.2 构造方法 new FileReader()

没有参数

#### 2.3.3 属性

-   FileReader.error 只读  
    一个DOMException，表示在读取文件时发生的错误 。
-   FileReader.readyState 只读  
    表示FileReader状态的数字。取值如下：

| 值 | value | 说明 |
| --- | --- | --- |
| EMPTY | 0 | 还没有加载任何数据 |
| LOADING | 1 | 数据正在被加载 |
| DONE | 2 | 已完成全部的读取请求 |

-   FileReader.result 只读  
    文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

#### 2.3.4 事件处理

| 事件名 | 说明 |
| --- | --- |
| FileReader.onabort | 处理abort事件。该事件在读取操作被中断时触发。 |
| FileReader.onerror | 处理error事件。该事件在读取操作发生错误时触发。 |
| FileReader.onload | 处理load事件。该事件在读取操作完成时触发。 |
| FileReader.onloadstart | 处理loadstart事件。该事件在读取操作开始时触发。 |
| FileReader.onloadend | 处理loadend事件。该事件在读取操作结束时（要么成功，要么失败）触发。 |
| FileReader.onprogress | 处理progress事件。该事件在读取Blob时触发。 |

#### 2.3.5 方法

| 函数名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| FileReader.abort() | 中止读取操作。在返回时，readyState属性为DONE。 |  |  |
| FileReader.readAsArrayBuffer() | 开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象. |  | result 属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据 |
| FileReader.readAsBinaryString() | 开始读取指定的Blob中的内容。一旦完成，result属性中将包含所读取文件的原始二进制数据。 |  |  |
| FileReader.readAsDataURL(blob) | 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。 | Blob类型 或 File类型 | result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容 |
| FileReader.readAsText(blob\[, encoding\]) | 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。这个方法是异步的，也就是说，只有当执行完成后才能够查看到结果，如果直接查看是无结果的，并返回undefined | blob Blob类型 或 File类型；encoding传入一个字符串类型的编码类型，如缺省，则默认为“utf-8”类型 |  |

#### 2.3.6 案例

1.  预览选中的图片

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" onchange="previewFile()">
    <img src="" alt="">
  </body>
  <script>
    function previewFile() {
      var preview = document.querySelector("img");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();

      reader.addEventListener("load",
        function() {
          console.log(arguments)
          debugger
          preview.src = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  </script>
</html>
1234567891011121314151617181920212223242526272829303132
```

2.  读取本地txt文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="file" id='upload' />
</body>
<script>
  
document.getElementById('upload').addEventListener('change', function (e) {
    var file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const result = reader.result;
        debugger
        console.log(result);
    }
    reader.readAsText(file);
}, false);

</script>
</html>
12345678910111213141516171819202122232425
```

3.  `Blob串转 ArrayBuffer、String、DataURL、ObjectURL`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
  <script>
    const jsonData = { name: "huangbiao", age: 32 };
    let jsonStr = JSON.stringify(jsonData);
    console.log(jsonStr);
    // 字符串 转为 Blob 对象
    let blob = new Blob([jsonStr], { type: "application/json" });
    console.log("blob.size", blob.size);

    function readBlob(blob, type) {
      return new Promise(function (resolve) {
        let reader = new FileReader();
        reader.onload = function (event) {
          console.log(event);
          resolve(event.target.result);
        };
        switch (type) {
          case "ArrayBuffer":
            // FileReader 将 Blob 转为 ArrayBuffer 对象（即Buffer对象）
            reader.readAsArrayBuffer(blob);
            break;
          case "DataURL":
            // FileReader 将 Blob 转为 Base64字符串
            reader.readAsDataURL(blob);
            break;
          case "Text":
            // FileReader 将 Blob 转为 文本，并且是以UTF8编码的形式
            reader.readAsText(blob, "utf-8");
            break;
          case "ObjectURL":
            // FileReader 将 Blob 转为 ObjectURL对象（一个路径指向文件）
            const objectURL = URL.createObjectURL(blob)
            resolve(objectURL);
            break;
          default:
            break;
        }
      });
    }

    readBlob(blob ,'ArrayBuffer').then(result => {
      console.log('ArrayBuffer',result);
    })
    readBlob(blob ,'DataURL').then(result => {
      console.log('DataURL',result);
    })
    readBlob(blob ,'Text').then(result => {
      console.log('Text',result);
    })
    readBlob(blob ,'ObjectURL').then(result => {
      console.log('ObjectURL',result);
    })
  </script>
</html>
1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162
```

### 2.4 File

#### 2.4.1 概念

-   File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
-   `File对象可以看作一种特殊的Blob对象`

#### 2.4.2 来源

-   File 对象是来自用户在一个 元素上选择文件后返回的 FileList 对象
-   也可以是来自由拖放操作生成的 DataTransfer 对象
-   或者来自 HTMLCanvasElement 上的 mozGetAsFile() API

#### 2.4.3 构造函数 new File(bits, name\[, options\]);

-   bits  
    一个包含ArrayBuffer，ArrayBufferView，Blob，或者 DOMString 对象的 Array — 或者任何这些对象的组合。这是 UTF-8 编码的文件内容。
-   name  
    USVString，表示文件名称，或者文件路径。
-   options 可选  
    选项对象，包含文件的可选属性  
    type: DOMString，表示将要放到文件中的内容的 MIME 类型。默认值为 “” 。  
    lastModified: 数值，表示文件最后修改时间的 Unix 时间戳（毫秒）。默认值为 Date.now()。

```js
var file = new File(["foo"], "foo.txt", {
  type: "text/plain",
});
123
```

#### 2.4.4 属性

File 接口也继承了 Blob 接口的属性：

| 属性名 | 是否只读 | 说明 |
| --- | --- | --- |
| File.lastModified | 只读 | 返回当前 File 对象所引用文件最后修改时间，自 UNIX 时间起始值（1970年1月1日 00:00:00 UTC）以来的毫秒数。 |
| File.lastModifiedDate | 只读 | 返回当前 File 对象所引用文件最后修改时间的 Date 对象。 |
| File.name | 只读 | 返回当前 File 对象所引用文件的名字。 |
| File.size | 只读 | 返回文件的大小。 |
| File.webkitRelativePath | 只读 | 返回 File 相关的 path 或 URL。 |
| File.type | 只读 | 返回文件的 多用途互联网邮件扩展类型（MIME Type） |

### 2.5 DataURL

#### 2.5.1 FileReader.readAsDataURL(blob);

包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。

#### 2.5.1个人理解

就是base64的字符串编码，前面的“data:”格式固定

#### 2.5.1数据案例

> data:application/json;base64,eyJuYW1lIjoiaHVhbmdiaWFvIiwiYWdlIjozMn0=

#### 2.5.1Base64

-   atob() 解码
    -   a 代表 ASCII，而 b 代表 Blob，即二进制
    -   表示 ASCII 到二进制
    -   对应的是解码操作
-   btoa() 编码
    -   a 代表 ASCII，而 b 代表 Blob，即二进制
    -   二进制到 ASCII
    -   对应的是编码操作

### 2.6 ObjectURL

#### 2.6.1 URL.createObjectURL() 静态方法

-   语法  
    objectURL = URL.createObjectURL(object);
-   参数 object  
    用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。​
-   返回值 objectURL  
    一个DOMString包含了一个对象URL，该URL可用于指定源 object的内容。  
    **这个新的URL 对象表示指定的 File 对象或 Blob 对象。**  
    个人理解：`一个类似于URL的地址，代表一个File对象（文件） 或则 Blob 对象（数据在内存中）`

#### 2.6.1 URL

参考 [URL MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

##### 2.6.2.1 概念

URL接口用于解析，构造，规范化和编码 URLs。  
个人理解：按照规范方便解析URL地址，通过方法获取对应的属性（例如地址、端口、协议、参数等），而不是人为的去解析字符串

##### 2.6.2.2 构造函数 new URL(url, \[base\])

url  
是一个表示绝对或相对 URL 的 DOMString。如果url 是相对 URL，则会将 base 用作基准 URL。如果 url 是绝对URL，则将忽略 base，无论是否有给出。  
base 可选  
是一个表示基准 URL 的 DOMString，在 url 是相对 URL 时，它才会起效。如果未指定，则默认为 ‘’。

##### 2.6.2.3 属性

| 属性 | 说明 |
| --- | :-- |
| hash | 包含’#'的USVString，后跟URL的片段标识符。 |
| host | 一个USVString，其中包含域（即主机名），后跟（如果指定了端口）“：”和URL的端口。 |
| hostname | 包含 URL 域名的 USVString。 |
| href | 包含完整 URL 的 USVString。 |
| origin 只读 | 返回一个包含协议名、域名和端口号的 USVString。 |
| password | 包含在域名前面指定的密码的 USVString 。 |
| pathname | 以 ‘/’ 起头紧跟着 URL 文件路径的 DOMString。 |
| port | 包含 URL 端口号的 USVString。 |
| protocol | 包含 URL 协议名的 USVString，末尾带 ‘:’。 |
| search | 一个USVString ，指示URL的参数字符串； 如果提供了任何参数，则此字符串包括所有参数，并以开头的“？”开头 字符。 |
| searchParams 只读 | URLSearchParams对象，可用于访问search中找到的各个查询参数。 |
| username | 包含在域名前面指定的用户名的 USVString。 |

##### 2.6.2.4 方法

| 方法名 | 说明 |
| --- | --- |
| toString() | 返回包含整个URL的USVString。 它是URL.href的同义词，尽管它不能用于修改值。 |
| toJSON() | 返回包含整个URL的USVString。 它返回与href属性相同的字符串。 |

##### 2.6.2.5 静态方法

| 方法名 | 参数 | 说明 |
| --- | --- | --- |
| URL.createObjectURL(object); | 用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。​ | 返回一个DOMString ，包含一个唯一的blob链接（该链接协议为以blob:，后跟唯一标识浏览器中的对象的掩码）。 |
| revokeObjectURL() |  | 销毁之前使用URL.createObjectURL()方法创建的URL实例。 |

**createObjectURL 内存管理**  
在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。`当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放`。  
浏览器在 document 卸载的时候，会自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。

##### 2.6.2.6 字符串转为Blob对象实现文件下载（因为Blob可以转为ObjectURL）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <button onclick="download()">下载</button>
  </body>
  <script>
    // 利用 ObjectURL 路径来实现下载
    function download() {
      const jsonData = { name: "huangbiao", age: 32 };
      let jsonStr = JSON.stringify(jsonData);

      const blob = new Blob([jsonStr], {type: 'application/json'})
      const objectURL = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.download = 'hello.json'
      a.rel = 'noopener'
      a.href = objectURL
      // a.dispatchEvent(new MouseEvent('click'))
      a.click()
      URL.revokeObjectURL(objectURL)
    }
  </script>
</html>
123456789101112131415161718192021222324252627282930
```

## 三、Canvas 保存图片

### 3.1 canvas.toDataURL(‘image/png’)

默认设定。创建一个PNG图片。  
Default setting. Creates a PNG image.

### 3.2 canvas.toDataURL(‘image/jpeg’, quality)

创建一个JPG图片。你可以有选择地提供从0到1的品质量，1表示最好品质，0基本不被辨析但有比较小的文件大小。

### 3.3 canvas.toBlob(callback, type, encoderOptions)

这个创建了一个在画布中的代表图片的Blob对像。

## 四、createObjectURL()和readAsDataURL()的区别

### 4.1 差异

| 属性 | FileReader.readAsDataURL(file) | URL.createObjectURL(file) |
| --- | :-- | :-- |
| 返回值 | 得到一段data:base64的字符串 | 得到当前文件的一个内存URL |
| 内存使用 | **返回值是转化后的超长base64字符串(长度与要解析的文件大小正相关)并会比blob url消耗更多内存**，但是在不用的时候会自动从内存中清除（通过垃圾回收机制） | createObjectURL返回一段带hash的url，并且一直存储在内存中，直到document触发了unload事件（例如：document close）或者执行revokeObjectURL来释放。 |
| 内存清理 | 依照JS垃圾回收机制自动从内存中清理 | 存在于当前doucment内，清除方式只有unload()事件或revokeObjectURL()手动清除 |
| 执行机制 | 异步执行 | 同步执行 |
| 其他 | 当多个文件同时处理时，需要每一个文件对应一个新的FileReader对象 | 依次返回无影响 |
| 兼容性 | ie10以上的浏览器 | ie10以上的浏览器 |

### 4.2 使用区别

1.  FileReader 与 file 对象

```js
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = ()=>{
     console.log(reader.result);
}
12345
```

备注： `file 是一种特殊的 Blob 对象`

2.  URL.createObjectURL 与 Blob对象

```js
const blobUrl = URL.createObjectURL(blob);
1
```

### 4.3 经验案例

如果下载的文件比较大，就不太适用于`readAsDataURL`，当超过浏览器使用内存时，就出现内存溢出，而且效率比较低。

## 五、总结： 各种数据类型相互转换思路

1.  `string ----> Blob -----> (ArrayBuffer 、DataURL、ObjectURL、Text)` 因此可以实现文本的文件下载
2.  ObjectURL 可以实现 文件下载
3.  DataURL 实际上是 Base64 可以作为图片显示
4.  canvase 可以转为 DataURL / ObjectURL，因此可以实现下载
5.  `file ----> Blob ----> Text`因此可以实现读取本地文件，转为文本展示出来