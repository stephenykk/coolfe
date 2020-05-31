# http header notes

## http 缓存简介

网络请求是比较耗时的(_建立 tcp 连接和加载数据_)，如果能重复利用之前获取过的资源，将大大提高性能和用户体验。http 请求指示浏览器何时可以缓存响应，以及缓存多久

## ETag

服务器使用 ETag HTTP 标头传递验证令牌，(如: `ETag: "302F25E3F3463A70411BC626C3506AFF"`), 验证令牌通常是文件内容的哈希或指纹，可以高效地检查文件是否有更新，如果没有更新，则返回 `304 Not Modified` 告诉浏览器可以直接用本地缓存。

若资源之前有响应 ETag 头部，当客户端再次请求该资源时，通过`If-None-Match`头部带上验证令牌，(如: `If-None-Match: "302F25E3F3463A70411BC626C3506AFF"`)，让服务器检查资源是否更新

```js
    if(path === '/js/main.js') {
        let jsCon = fs.readFileSync('./js/main.js', 'utf8');
        response.setHeader('Content-Type', 'application/javascript;charset=utf8');
        let jsMd5 = md5(jsCon);
        response.setHeader('ETag', jsMd5);
        if(request.headers['if-none-match'] === fileMd5) {
            // 文件没更新 返回 304
            response.statusCode = 304
        } else {
            // 有更新，返回文件内容
            response.write(jsCon);
        }
        response.end()
    }

    if(path === '/css/default.css') {
        let cssCon = fs.readFileSync('./css/default.css', 'utf8');
        response.setHeader('Content-Type', 'text/css;charset=utf8');
        response.setHeader('Cache-Control', 'max-age=3000000');
        // default.css在过期之前都直接用缓存版本，不用请求
        response.write(cssCon);
        response.end();
    }
```

## Cache-Control

每个资源都可通过 Cache-Control HTTP 标头定义其缓存策略(_谁在什么条件下可以缓存，缓存多久_)

> 注：Cache-Control 标头是在 HTTP/1.1 规范中定义的，取代了之前用来定义响应缓存策略的标头（例如 Expires）。所有现代浏览器都支持 Cache-Control，因此，使用它就够了。

Cache-Control 的值如下:

- no-cache  
  表示不直接使用本地缓存的资源，如存在 ETag, 通过检查(If-None-Match)，发现资源无更新，可使用本地缓存的资源
- no-store  
  表示本地和中间服务器都不缓存资源，每次都重新从服务器获取资源
- public
  表示响应可以被缓存
- private
  浏览器可以缓存“private”响应，不允许任何中间缓存对其进行缓存
- max-age  
  指定从请求的时间开始，允许获取的响应被重用的最长时间（单位：秒）。例如，`Cache-Control: max-age=30`表示可在接下来的 30 秒直接重用缓存的响应。
  > 对于文件名已带哈希值得静态资源 max-age 可以设置大一点,(如 1 年),当文件改变时，文件名跟着改变，从而实现刷新；html 文件一般不缓存

## Expires

- 以前常用 expires 控制缓存，现在首选`cache-control`;
- 当设置`cache-control: max-age=102039`时，expires 响应头会被忽略
- Expires 响应头指定资源过期时间(如；`Expires: Wed, 21 Oct 2015 07:28:00 GMT`)，过期前可直接用本地缓存的资源

## Last-Modified

表示资源最后修改时间，下次浏览器请求资源时，会发送`If-Modified-Since`头部，服务器检查资源的修改日期，若比传过来的日期大，则重新下载资源，否则返回 304

```php

    /* If-Modified-Since  & Last-Modified */
    $headers = apache_request_headers();
    $file = 'main.js'
    if(isset($headers['If-Modified-Since']) && (strtotime($headers['If-Modified-Since']) == filemtime($file))) {
        header('Last-Modified:' . gmdate('D, d M Y H:i:s', filemtime($file)) . ' GMT', true, 304);
    } else {
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($file)), true, 200);
        $con = file_get_content($file);
        echo $content;
    }
```
