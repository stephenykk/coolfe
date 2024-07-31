# 163邮箱无法发送邮件550错误解决方法

> 原文地址[163邮箱无法发送邮件发生退信问题 550 User has no permission以及554, DT:SPM的解决办法-CSDN博客](https://blog.csdn.net/weixin_38611617/article/details/115999647)

## 前言

 最近项目在做163邮箱转发的时候，发现无法通过163邮箱转发邮件，并会有错误代码的提示，于是在项目里一顿操作，今天分享下这段经验吧。  
 首先163邮箱在无法完成发送时是会有提示的，本人在项目里分别遇到的是550 User has no permission和554, DT:SPM两种错误代码的提示，163邮箱也会提供一个完整的错误代码的对照表来告诉你错误代码的含义，就是下面这个网址：  
[163邮箱退信代码说明](http://help.163.com/09/1224/17/5RAJ4LMH00753VB8.html)  
  

 然后接下来说一下我遇到的两个问题的解决经过。

**1\. 550 User has no permission**  
 首先这个错误代码的意思是我没有用户权限，我一开始猜测是邮箱设置的问题，然后我参考了下面链接里这篇博客。

[邮箱不可用 550 User has no permission](https://blog.csdn.net/hughnes/article/details/52070878)

 这篇博客虽然底下很多人都评论说解决了问题，但是这篇博客已经是好几年前的博客了，我是用的163邮箱的版本根本没有博客中所提到的设置，于是只能自己摸索。最终还是摸索出来了，现在可以进入下图的设置  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210422094248386.png#pic_center)  
 然后开启POP3/[SMTP](https://so.csdn.net/so/search?q=SMTP&spm=1001.2101.3001.7020)服务，开启后会生成一个授权密码，**用那个授权密码代替邮箱密码进行设置**，就可以修复550 User has no permission这个问题了。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210422094454310.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYxMTYxNw==,size_16,color_FFFFFF,t_70#pic_center)  
ps：这个授权码生成后一定要保存好，它生成一次后就不展示了。

  

**2\. 554, DT:SPM**  
 解决完550以后，我这边并没有就一步搞定了，而是又遇到了一个554的问题，我这个554的问题在163的文档里介绍是这样的。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210422095343819.png#pic_center)  
 很头疼，项目里设置的内容感觉是没问题的，但还是被检测说是垃圾邮件，然后我又参考了以下两篇博客。

[smtplib.SMTPDataError: (554, b’DT:SPM的异常](https://blog.csdn.net/mapeifan/article/details/82428493)

[python发送邮件554DT:SPM已解决](https://www.cnblogs.com/NolaLi/p/11098670.html)




## 代码示例
可以成功发送邮件的例子:

```js
const nodemailer = require("nodemailer");

// !!! 用这个配置方式会报错: connect ECONNREFUSED 127.0.0.1:465
// Create a transporter using the Gmail SMTP configuration
// const transporter = nodemailer.createTransport({
//   service: "smtp.163.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "your-email@163.com",
//     pass: "your-password",
//   },
// });

const transporter = nodemailer.createTransport(
  "smtps://stephenykk_pan@163.com:{邮箱开通SMTP服务后生成的授权码}@smtp.163.com"
);

// Compose the email
const mailOptions = {
  from: "stephenykk_pan@163.com",
  to: "your-friend@163.com",
  subject: "Temporary Password",
  text: "Your temporary password is: 123456",
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Error sending email:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});

```


 总结一下就是说在发送的时候也给自己抄送一份就可以不被识别成垃圾邮件，这样也可以解决554, DT:SPM这个错误代码的问题。

ps:其实用了抄送的方法以后也没能够解决554这个问题，但感觉是自己设置的问题，最后一生气换成了QQ邮箱去发送，同样的发送内容QQ邮箱倒是没有识别成垃圾邮件。。。