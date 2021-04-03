---
title: DN42 note getting start
date: 2021-03-29 +0800
categories: [dn42]
tags: [dn42,bgp]
---

> from esonhugh
>
> 好久没有更新 blog 有划水之嫌

## 简述

就是完全是在 群友的 ~~怂恿~~ (安利) 之下 进行的.

早在去年 还不知是前年发生的 xx CA 劫持了 github 域名导致 中原一大片的地区没办法访问 github 甚至导入到糟糕的地方. 这一场攻击持续了时常大约 有几个小时. 

看到 某技术群有人 分析说是 [BGP Hijack](https://en.wikipedia.org/wiki/BGP_hijacking). 当时 我还是什么都不懂过的小萌新一只. 看到新名词的时候,特别懵逼这样. 所以后来去查了,看了看大概是个什么东西.就是劫持了路径导致的. 后面也会继续说一点自己的理解.



## 入门 

刚一开始其实我什么也不懂这样..基本都是从注册开始..这里 @moecast 大佬 提供了教程不少的帮助. 我所问的奇怪问题 也得到了一一解答. 非常耐心.

https://lantian.pub/article/modify-website/dn42-experimental-network-2020.lantian/

这份教程非常全面 而且细致入微

这里放上 当时 moecast 提供的入门的材料 .. 基本大变动没有

这里我稍微指出可以几点优化的点 以及配置文件的说明

* 先讲述一个入门注册的时候的坑点. 蓝天大佬也已经提到了一次 PR 只能允许一个 commit 多余的 commit 会被检查拒绝. 而且 需要 squash-my-commits 这个 shell 文件来帮忙 合并 .其原理是 git rebase
  
  * 此外 需要每次修改完毕之后 使用一下 squash-my-commits 再 commit push 如果这里提示你 push 失败就需要 push --force 来强制变更版本
  
  
  
* 可以改进的[地方](https://lantian.pub/article/modify-website/dn42-experimental-network-2020.lantian/#%E9%9A%A7%E9%81%93%E6%90%AD%E5%BB%BA%EF%BC%9AWireGuard) 一打开就是 wireguard 的配置说明. 这里可以使用 wireguard 的一个子命令 然后按照如下方法配置

  * ```conf
    # file should locate at /etc/wireguard/<Your WireGuard interface name>.conf
    [Interface]
    ListenPort = <my ASN last 5 digit>
    PrivateKey = <Your WireGuard Private Key>
    PostUp = ip addr add dev <Your WireGuard interface name> <my dn42 ipv4>/32 peer <your dn42 ipv4>/32
    PostUp = ip addr add dev <Your WireGuard interface name> <my ipv6 link local>/64
    Table = off  # 阻止本地环流

    [Peer]
    PublicKey = <your public key>
    PresharedKey = <optional your preshared key>
    Endpoint = <public domain name or your ip addr>:<my asn last 5 digit>
    AllowedIPs = 0.0.0.0/0, ::/0
    ```

  这里的 my you 定义 和 蓝天老师的定义一致 这里的模版是 参见了 yuuta 的配置模版 

  使用方式是 ``` wg-quick up ``` 就会自动使用这个 profile 来进行 vpn 的配置 ```wg-quick down``` 可以自动 关闭 vpn 

  而蓝天老师的启动方法 是 直接运行 shell 文件就可以

  

* https://dn42.eu/howto/Bird 以及 https://dn42.eu/howto/Bird2 这里配置 bird 文件有点点不完全. 要说明的是 这里贴出来的 profile 代码段直接是复制拷贝进 /etc/bird/bird.conf (具体位置取决于系统) 这里的 profile 需要完全替换 不能保留 或者必须将现有的文档或者资料进行 注释处理 然后根据 自己的配置 经由 上文的指导. 进行 内容的编辑和检查 


* 记得先下载 您的 ROA 文件 ``` curl -sfSLR -o /etc/bird/roa/dn42_roa_bird2_4.conf https://dn42.burble.com/roa/dn42_roa_bird2_4.conf && curl -sfSLR -o /etc/bird/roa/dn42_roa_bird2_6.conf https://dn42.burble.com/roa/dn42_roa_bird2_6.conf && /usr/sbin/birdc configure 1> /dev/null``` 记得处理一下 然后加入  ```  crontab -e ``` 进行计划执行 另外 记得保存的下载地址 记得修改上面的一点提及的 conf 文件中 roa 的地址

  * 加入计划任务的 代码如下

    *  other

      ```
      */15 * * * * curl -sfSLR {-o,-z}/var/lib/bird/bird6_roa_dn42.conf https://dn42.burble.com/roa/dn42_roa_bird1_6.conf && chronic birdc6 configure
      */15 * * * * curl -sfSLR {-o,-z}/var/lib/bird/bird_roa_dn42.conf https://dn42.burble.com/roa/dn42_roa_bird1_4.conf && chronic birdc configure
      ```

      Debian version:

      ```
      */15 * * * * curl -sfSLR -o/var/lib/bird/bird6_roa_dn42.conf -z/var/lib/bird/bird6_roa_dn42.conf https://dn42.burble.com/roa/dn42_roa_bird1_6.conf && /usr/sbin/birdc6 configure
      */15 * * * * curl -sfSLR -o/var/lib/bird/bird_roa_dn42.conf -z/var/lib/bird/bird_roa_dn42.con
      ```
  
* 对了 如果你遇到类似 和你内网的或者公网ip差不多的 可以直接起gre
  
```bash
  ip tunnel add <interface> mode gre local <my Internet ip> remote <his Internet ip> ttl 255
  ip addr add <my dn42 ip>/32 peer <his dn42 ip>/32 dev <interface>
ip addr add <my ipv6 link local>/64 dev <interface>
  ip link set dev <interface> up 
  # my 是指自己的 his 表示你 peer 对方的
```
  记住 这里没有公钥私钥 所以 注意一下几点: 
  
  * 当且仅当 
  
  * 你和对方公网ip 很近 
  
  * 中间 traceroute 直接到对方那里 没有跳转的 
  
    才能用 而且这样起很方便. 因为很近的话 vpn其实没啥必要 直接内网就行（


## 浅谈一些个人的理解

这里的 蓝天老师的教程 以操作顺序为多 

具体的一些抽象的概念没有明说 可能对于一些新手有一点点云里雾里的 或者对新手来说需要进行 谷歌 wiki 等方法才能大概明白

嗯假设你就是电信 你就是 XX电信 去申请一个AS (AT&T 也可以是 一个 AS)

那么 你 作为一个 isp 入网 肯定要公网 ip 段的哇.

就是 和 xx电信 xx联通 xx移动分开给你一个网段.

作为你的 最边界的网关来和别家的人交换路由表, 

以保证你内网 的人可以访问外面的网络.

再说说这里的工具 wireguard 和 bird 

先是一个通过 vpn链接(wireguard)
把世界范围 远距离的目标 连接起来 作为一个网络
这个网络就叫 dn42.(因为我们用的是 ipv4保留地址).
在公网上传输会丢 或者被 运营商干掉 认为你在 搞欺骗  搞中间人.
然后 才是 bird ,
这个的目的是 划分 我们占有的ipv4 保留地址.
分成一个个AS 或者说 小小的局域网.
然后交换 彼此内网的路由表 .
也就是 所谓 BGP 协议的 作用.
而你这台配置的机子扮演的就是 边关的网络路由. 带入一下. 换位思考一下,就不难理解了.  

## 后记

> 说一些好玩的东西

已经玩了两三天了, 从购买 服务器开始 就开始整活了. moecast 就给了我不少帮助, 包括一开始 买国外节点的 VPS 也是他帮忙找的市场情况..虽然最后我还是订了 buyvm 丢在了 Las Vegas 花了 40 块大洋 我直接哭穷.

我对 bgp 的探索才刚刚起步 共勉.

bgp profile 不止那么点功能 还能 调整路由 以达到最优化的目的 而且 bird 比较轻量化 非常利于配置

再贴一贴我的配置吧

```
% Information related to 'aut-num/AS4242422239':
aut-num:            AS4242422239
as-name:            ESONHUGH-AS
admin-c:            ESONHUGH-DN42
tech-c:             ESONHUGH-DN42
mnt-by:             ESONHUGH-MNT
source:             DN42

% Routes for 'AS4242422239':
route4:             172.20.42.192/27

ASN: 4242422239
IPv4(Public): kali.esonhugh.me
ServerLocation: LasVegas
IPv4: 172.20.42.193
(Wireguard) PublicKey: mhfs7l/jBO7jqxaPUhf9R1+3U7c683ptoxplGt1zQAM=
```

