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




### 第三章、开发前置说明

请先了解 `common_utils工具包src下的common_utils.dart文件`，里面向外暴露了大量的工具类库。

在之后项目开发过程中，都遵循以下模式，比如：定义实体类、数据字典查询、路由配置等等，如有疑问请参考源码源码。

#### 1、实体类模型

+ 实体类模型：通常情况下我们会将会断返回的数据统一转换成一个 `Model` 实体类保存。json数据和实体类的互相转换在线网站：https://app.quicktype.io/、https://jsontodart.com/

+ 后端返回的格式：

  ```dart
  {
      "id": id,
      "username": username,
      "token": token,
  }
  ```

+ 定义的模型格式

  ```dart
  class UserAuthModel {
      UserAuthModel({
          this.id,
          this.username,
          this.token,
      });
  
      String? id;
      String? username;
      String? token;
  
      factory UserAuthModel.fromJson(Map<String, dynamic> json) => UserAuthModel(
          id: json["id"].toString(),
          username: json["username"].toString(),
          token: json["token"].toString(),
      );
  
      Map<String, dynamic> toJson() => {
          "id": id,
          "username": username,
          "token": token,
      };
  }
  ```

  



#### 2、系统字典

系统字典：在响应的数据中某些字段会返回字典状态码(dictCode)，需要通过数据字典来查询对应状态码的表示值(dictDescribe)。

```json
[
    {
        "id": "538FB84080D24AC9B1904F5270D33C85",
        "dictCode": 20,
        "dictName": "性别状态(xbzt)",
        "dictDescribe": "男",
        "createBy": "admin",
        "createTime": "2022-11-24 10:22:34"
    },
    {
        "id": "9D73A5790DCD4CF2815CF8119976D116",
        "dictCode": 21,
        "dictName": "性别状态(xbzt)",
        "dictDescribe": "女",
        "createBy": "admin",
        "createTime": "2022-11-24 10:22:34"
    },
]
```

```dart
static String? getTextByCode(String code) {
    SystemDictModel dictModel = SharedPreferencesDao.getSystemDict().firstWhere((systemDictModel) => systemDictModel.dictCode == code);
    return TextUtils.isNotValid("${dictModel.dictDescribe}") ? dictModel.dictDescribe : "未知" ;
}
```



#### 3、路由配置

在新建界面之后，都需要在 `YFRouter` 类中进行配置注册，配置方式参考：项目初始化章节。

```dart
// 闪屏
static const String splash = "/splash";
// 主容器布局
static const String menuContainer = "/menuContainer";
// 登录界面
static const String login = "/login";

GetPage(name: menuContainer, page: () => const MenuContainer());
GetPage(name: login, page: () => const LoginPage());
GetPage(name: splash, page: () => const SplashPage());
```



#### 4、API管理

将项目请求API路径进行统一管理，方便维护

```dart
class Apis {
    // 用户授权
    static const String userAuth = "/auth";

    // 获取用户信息
    static const String userinfo = "/users";

    // 获取字典信息
    static const String systemDict = "/systemDict";
}
```



#### 5、静态资源管理

相关的静态资源都放在了根目录`assets`下（文件夹自建），可以将不同的静态资源分文件夹管理，之后需要在根目录 `pubspec.yaml`文件中进行配置

```yaml
flutter:
  uses-material-design: true

  # / 表示可以访问该路径下的全部资源，不包含子级文件夹
  assets:
    - assets/common/
    - assets/images/banner/
    - assets/images/home/
    - assets/images/app_logo/

```



### 第四章、Tabar搭建和登录

#### 1、Tabar搭建

tabbar使用了 `curved_navigation_bar: ^1.0.3` 插件(已经在common_utils集成)，可以直接使用。

+ 先创建四个页面文件，用于承载`首页、分类、订单、 我的` 四个界面，下面创建首页，其他界面相同

  ```dart
  import 'package:flutter/cupertino.dart';
  
  class CategoryPage extends StatefulWidget {
    const CategoryPage({Key? key}) : super(key: key);
  
    @override
    State<CategoryPage> createState() => _AppointmentPageState();
  }
  
  class _AppointmentPageState extends State<CategoryPage> {
    @override
    Widget build(BuildContext context) {
      return const Center(child: Text("CategoryPage"));
    }
  }
  ```

+ 再创建一个 `MenuContainer` 界面，该界面主要作为APP首页的容器，用来承载 `首页、分类、订单、 我的` 四个界面，本质就是通过`Tabar`来控制界面的显示和隐藏。记住需要在路由文件中配置 `MenuContainer` 界面

  ```dart
  static const String menuContainer = "/menuContainer";
  GetPage(name: menuContainer, page: () => const MenuContainer()),
  ```

  

  ```dart
  import 'package:flutter/cupertino.dart';
  import 'package:common_utils/common_utils.dart';
  import 'package:app/view/home/home_page.dart';
  import 'package:app/view/order/order_page.dart';
  import 'package:app/view/profile/profile_page.dart';
  import 'package:app/view/category/category_page.dart';
  import 'package:flutter/material.dart';
  import 'package:flutter/services.dart';
  
  class MenuContainer extends StatefulWidget {
    const MenuContainer({Key? key}) : super(key: key);
  
    @override
    State<MenuContainer> createState() => _MenuContainerState();
  }
  
  class _MenuContainerState extends State<MenuContainer> with SingleTickerProviderStateMixin{
  
    late TabController _tabController;
  
    final List<Widget> _pageList = [
      // 首页
      const HomePage(),
      // 分类
      const CategoryPage(),
      // 订单
      const OrderPage(),
      // 我的
      const ProfilePage(),
    ];
  
     // Tabar 图标
    final List<Icon> _tabBarList = [
      const Icon(Icons.home_outlined, size: 16),
      const Icon(Icons.category_outlined, size: 16),
      const Icon(Icons.list_outlined, size: 16),
      const Icon(Icons.person_outline_outlined, size: 16),
    ];
  
    @override
    void initState() {
      super.initState();
      _tabController = TabController(vsync: this, length: _pageList.length);
    }
  
    @override
    Widget build(BuildContext context) {
      return Scaffold(
        bottomNavigationBar: CurvedNavigationBar(
          backgroundColor: Get.theme.primaryColor,
          height: 49.0,
          items: _tabBarList,
          // 切换界面
          onTap: (index) => _tabController.animateTo(index),
        ),
        body: TabBarView(
          physics: const NeverScrollableScrollPhysics(),
          controller:_tabController,
          children: _pageList,
        ),
      );
    }
  }
  ```

  

#### 2、登录功能

在实现登录功能基础上再实现一个简易的自动登录的功能，自动登录实现原理：在用户第一次登录之后，保存用户的账号密码信息(注意适当情况删除)，再下一次登录的时候可以在闪屏页进行判断，如果存在用户名和密码那么就帮助用户登录一次，如果不存在或者在登录过程中发生异常那就去登录界面。

封装两个类、分别负责请求用户和系统字典相关的请求处理

```dart
import 'package:app/api/apis.dart';
import 'package:app/model/user_auth_model.dart';
import 'package:common_utils/common_utils.dart';

class LoginService {

  // 用户授权
  static Future<UserAuthModel> requestUserAuth(String username, String password) async {
    UserAuthModel userAuthModel = UserAuthModel();
    final result = await HttpHelper.getInstance().post(Apis.userAuth, data:{"username":username, "password": password});
    if(result["code"] == 200){
      userAuthModel = UserAuthModel.fromJson(result["data"]);
    }
    return userAuthModel;
  }


  // 获取用户信息
  static Future<UserInfoModel> requestUserInfo(String userId) async {
    UserInfoModel userInfoModel = UserInfoModel();
    final result = await HttpHelper.getInstance().get("${Apis.userinfo}/$userId");
    if(result["code"] == 200){
      userInfoModel =  UserInfoModel.fromJson(result["data"]);
    }
    return userInfoModel;
  }
}

```

```dart
import 'package:app/api/apis.dart';
import 'package:common_utils/common_utils.dart';

class SystemDictService {

  // 获取数据字典
  static Future<List<SystemDictModel>> requestSystemDict() async {
    List<SystemDictModel> systemDictModels = [];
    final result = await HttpHelper.getInstance().get(Apis.systemDict);
    if(result["code"] == 200){
      for(var json in result["data"]){
        systemDictModels.add(SystemDictModel.fromJson(json));
      }
    }
    return systemDictModels;
  }
}

```



登录的业务逻辑

```dart
import 'package:app/model/user_auth_model.dart';
import 'package:app/router/router.dart';
import 'package:app/service/login_service.dart';
import 'package:app/service/system_dict_service.dart';
import 'package:app/utils/system_dict_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:common_utils/common_utils.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  bool _obscureText = true;

  late TextEditingController _accountController;
  late TextEditingController _passwordController;

  @override
  void initState() {
    super.initState();
    _accountController = TextEditingController(text: "sunlei");
    _passwordController = TextEditingController(text: "sunlei123456!@#");
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: const Color(0xFFFFFFFF), elevation: 0),
      backgroundColor: const Color(0xFFFFFFFF),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 30.w),
            alignment: Alignment.bottomCenter,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: 50.h),
                Image.asset("assets/images/app_logo/logo.png", width: 200.w, height: 200.w),
                SizedBox(height: 100.h),
                Column(
                  children: [
                    // 用户名
                    TextField(controller: _accountController, decoration: InputDecoration(border: const UnderlineInputBorder(), labelText: "用户名", labelStyle: TextStyle(fontSize: 14.sp),)),

                    SizedBox(height: 10.h),

                    // 密码
                    TextField(
                      controller: _passwordController,
                      obscureText: _obscureText,
                      decoration: InputDecoration(border: const UnderlineInputBorder(), labelText: "密码", labelStyle: TextStyle(fontSize: 14.sp), suffix: GestureDetector(
                          child: Icon(_obscureText ? Icons.visibility : Icons.visibility_off, size: 18),
                          onTap: (){_obscureText = !_obscureText;setState(() {});},
                        ),
                      ),
                    ),

                    SizedBox(height: 50.h),

                    // 登录按钮
                    Column(
                      children: [
                        GestureDetector(
                          child: Container(width: Get.width, height: 49.h, alignment: Alignment.center, decoration: BoxDecoration(color: Get.theme.primaryColor, borderRadius: BorderRadius.circular(5.r)), child: Text("账号登录", style: TextStyle(fontSize: 14.sp, color: const Color(0xFFFFFFFF)))),
                          onTap: ()=> loginByAccount(),
                        ),

                        SizedBox(height: 20.h),

                        Container(width: Get.width, height: 26.h, alignment: Alignment.center,
                          child: GestureDetector(child: Text("其他登录方式", style: TextStyle(fontSize: 14.sp, color:  Get.theme.primaryColor)),
                          onTap: ()=> loginByPhone(),
                        )),
                      ],
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// 手机号登录
  loginByPhone() {
    EasyLoading.showToast("功能开发中");
  }

  /// 账户登录
  loginByAccount() async {
    String account  = _accountController.text;
    String password  = _passwordController.text;
    if(TextUtils.isValid(account) || TextUtils.isValid(password)){
      EasyLoading.showToast("账户或密码不能为空");
      return;
    }

    // 用户授权
    final UserAuthModel userAuthModel = await LoginService.requestUserAuth(account, password);
    if(TextUtils.isNotValid(userAuthModel.id.toString())){
      // 获取用户信息
      SharedPreferencesDao.saveToken("${userAuthModel.token}");

      final UserInfoModel userInfoModel = await LoginService.requestUserInfo("${userAuthModel.id}");
      if(TextUtils.isNotValid(userAuthModel.id.toString())){
        // 持久化信息
        SharedPreferencesDao.saveUserInfo(userInfoModel);
        SharedPreferencesDao.saveId("${userAuthModel.id}");
        SharedPreferencesDao.saveUsername(account);
        SharedPreferencesDao.savePassword(password);

        // 做一次权限校验 只允骑手/回收中心用户登录
        if(SystemDictUtil.mobileCanLogin("${userInfoModel.userType}")){
          // 去首页
          Get.offAndToNamed(YFRouter.menuContainer);
        }else{
          // 无权登录
          EasyLoading.showToast("抱歉，您暂无权限登录该平台");
        }
      }
    }else{
      EasyLoading.showToast("用户名或者密码错误");
    }
  }
}
```



#### 3、闪屏页实现自动登录

```dart
import 'dart:math';

import 'package:app/api/apis.dart';
import 'package:app/model/user_auth_model.dart';
import 'package:app/router/router.dart';
import 'package:app/service/login_service.dart';
import 'package:app/service/system_dict_service.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:common_utils/common_utils.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({Key? key}) : super(key: key);

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {

  @override
  void initState() {
    super.initState();
    // 初始化 本地存储工具
    SharedPreferencesUtil.initSharedPreferences();

     Future.delayed( const Duration(milliseconds: 2000),() async {
       // 请求数据字典表
       if(SharedPreferencesDao.getSystemDict().isEmpty){
         final List<SystemDictModel> systemDictModel = await SystemDictService.requestSystemDict();
         SharedPreferencesDao.saveSystemDict(systemDictModel);
       }
       // 判断是否能自动登录
       String username = SharedPreferencesDao.getUsername();
       String password = SharedPreferencesDao.getPassWord();
       if(TextUtils.isNotValid(username) && TextUtils.isNotValid(password)){
         // 实现自动登录功能
         try {
           // 用户授权
           final UserAuthModel userAuthModel = await LoginService.requestUserAuth(username, password);
           if(TextUtils.isNotValid(userAuthModel.id.toString())){
             // 获取用户信息
             final UserInfoModel userInfoModel = await LoginService.requestUserInfo("${userAuthModel.id}");
             if(TextUtils.isNotValid(userAuthModel.id.toString())){
               // 持久化信息
               SharedPreferencesDao.saveUserInfo(userInfoModel);
               SharedPreferencesDao.saveId("${userAuthModel.id}");
               SharedPreferencesDao.saveUsername(username);
               SharedPreferencesDao.savePassword(password);
               SharedPreferencesDao.saveToken("${userAuthModel.token}");
               // 去首页
               Get.offAndToNamed(YFRouter.menuContainer);
             }
           }else{
             Get.offAndToNamed(YFRouter.login);
           }
         } catch (e) {
           Get.offAndToNamed(YFRouter.login);
         }
       }else{
          // 去登录
          Get.offAndToNamed(YFRouter.login);
       }
     });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: const Color(0xFFFFFFFF), elevation: 0),
      backgroundColor: const Color(0xFFFFFFFF),
      body: Container(
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(child:Image.asset("assets/images/app_logo/app-logo.png"),),
            const Text("POWER BY FLUTTER APP", style: TextStyle(color: Color(0xFFb2bec3))),
            SizedBox(height: 100.h)
          ],
        ),
      ),
    );
  }
}
```



### 第五章、轮播图和通知公告

#### 1、Api封装

```dart
import 'package:app/api/apis.dart';
import 'package:app/model/notice_model.dart';
import 'package:common_utils/common_utils.dart';

class NoticeService {
  // 获取公告
  static Future<List<NoticeModel>> requestNotice() async {
    List<NoticeModel> noticeModels = [];
    final result = await HttpHelper.getInstance().get(Apis.notice+"?type=32");
    if (result["code"] == 200) {
      for (var json in result["data"]) {
        noticeModels.add(NoticeModel.fromJson(json));
      }
    }
    return noticeModels;
  }
}

```

```dart
import 'package:app/api/apis.dart';
import 'package:app/model/swiper_model.dart';
import 'package:common_utils/common_utils.dart';

class SwiperService {
  // 获取轮播图
  static Future<List<SwiperModel>> requestSwiper() async {
    List<SwiperModel> swiperModels = [];
    final result = await HttpHelper.getInstance().get(Apis.swiper +"?type=32");
    if (result["code"] == 200) {
      for (var json in result["data"]) {
        swiperModels.add(SwiperModel.fromJson(json));
      }
    }
    return swiperModels;
  }
}
```



#### 2、轮播图通知公告实现

```dart
import 'package:app/model/notice_model.dart';
import 'package:app/model/swiper_model.dart';
import 'package:app/router/router.dart';
import 'package:app/service/notice_service.dart';
import 'package:app/service/swiper_service.dart';
import 'package:common_utils/common_utils.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:amap_flutter_base/amap_flutter_base.dart';


class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with AutomaticKeepAliveClientMixin {

  final List<String> _bannerList = [];

  final List<String> _marqueeTextList = [ ];

  List<SwiperModel> swiperModels = [];
  List<NoticeModel> noticeModels = [];

  @override
  void initState() {
    super.initState();

    _requestHomeData();
  }

  _requestHomeData() async {
     swiperModels = await SwiperService.requestSwiper();
     noticeModels = await NoticeService.requestNotice();

    _bannerList.clear();
    _marqueeTextList.clear();

    for (var swiperModel in swiperModels) {
      _bannerList.add(HttpHelperConfig.serviceList[HttpHelperConfig.selectIndex]+ "${swiperModel.attachment?.url}");
    }
    for (var noticeModel in noticeModels) {
      _marqueeTextList.add("${noticeModel.subTitle}");
    }
    setState(() {});
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      appBar: AppBar(
        elevation: 0, centerTitle: true, toolbarHeight: 49.h, backgroundColor: Get.theme.primaryColor, systemOverlayStyle: const SystemUiOverlayStyle(statusBarIconBrightness: Brightness.light),
        title: const Text("网捷回收", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFFFFFFF))),
        actions: [
          GestureDetector(
            child: Container(
              margin: EdgeInsets.only(right: 10.w),
              child: Image.asset("assets/common/scan.png", width: 25.w, height: 25.w,),
            ),
            onTap: ()=> QrScannerUtil.scan(onScanSuccess: (res){
               if(res.toString().startsWith("http://www.ilovesshan.com/?payId=")){
                 // 处理支付逻辑
                  EasyLoading.showToast(res.toString());
               }else{
                 // 处理其他逻辑
               }
            }),
          )
        ],
      ),
      body: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              // 背景填充
              Container(height: 200.h, width: Get.width, alignment: Alignment.topCenter, child: Container(width:Get.width, height: 80.h, color: Get.theme.primaryColor)),
              // 轮播图模块
              Positioned(
                left: 5.w, right: 5.w,
                child: ClipRRect(borderRadius: BorderRadius.circular(20.r), child: SwiperWidget.build(list: _bannerList, onItemPressed: (index)=>{
                  Get.toNamed(YFRouter.webviewPlugin, arguments: {"path": swiperModels[index].link, "title":swiperModels[index].title})
                }),
              ))
            ],
          ),

          // 公告
          Container(
            margin: EdgeInsets.only(top: 10.h), padding: EdgeInsets.symmetric(horizontal: 10.w), width:Get.width, height: 40.h, color: Colors.white,
            child: Row(
              children: [
                Image.asset("assets/common/notice.png", width: 15.w, height: 15.w,),
                SizedBox(width: 10.h,),
                Expanded(child: Container(alignment: Alignment.center, height: 20.h, child: buildMarqueeWidget(_marqueeTextList, onItemPressed: (index)=>{
                  Get.toNamed(YFRouter.noticeDetail, arguments: {"notice":noticeModels[index]}),
                }))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 保存页面状态
  @override
  bool get wantKeepAlive => true;

  ///上下轮播 安全提示
  Widget buildMarqueeWidget(List<String> loopList, {OnItemPressedWithIndex? onItemPressed}) {
    return MarqueeWidget(
      //子Item构建器
      itemBuilder: (BuildContext context, int index) {
        String itemStr = loopList[index];
        //通常可以是一个 Text文本
        return GestureDetector(
          child: Tooltip(message: itemStr, child: Text(itemStr, overflow: TextOverflow.ellipsis)),
          onTap: ()=> { if(onItemPressed != null)onItemPressed(index)}
        );
      },
      //循环的提示消息数量
      count: loopList.length,
    );
  }
}

```



#### 3、通知详情实现

```dart
import 'package:app/model/notice_model.dart';
import 'package:common_utils/common_utils.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class NoticeDetailPage extends StatefulWidget {
  const NoticeDetailPage({Key? key}) : super(key: key);
  @override
  State<NoticeDetailPage> createState() => _NoticeDetailPageState();
}

class _NoticeDetailPageState extends State<NoticeDetailPage> {
  
  // 仅仅做简单展示
  NoticeModel notice = Get.arguments["notice"];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: NavBar.showWidthPrimaryTheme("${notice.title}"),
      body: Padding(padding: EdgeInsets.all(10.w), child: Text("${notice.subTitle}")),
    );
  }
}

```

