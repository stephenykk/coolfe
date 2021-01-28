# vue-resource

## 安装和使用

    # 安装
    npm install vue-resource --save

    # 使用
    var Vue = require('vue');
    var VueResource = require('vue-resource');
    Vue.use(VueResource);

## 配置

全局配置 http 选项

    Vue.http.options.root = './app';
    Vue.http.headers.common['auth'] = 'secrectkey';

组件配置 http 选项，然后`vm.$http(config)`就会使用这些选项.

    new Vue({
        data: {..},
        methods: {..},
        http: {
            root: '/root',
            headers: {
                autho: 'secrectKey'
            }
        }
    });

### emulateJSON

当 web server 不支持`application/json`的 MIME 类型时，设置`emulateJSON=true`, 可转换为 `application/x-www-form-urlencoded`MIME 类型.

    Vue.http.options.emulateJSON = true;

### emulateHTTP

当 web server 不支持 REST 的各种方法(如: PUT DELETE)时，开启`emulateHTTP=true`会使用 POST 方法去请求，同时添加请求头`X-HTTP-Method-Override`包含实际的请求方法.

    Vue.http.options.emulateHTTP=true;

## Http API

### http 请求

可以通过以下两种方式发送 http 请求:

    Vue.http(options).then(successCb);
    vm.$http(options).then(successCb); //回调中 this指向vm

    var vm = new Vue({
        ready: function(){
            this.$http({url:'/someurl', method:'GET'}).then(function(response){
                //success callback
            }, function(response){
                //error calblack
            });
        }
    });

**response**的属性:

- `data`: Object, String 响应数据
- `ok`: Boolean 请求成功或失败(200-299 表示成功)
- `status`: Number 状态码
- `statusText` String 状态码对应的信息
- `headers` Function 获取 header 的函数
- `request` Object 请求的参数对象 options

### 语法糖方法

    Vue.http.get('/someUrl', [data], [options]).then(successCallback, errorCallback);
    Vue.http.post('/someUrl', [data], [options]).then(successCallback, errorCallback);

    // in a Vue instance
    this.$http.get('/someUrl', [data], [options]).then(successCallback, errorCallback);
    this.$http.post('/someUrl', [data], [options]).then(successCallback, errorCallback);

- `get(url, [data], [options])`
- `post(url, [data], [options])`
- `put(url, [data], [options])`
- `patch(url, [data], [options])`
- `delete(url, [data], [options])`
- `jsonp(url, [data], [options])`

## Options

- url `string` 接口的 url
- method `string` HTTP method (e.g. GET, POST, ...)
- data `Object`, `string` 发送的请求数据
- params `Object` url 参数
- headers `Object` 附加的请求头
- xhr `Object` Parameters object to be set on the [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object
- upload `Object` Parameters object to be set on the [XHR.upload](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload) property
- jsonp `string` JSONP 请求的回调函数名 `jsonp:foo => api?hello=hi&foo=_jsonptz98mt7uxhddncc`
- timeout `number` 设置多少毫秒超时
- beforeSend `function(request)` 发送请求前的钩子 可以修改 request 对象,再发出请求
- emulateHTTP `boolean` Send PUT, PATCH and DELETE requests with a HTTP POST and set the `X-HTTP-Method-Override` header
- emulateJSON `boolean` Send request data as `application/x-www-form-urlencoded` content type

### 示例

    new Vue({
        ready: function() {
          // GET request
          this.$http.get('/someUrl').then(function (response) {
              // get status
              response.status;
              // get all headers
              response.headers();
              // get 'expires' header
              response.headers('expires');
              // set data on vm
              this.$set('someData', response.data)
          }, function (response) {
              // error callback
          });
        }
    })

### 拦截器

    Vue.http.interceptors.push({
        request: function (request) {
            return request;
        },

        response: function (response) {
            return response;
        }

    });



    //参数可以是返回拦截器的工厂函数
    Vue.http.interceptors.push(function () {
        return {

            request: function (request) {
                return request;
            },

            response: function (response) {
                return response;
            }

        };
    });

## Resource API

    Vue.resource(url, [params], [actions], [options]);
    vm.$resource(url, [params], [actions], [options]);

默认的 actions:

- get: {method: 'GET'},
- save: {method: 'POST'},
- query: {method: 'GET'},
- update: {method: 'PUT'},
- remove: {method: 'DELETE'},
- delete: {method: 'DELETE'}

### 示例

    new Vue({
        ready: function() {
          var resource = this.$resource('someItem{/id}');
          // get item
          resource.get({id: 1}).then(function (response) {
              this.$set('item', response.item)
          });
          // save item
          resource.save({id: 1}, {item: this.item}).then(function (response) {
              // success callback
          }, function (response) {
              // error callback
          });
          // delete item
          resource.delete({id: 1}).then(function (response) {
              // success callback
          }, function (response) {
              // error callback
          });
        }
    });
