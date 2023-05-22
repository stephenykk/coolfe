# SSL/TLS协议运行机制的概述

[SSL/TLS协议运行机制的概述 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)

## 本地开发环境创建可信任的证书
[5分钟上手：本地开发环境启动HTTPS](https://blog.csdn.net/weixin_34269583/article/details/93164764)

```shell
# 打开 linux bash
# git-bash 下执行openssl有问题，可以试试 cmder, 最好用linux bash 

# 1. 创建自签名的根证书，根证书对任意数量的独立域名的证书进行签名
# 签名就是证明证书的真实性和有效性，证书包含公钥 域名 和 使用者

# 生成一个RSA-2048密钥并将其保存到文件rootCA.key中。
# 此文件将用作生成根SSL证书的密钥。
# 每次使用此特定密钥生成证书时，都会提示您输入一个pass短语
openssl genrsa -des3 -out rootCA.key 2048

# 使用生成的密钥创建新的根SSL证书。将它保存到一个名为rootCA.pem的文件中。
# 本证书有效期为1024天 你可以随意把它改成你想要的天数kk
# x509表示自签名的证书
# 需要输入一些基本信息 Common Name 比较关键，可以先输入 localhost 因为这个是根证书
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem


# 2. 信任根SSL证书
# windows
# win + r , 输入 certlm.msc  (或者 certmgr.msc 用这个好一点)
# 右键 受信任的根证书颁发机构/证书 -- 所有任务 -- 导入 选择上面创建的 rootCA.pem


# 3. 创建域SSL证书
# 现在可以使用根SSL证书专门为位于localhost（或指定的域名 *.hello.com）的本地开发环境颁发证书

# 创建 openssl配置文件 server.csr.cnf 避免在命令行输入的不便

[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
 
[dn]
C=US
ST=RandomState
L=RandomCity
O=RandomOrganization
OU=RandomOrganizationUnit
emailAddress=hello@example.com
CN = localhost

# CN 为common name, 关键参数，指定为证书将使用的域名（最终提供web服务的域名）
# CN = *.hello.com

# 创建一个v3.ext文件以创建一个X509 v3证书。注意这里是如何指定subjectAltName的

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
 
[alt_names]
DNS.1 = localhost

# DNS.1 = *.hello.com


# 使用server.csr.cnf中存储的配置设置为本地主机创建证书密钥。此密钥存储在server.key中
# 创建web服务器的私钥server.key和签名请求server.csr
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <(cat server.csr.cnf)

# 生成域证书
# 用根CA的证书和私钥对签名请求签名
# 需要输入创建 rootCA.key 时设置的密码
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext


```

验证新的SSL证书

```js
var path = require('path')
var fs = require('fs')
var express = require('express')
var https = require('https')
 
var certOptions = {
  key: fs.readFileSync(path.resolve('build/cert/server.key')),
  cert: fs.readFileSync(path.resolve('build/cert/server.crt'))
}
 
var app = express()
 
var server = https.createServer(certOptions, app).listen(443)

```
