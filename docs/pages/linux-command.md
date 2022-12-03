## Linux常用命令

### 解压和压缩

#### 1、tar

+ 打包和压缩

  打包：将多个文件(夹)打包成一个文件

  压缩：通过某种算法将大文件压缩成一个小文件

  

+ 常用命令

  ```shell
  # 打包并压缩  xxx -> xxx.tar.gz
  tar -zcvf ./xxx.tar.gz ./xxx
  
  # 解压缩并解包  xxx.tar.gz -> xxx
  tar -zxvf  ./xxx.tar.gz
  
  # 打包  xxx -> xxx.tar
  tar -cvf ./xxx.tar ./xxx
  
  # 解包  xxx.tar -> xxx
  tar -xvf  ./xxx.tar
  ```

  命令含义：

  - -z 通过gzip进行压缩或者解压缩
  - -c --create  打包
  - -x --extract 解包
  - -f --file 要操作的文件名
  - -v --verbose 显示tar处理的文件信息的过程
  - -C 解压文件至指定的目录

#### 2、zip、unzip

+ zip 打包

  ```shell
  # 打包  xxx -> xxx.tar
  zip -r ./xxx.zip ./xxx
  ```

  

+ unzip 解包

  ```shell
  # 解包  xxx.tar -> xxx
  unzip ./xxx.tar
  ```

  命令含义：

  + -c 递归压缩目录



### 防火墙和端口

#### 1、防火墙的相关命令

```shell
# 开机启用防火墙
systemctl enable firewalld.service

# 开机禁用防火墙
systemctl disable firewalld.service

# 启动防火墙
systemctl start firewalld

# 关闭防火墙
systemctl stop firewalld

# 检查防火墙状态
systemctl status firewalld
```



#### 2、使用firewall-cmd配置端口

```shell
# 查看防火墙状态
firewall-cmd --state

# 重新加载配置
firewall-cmd --reload

# 查看开放的端口
firewall-cmd --list-ports

# 开启防火墙端口(8088)
firewall-cmd --zone=public --add-port=8080/tcp --permanent

# 关闭防火墙端口(8088)
firewall-cmd --zone=public --remove-port=8080/tcp --permanent
```

注意：添加端口后，必须用命令`firewall-cmd --reload`重新加载一遍才会生效

命令含义：

- –zone  作用域
- –add-port=9200/tcp  添加端口，格式为：端口/通讯协议
- –permanent  永久生效，没有此参数重启后失效

### 软件安装

#### 1、安装宝塔

+ 宝塔官网地址：https://www.bt.cn/new/index.html

  

+ Centos安装脚本。

  ```shell
  yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
  ```

  

+ Ubuntu/Deepin安装脚本。

  ```shell
  wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
  ```

  

+ 安装过程需要等待一会、看到以下信息表示安装成功，要记住宝塔内外网面板地址和账号密码，后面登录宝塔面板会用到。

  ```shell
  外网面板地址: http://124.222.244.61:8888/31dc0a89
  内网面板地址: http://124.222.244.61:8888/31dc0a89
  username: dsqgjgyk
  password: 966d859f
  ```

  

+ 如果忘记密码可以使用 `bt` 命令，进行相关操作。

  ```shell
  ===============宝塔面板命令行==================
  (1) 重启面板服务           (8) 改面板端口
  (2) 停止面板服务           (9) 清除面板缓存
  (3) 启动面板服务           (10) 清除登录限制
  (4) 重载面板服务
  (5) 修改面板密码           (12) 取消域名绑定限制
  (6) 修改面板用户名         (13) 取消IP访问限制
  (7) 强制修改MySQL密码      (14) 查看面板默认信息
  (22) 显示面板错误日志      (15) 清理系统垃圾
  (23) 关闭BasicAuth认证     (16) 修复面板(检查错误并更新面板文件到最新版)
  (24) 关闭动态口令认证          (17) 设置日志切割是否压缩
  (25) 设置是否保存文件历史副本  (18) 设置是否自动备份面板
  (0) 取消                   (29) 取消访问设备验证
  ===============================================
  请输入命令编号：
  ```

  

#### 2、安装JDK

+ 下载JDK，将JDK上传到linux目录中

+ 解压JDK

  ```shell
  # 解压
  tar -zxvf jdk-8u141-linux-x64 .tar.gz
  
  # 重命名
  mv ./jdk-8u141-linux-x64 .tar.gz ./jdk8
  ```

  

+ 编辑配置文件，添加环境变量

  ```shell
  # 使用vim编辑 profile文件
  vim /etc/profile
  
  # 配置环境变量 /opt/software/jdk11是JDK所在目录
  export JAVA_HOME=/opt/software/jdk11
  export PATH=$JAVA_HOME/bin:$PATH
  ```

  

+ 更新配置文件

  ```shell
  source /etc/profile
  ```

  

+ 查看安装情况

  ```java
  [root@localhost ~]# java -version
  java version "1.8.0_121"
  Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
  Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)
  ```

  

