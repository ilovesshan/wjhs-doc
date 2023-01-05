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

+ 下载`JDK`，将`JDK`上传到`linux`目录中或者通过`wget` 下载

+ 解压`JDK`

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

  

#### 3、安装tomcat

+ 通过`wget` 安装 `tomcat8.x`

  `--no-check-certificate` (不检查证书)

  ```shell
  wget https://dlcdn.apache.org/tomcat/tomcat-8/v8.5.84/bin/apache-tomcat-8.5.84.tar.gz --no-check-certificate
  ```

  

+ 解压 `tomcat8.x`

  ```shell
  # 解压
  tar -zxvf ./apache-tomcat-8.5.84.tar.gz
  
  # 重命名
   mv ./apache-tomcat-8.5.84 tomcat8
  ```

+ 开启防火墙端口 `8080`

  ```shell
  firewall-cmd --zone=public --add-port=8080/tcp --permanent
  firewall-cmd --reload
  ```

  

#### 4、安装mysql

+ 查看是否已经安装 `mysql`

  ```shell
  rpm -qa | grep mysql
  ```

  

+ 查看是否安装 `mariadb` ，如果存在就需要卸载(和`mysql`冲突)

  ```shell
  rpm -qa | grep mariadb
  
  # -e 表示卸载，也就是 erase 的首字母。
  # --nodeps 忽略依赖 表示强制卸载
  rpm -e --nodeps mariadb-libs-5.5.41-2.el7_0.x86_64
  ```

+ 通过 `wget`安装 `mysql`或者通过`ftp`工具上传

  ```shell
  # 下载mysql
  wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.31-1.el7.x86_64.rpm-bundle.tar
  
  
  # 创建mysql文件夹，并解压mysql
  mkdir mysql
  cd mysql
  tar -xvf ../mysql-8.0.31-1.el7.x86_64.rpm-bundle.tar 
  ```

  

+ 顺序安装`rpm`安装包（一定要按顺序执行安装！）

  安装 `mysql-community-server` 时需要依赖 `net-tools`工具

  ```shell
  yum -y install net-tools
  ```

  ```shell
  rpm -ivh ./mysql-community-common-8.0.31-1.el7.x86_64.rpm
  
  rpm -ivh ./mysql-community-client-plugins-8.0.31-1.el7.x86_64.rpm
  
  rpm -ivh ./mysql-community-libs-8.0.31-1.el7.x86_64.rpm 
  
  rpm -ivh ./mysql-community-devel-8.0.31-1.el7.x86_64.rpm 
  
  rpm -ivh ./mysql-community-libs-compat-8.0.31-1.el7.x86_64.rpm 
  
  rpm -ivh ./mysql-community-client-8.0.31-1.el7.x86_64.rpm
  
  rpm -ivh ./mysql-community-icu-data-files-8.0.31-1.el7.x86_64.rpm 
  
  rpm -ivh ./mysql-community-server-8.0.31-1.el7.x86_64.rpm
  ```

  

+ 启动 `mysql`服务

  `mysql`安装完成之后，会自动注册为系统的服务，服务名为mysqld

  ```shell
  # 查看mysql服务状态
  systemctl status mysqld
  
  # 启动mysql服务
  systemctl start mysqld	
  
  # 停止mysql服务
  systemctl stop mysqld
  
  # 设置开机时启动mysql服务，避免每次开机启动mysql
  systemctl enable mysqld
  ```

  

+ 登录  `mysql`

  查看mysql默认密码

  ```shell
  cat /var/log/mysqld.log | grep password
  ```

  

  登录`mysql`并修改密码

  ```mysql
  # 登录mysql
  mysql -p root -p RGEkxsN==5at
  
  # 进来之后执行其他命令会报错，系统会提示：需要先设置新密码才能执行其他操作，先将密码改成root
  # 如果是8.x会报错 ERROR 1819 (HY000): Your password does not satisfy the current policy requirements
  alter user 'root'@'localhost' Identified BY 'root';
  
  # 决绝方案：临时更换一个密码强度较高的字符串
  # mysql密码长度默认是8，最少需要8位
  # mysql密码策略是MEDIUM， 表示验证长度、数字、大小写、特殊字符
  alter user 'root'@'localhost' Identified BY 'Root123456!';
  
  # 查看 mysql 初始的密码策略 可以参考https://developer.aliyun.com/article/811640
  show variables like 'validate_password%';
  +--------------------------------------+-------+
  | Variable_name                        | Value |
  +--------------------------------------+-------+
  | validate_password.check_user_name    | ON    |
  | validate_password.dictionary_file    |       |
  | validate_password.length             | 8     |
  | validate_password.mixed_case_count   | 1     |
  | validate_password.number_count       | 1     |
  | validate_password.policy             | MEDIUM|
  | validate_password.special_char_count | 1     |
  +--------------------------------------+-------+
  
  
  # 修改策略(0表示LOW)
  set global validate.password_policy = 0;
  
  # 修改密码长度
  set global validate_password.length = 4;
  
  # 修改了策略和密码长度之后，可以再次修改密码
  alter user 'root'@'localhost' Identified BY 'root';
  
  # 退出在重新登录就ok了
  ```

  

+ `redis` 服务开启外网访问

  ```shell
  firewall-cmd --zone=public --add-port=3306/tcp --permanent
  firewall-cmd --reload
  ```

+ 用户和权限管理 参考：https://blog.csdn.net/lu1171901273/article/details/91635417

  新建用户

  ```mysql
  # CREATE USER 'username'@'host' IDENTIFIED BY 'password';
  
  CREATE USER 'ilovesshan'@'%' IDENTIFIED BY '123456';
  ```

  授权

  ```mysql
  # GRANT privileges ON databasename.tablename TO 'username'@'host'
  GRANT SELECT on wjhs.* TO 'ilovesshan'@'%';
  ```

  撤销权限

  ```mysql
  # REVOKE privilege ON databasename.tablename FROM 'username'@'host';
  REVOKE SELECT on wjhs.* FROM 'ilovesshan'@'%';
  ```

  刷新权限(每次修改都需要重新刷新权限)

  ```mysql
  flush privileges;
  ```

  

#### 5、安装redis

+  安装`gcc`

  ```shell
  yum install gcc-c++
  ```

  

+ 安装 `redis`

  ```shell
  wget http://download.redis.io/releases/redis-6.0.16.tar.gz
  ```

  

+ 解压 `redis`

  ```shell
  tar -zxvf ./redis6.0.16.tar.gz 
  ```

  

+ 进入`redis`目录并执行`make`命令编译

  ```shell
  cd redis6.0.16
  make
  ```

   如果执行make命令报错

  ```shell
  # 先查看当前的gcc版本，查看gcc的版本是否在 5.3以上
  gcc -v
  
  # 如果当前的gcc版本不是5.3以上，执行下面命令更新gcc版本，升级到 5.3及以上版本
  yum -y install centos-release-scl
  yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
  scl enable devtoolset-9 bash
   
  ```

  

+ `redis` 服务开启外网访问

  开启防火墙端口 `6379`

  ```shell
  firewall-cmd --zone=public --add-port=6379/tcp --permanent
  firewall-cmd --reload
  ```

  编辑 `redis.conf`文件

  ```shell
  vim  /home/env/redis-6.0.16/redis.conf
  
  # 注释 bind 127.0.0.1 或者改成 bind 0.0.0.0
  # bind 127.0.0.1
  
  # 关闭保护模式，这样外网可以访问到，将protected-mode no 替换成 protected-mode yes
  protected-mode no
  
  # 设置Redis密码 
  requirepass yourPassword
  ```

  

+ 设置`redis` 自动后台运行

  ```shell
  # 修改redis.conf文件，将 daemonize no 替换成 daemonize yes
  vim  /home/env/redis-6.0.16/redis.conf
  
  # 命令行模式下输入: /daemonize no 直接查找然后修改
  ```

  

+ 启动 `redis` 服务端

  ```shell
  cd /home/env/redis-6.0.16/src
  redis-server ../redis.conf
  ```

  

+ 启动 `redis` 客户端

  ```shell
  cd /home/env/redis-6.0.16/src
  redis-server ../redis.conf
  
  # 执行 ping 如果返回 PONG 就表示安装成功了
  127.0.0.1:6379> ping
  PONG
  ```

  
