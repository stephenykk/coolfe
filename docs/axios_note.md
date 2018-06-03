axios notes
=============

axios 的特点

+ 可用于浏览器端发起ajax请求
+ 可用于node.js中，发起请求; *类似request or http.request*
+ 支持promise接口
+ request and response拦截器
+ 转换 request and response data
+ 可取消请求
+ 自动转换json数据
+ 在浏览器端防范 XSRF(*跨站请求伪造*)


使用示例
---------

    //> get 请求
    axios.get('/user?id=12')
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    // 同上
    axios.get('/user', {params: {id: 12}})
            .then(function(res) { console.log(res); })
            .catch(function(err) { console.log(err)});

    //> post 请求
    axios.post('/user',  {fname: 'lin', lname: 'sindy'})
            .then(function(res) { console.log(res); })
            .catch(function(err) { console.log(err); });


    // 同时发起多个ajax请求
    function getUserAccount() {
        return axios.get('/user/123'); // promise
    }

    function getUserPermissions() {
        return axios.get('/user/123/permissions'); // promise
    }

    axios.all([getUserAccount(), getUserPermissions()])
            .then(axios.spread(function(acc, perms) {
                // do sth..
            }));


axios api
-----------

### axios(config)

    axios({
        method: 'post',
        url: '/user/123',
        data: {
            fname: 'sindy',
            lname: 'lin'
        }
    });


### axios(url, [config])

    axios('/user/123', {method: 'get', data: {...}});

### http动词别名方法

+ axios.request(config);
+ axios.get(url, [config]);
+ axios.delete(url, [config]);
+ axios.head(url, [config]);
+ axios.post(url, [data], [config]);
+ axios.put(url, [data], [config]);
+ axios.patch(url, [data], [config]);

### 并行的ajax请求

    axios.all(promises);
    axios.spread(callback);

### axios instance
可以创建包含预定义配置的axios实例.

    // myAxios = axios.create(config);
    myAxios = axios.create({
        baseURL: 'http://example.com/api/',
        timeout: 1000,
        headers: {
            'X-Custom-Header': 'hello'
        }
    });

axios实例(*myAxios*)具有和axios相同的别名方法, 如: `myAxios.get(url, config)`, 实例方法的config会和实例化时传入的config 合并.


request config
----------------
`config`对象，只有 `url`选项是必须的，`method` 默认为 *get*

    {
        url: '/user',
        method: 'get',
        baseURL: 'http://example.com/api/'  // 若url非绝对url, 则会在其前面加 baseURL
        transformRequest: [function(data) {// 转换请求体的数据, PUT POST, PATCH方法时适用
            // do sth with the data return string or buffer
        }],
        transformResponse: [function(data) {// 允许在响应数据返回给 then/catch 前，修改它
            // do sth with response data
        }],
        headers: {// 可添加自定义请求头
            'X-Request-With': 'XMLHttpRequest'
        },
        params: {// url参数，需传plain object or URLSearchParam obj
            id: 123
        },
        paramsSerializer: function(params) {
            return Qs.stringify(params, {arrayFormat: 'brackets'})
        },
        data: {// 请求体 string, plain Object, URLSearchParams, ArrayBuffer, FormData, File, Blob, Stream
            fname: 'lin',
            lname: 'sindy'
        },
        timeout: 1000,
        withCredentials: false, // 跨域ajax时，是否带上cookie
        adapter: function(config) {// 自定义请求处理器，让测试更容易
            //..
        },
        auth: {// http访问权限控制
            username: 'sindy',
            password: 'helloworld'
        },
        responseType: 'json'// 服务器响应的数据类型 arrayBuffer, blob, document, json, text, stream
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        onUploadProgress: function(progressEvent) {
            // do sth
        },
        onDownloadProgress: function(progressEvent) {
            // do sth
        },
        maxContentLength: 2000,
        validateStatus: function(status) {
            return status >= 200 && status < 300;
        },
        maxRedireccts: 5, // node.js only
        httpAgent: new http.Agent({keepAlive: true}),
        httpsAgent: new https.Agent({keepAlive: true}),
        proxy: {
            host: '127.0.0.1',
            port: 9000,
            auth: {
                username: 'sindy',
                password: 'helloworld'
            }
        },
        cancelToken: new CancelToken(function(cancel) {..})
    }


    response shecma
    -------------------

        // axios(config).then(function(response) {...})

        // respose object
        {
            data: {} // 服务端返回的数据
            status: 200,
            statusText: 'OK',
            headers: {}, // 响应头
            config: {}, // request config object
        }


request config 设置默认选项
--------------------------
通过axios设置全局的默认选项

    axios.defaults.baseURL = 'http://example.com/api/';
    axios.defaults.headers.common['Authorization'] = TOKEN;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

设置实例的默认选项

    var myAxios = axios.create({
        baseURL: 'http://bar.com/api/'
    });
    myAxios.defaults.header.common['X-Hello'] = 'test';


config的优先级: `calling config > instance config > global config`

    axios.defaults.timeout = 1000;
    myaxios = axios.create();
    myaxios.defaults.timeout = 2000;
    myaxios.get(url, {timeout: 3000});

拦截器
--------
拦截器可以让我们在 then/catch 之前，做一些处理

    // 请求拦截器
    axios.interceptors.request.use(function(config) {
        // do sth before send request..
        return config;
    }, function(error) {
        // do sth with request error
        return Promise.reject(error);
    });

    // 响应拦截器
    axios.interceptors.response.use(function(response) {
        // do sth with response data;
        return response;
    }, function(error) {
        // do sth with response error
        return Promise.reject(error);
    });


错误处理
----------
`error.response`对象包含 response schema

    axios.get('/user/123').catch(function(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            console.log('Error: ', error.message);
        }

        console.log(error.config); // request config object
    });

自定义哪些status，触发错误回调

    axios.get('/user/123',  {
        validateStatus: function(status) {
            return status < 500;
        }
    });


使用 form-urlencoded 格式的请求体
---------------------
默认地，axios会将data序列化为json; 要序列化为 form-urlencoded 格式，可以这样做:

+ in Browser
            
            // 注 URLSearchParams 不是所有浏览器都支持，需用 polyfill
            var params = new URLSearchParams();
            params.append('param1', 'value1');
            params.append('param2', 'value2');
            axios.post('/some/api', params);

            // 同上 使用 qs库
            var qs = require('qs');
            axios.post('/some/api', qs.stringify({bar: 123}));

+ in Node.js

            var querystring = require('querystring');
            axios.post('/some/api', querystring.stringify({foo: 'bar'}));

