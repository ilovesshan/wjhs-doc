## App开发文档

### 第一章、环境搭建

#### 1、安装AndroidStudio

+ AndroidStudio下载地址：https://developer.android.google.cn/studio/
+ AndroidStudio 安装教程：https://blog.csdn.net/qq_33581509/article/details/116424441

2、安装jdk

+ jdk下载地址：http://www.codebaoku.com/jdk/jdk-oracle-jdk1-8.html
+ jdk安装教程：https://cloud.tencent.com/developer/article/2030453

#### 2、安装flutter

+ flutter官网地址：https://flutter.cn/docs

  

+ 下载flutter以及环境变量配置

  参考地址：https://flutter.cn/docs/get-started/install

  在 Windows 操作系统上安装和配置 Flutter 开发环境：https://flutter.cn/docs/get-started/install/windows#system-requirements，按照官网教程一步一步操作安装即可。

  

+ 请在环境变量中配置镜像源环境变量(否则创建项目可能出错)

  ```
  PUB_HOSTED_URL : https://pub.flutter-io.cn
  FLUTTER_STORAGE_BASE_URL : https://storage.flutter-io.cn
  ```

  

#### 3、测试安装结果

+ 在cmd中输入：` flutter --version` 

  ```
  C:\Users\26659> flutter --version
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║ A new version of Flutter is available!                                     ║
  ║                                                                            ║
  ║ To update to the latest version, run "flutter upgrade".                    ║
  ╚════════════════════════════════════════════════════════════════════════════╝
  
  
  Flutter 2.5.0 • channel stable • https://github.com/flutter/flutter.git
  Framework • revision 4cc385b4b8 (1 year, 3 months ago) • 2021-09-07 23:01:49 -0700
  Engine • revision f0826da7ef
  Tools • Dart 2.14.0
  ```

  

+ 在cmd中输入：` flutter doctor` 

  ```
  C:\Users\26659>flutter doctor
  Doctor summary (to see all details, run flutter doctor -v):
  [√] Flutter (Channel stable, 2.5.0, on Microsoft Windows [Version 10.0.22000.1219], locale zh-CN)
  [√] Android toolchain - develop for Android devices (Android SDK version 32.0.0)
  [√] Chrome - develop for the web
  [√] Android Studio (version 2021.1)
  [√] Android Studio
  [√] IntelliJ IDEA Ultimate Edition (version 2021.3)
  [√] Connected device (2 available)
  ```

  如果发现没有检测通过，可以参考：https://blog.csdn.net/perfee886/article/details/117428725

  

### 第二章、项目初始化

#### 1、创建flutter项目

+ 创建flutter项目参考地址：https://blog.csdn.net/shulianghan/article/details/114069765

+ 补充一点知识：cmd窗口中创建项目

  ```
  flutter create -a java -i kotlin  project_name
  
  # -a java / kotlin  表示Android端使用java/kotlin语言 
  # -i objc / swift 	表示ios端使用objc / swift语言
  
  
  # 默认Android端使用kotlin、ios端使用swift
  flutter create project_name 
  ```

#### 2、运行flutter项目

+ 点击Androidstudio中的运行按钮即可，第一次运行时间可能会较长，等待运行成功之后，看到一个计数器界面就表示运行成功了。

#### 3、Flutter四种工程类型

+ module：Flutter与原生混合开发
+ application：Flutter应用
+ package：纯Dart组件
+ plugin：Flutter插件

#### 4、集成common_utils工具包

+ `common_utils`是本人已经封装好的一个工具类库，可以直接使用(请访问App仓库)

+ 将下载好的`common_utils`文件夹拷贝到当前程序根目录下，然后在根目录下的`pubsub.yml` 文件中引入`common_utils`

  ```yaml
  dependencies:
    flutter:
      sdk: flutter
    # 本地引入 common_utils
    common_utils:
      path: ./common_utils
  ```

  

+ 然后再修改`main.dart` 文件，初始化``common_utils` 库已经提供好的能力。

  ```dart
  import 'package:app/router/router.dart';
  import 'package:common_utils/common_utils.dart';
  import 'package:flutter/material.dart';
  
  void main() {
      runApp(const Application());
  }
  
  class Application extends StatefulWidget {
      const Application({Key? key}) : super(key: key);
  
      @override
      State<Application> createState() => _ApplicationState();
  }
  
  class _ApplicationState extends State<Application> {
      @override
      Widget build(BuildContext context) {
          // 使用 GetMaterialApp
          return GetMaterialApp(
              // APP主题配色方案
              theme: AppInitialize.appTheme(),
              // 路由解决方案(也可自行配置)
              initialRoute: YFRouter.splash,
              getPages: YFRouter.routes(),
              builder: (_, c) {
                  // android状态栏为透明沉浸式
                  AppInitialize.setSystemUiOverlayStyle();
                  // 屏幕适配
                  AppInitialize.initScreenUtil(_);
                  return FlutterEasyLoading(
                      child: GestureDetector(
                          child: c!,
                          // 处理键盘
                          onTap: ()=> AppInitialize.closeKeyBord(context)
                      ),
                  );
              },
          );
      }
  }
  
  ```

  ```dart
  // 路由文件信息(仅供参考)
  class YFRouter {
      static const String splash = "/splash";
      static const String menuContainer = "/menuContainer";
      static const String login = "/login";
  
      static List<GetPage> routes() {
          return [
              GetPage(name: splash, page: () => const SplashPage()),
              GetPage(name: login, page: () => const LoginPage()),
              GetPage(name: menuContainer, page: () => const MenuContainer()),
          ];
      }
  
      static onUnknownRoute() {}
  }
  ```

  