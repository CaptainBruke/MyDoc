

# MyDoc
文档信息、笔记管理  
ASP.NET Core 3.1 + EF Core + UEditor + JQuery  
用于个人在线文档，包含登录、笔记本管理、笔记添加、修改、删除等功能  

### 预览
> 演示环境：
  Web：[http://120.25.76.97:83/](http://120.25.76.97:83/) （账号：test 密码：123456）  或者自行注册，邀请码:MyDoc  
  环境：CentOs + docker + mysql  
  配置：单核、2G内存、1M带宽  
  

### 项目构建[源码方式]
1. 准备一个mysql数据库，使用[Bruke.EntityFrameWork]项目下面sql,创建一个数据库。
2. 修改[MyDoc]项目下,appsettings.Development.json中的连接字符串(参考appsettings.Example.json)。 **[必须]**

### 项目构建[镜像方式]
此方式，只需有安装Linux内核版本的docker即可。比如Win10下，装过Docker Desktop [Window10 Docker安装地址](https://www.docker.com/products/docker-desktop)。比如在CentOS安装Docker,[Linux Docker安装教程](https://www.cnblogs.com/kingsonfu/p/11576797.html)。  
安装Mysql后，创建mydoc数据库，脚本如下：
[sql脚本-mydoc.sql](Bruke.EntityFrameWork/mydoc.sql)

#### 一、在Window下运行。
1. 打开cmd 输入 `docker pull registry.cn-shenzhen.aliyuncs.com/bruke123/mydoc:4`回车后拉去最新镜像。
2. 选择一个合适的文件夹，比如D:\Mydoc\,并在Mydoc文件夹下创建一个空文件夹`upload`,在Mydoc文件夹下创建一个文件`appsettings.json`,appsettings.json的内容如下，请把下面的数据库连接和密码，改为你的数据库连接和密码：
```
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "mydoc": "Server=120.*5.**.97;Database=mydoc;Uid=root;Pwd=*32***;pooling=false;charset=utf8"
  }
}
```
3.运行并挂载配置文件夹。CMD命令如下(有问题的话，检查挂载路径)：  
`docker run --name mydoc -p 8080:80 -v D:\Mydoc\appsettings.json:/app/appsettings.json -v D:\Mydoc\upload:/app/wwwroot/upload -d  registry.cn-shenzhen.aliyuncs.com/bruke123/mydoc:4`  
浏览器访问：http://localhost:8080/

#### 二、在Linux下运行。
1. `docker pull registry.cn-shenzhen.aliyuncs.com/bruke123/mydoc:4`回车后拉去最新镜像。
2. 选择一个合适的文件夹，比如`/opt/docker-mydoc/wwwroot/`,（没有文件夹的，自行创建文件夹）,并在`/opt/docker-mydoc`文件夹下创建一个文件`appsettings.json`,appsettings.json的内容如下，请把下面的数据库连接和密码，改为你的数据库连接和密码：
```
和【一、Window下运行】章节的appsettings.json一样的
```
3.运行并挂载配置文件夹。命令如下：  
```
docker run --restart=always --name mydoc -p 83:80 -v /opt/docker-mydoc/appsettings.json:/app/appsettings.json -v /opt/docker-mydoc/wwwroot/upload:/app/wwwroot/upload -d registry.cn-shenzhen.aliyuncs.com/bruke123/mydoc:4
```  
浏览器访问：http://[你的IP地址]:83/

### 知识点
> * [ASP.NET Core入门](https://docs.microsoft.com/zh-cn/aspnet/core/getting-started/?view=aspnetcore-2.2&tabs=windows)  
ASP.NET Core入门必备。
> * [EF Core入门](https://docs.microsoft.com/zh-cn/ef/core/get-started/)  
搭配上ASP.NET Core入门，这两个文档涵盖了项目中所有的知识点：面向接口编程，依赖注入，异步编程等。
> * [AutoMapper](https://automapper.readthedocs.io/en/latest/)  
对象的映射工具。
> * [Pomelo.EntityFrameworkCore.MySql](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql)  
EF Core的MySQL提供程序。
> * [Docker](https://docs.docker.com/)
Docker 更快捷发布

### 一些截图
![alt 登录](https://gitee.com/CaptainBruke/my-doc/raw/master/login.png)  
![alt 主界面](https://gitee.com/CaptainBruke/my-doc/raw/master/index.png)  


### 特别感谢
> * 感谢 [小飞象](https://gitee.com/yfq2010/login-register-html)漂亮好用的登录注册界面
> * 感谢[暮光：城中城](https://gitee.com/zyplayer/swagger-mg-ui?_from=gitee_search)漂亮好用的树型目录

### 后期计划：
> * 使用EF Code First 无需使用sql进行创建数据库
> * ASP.Net 3.1 升级为 .Net 5
> * 项目镜像打包到阿里镜像仓库，一句docker pull,docker run 即可搭建MyDoc  (已完成)2021-7-27
> * 支持代码高亮显示，默认配置为js,css,C#,java,SQL等语法高亮，背景色为深色(已完成)2021-8-2
> * 代码高亮语法语言可配置化，代码背景色可配置化。
> * 使用docker-compose:数据库+项目，真正一套龙服务。只需copy一个文件到服务器，在服务器执行这个文件即可完成整个项目的搭建。

