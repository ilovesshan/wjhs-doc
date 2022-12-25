## App开发文档

### 一、集成common_utils

+ `common_utils`是本人已经封装好的一个工具类库，可以直接使用([common_utils仓库](https://github.com/ilovesshan/flutter-common-utils))

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
      static const String login = "/login";
      static const String menuContainer = "/menuContainer";
  
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



### 二、Android通信通道

本项目暂时涉及：flutter端调用原生Android端(Java)

#### 1、flutter端代码

```dart
class NoticeChannel {
	
  // 通道名称
  static const String _noticeChannelName = "wjhs/noticeChannel";

  static MethodChannel? _batteryChannel;

  static void initChannels() {
    _batteryChannel = const MethodChannel(_noticeChannelName);
  }

  static void notice() async {
    try {
      // showNotice 是一个名称， 原生端是需要通过识别这个名称进行对应业务处理
      await _batteryChannel!.invokeMethod("showNotice");
    } on PlatformException catch (e) {
      printLog(StackTrace.current, e);
    }
  }
}
```

```dart
// 请在合适时机初始化
NoticeChannel.initChannels();

// 调用原生能力
NoticeChannel.notice();
```



#### 2、Android端代码

```xml
<uses-permission android:name="android.permission.VIBRATE" />
```

```java
// 通道常量类
public class ChannelConstant {
    public static final String NOTICE_CHANNEL_NAME = "wjhs/noticeChannel";
    public static final String NOTICE_CHANNEL_METHOD_KEY = "showNotice";
}
```

```java
public class MediaUtil {

    /**
     * 播放系统声音
     */
    public static void play_voice(Context context) {
        // 初始化 系统声音
        RingtoneManager rm = new RingtoneManager(context);
        // 获取系统声音路径
        Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        // 通过Uri 来获取提示音的实例对象
        Ringtone mRingtone = RingtoneManager.getRingtone(context, uri);
        // 播放:
        mRingtone.play();
    }

    /**
     * 设置振动
     */
    public static void set_vibrator(Context context) {
        // 设置震动
        Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        // 震动时长 ms
        vibrator.vibrate(500);
    }
}
```

```java
public class MainActivity extends FlutterActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 创建通道
        MethodChannel methodChannel = new MethodChannel(getFlutterEngine().getDartExecutor().getBinaryMessenger(), ChannelConstant.NOTICE_CHANNEL_NAME);

        methodChannel.setMethodCallHandler(new MethodChannel.MethodCallHandler() {
            @Override
            public void onMethodCall(@NonNull MethodCall call, @NonNull MethodChannel.Result result) {
                if (call.method.equals(ChannelConstant.NOTICE_CHANNEL_METHOD_KEY)) {
                    // 处理对应业务逻辑
                    // 调用系统提示音和震动
                    MediaUtil.play_voice(getApplicationContext());
                    MediaUtil.set_vibrator(getApplicationContext());
                }
            }
        });
    }
}
```



### 三、极光推送工具

```dart
class JPushUtil {
  static final JPush _jPush = JPush();

  static void initJPush() {
    _jPush.setup(appKey: "******", channel: "theChannel", production: false, debug: true);

    // onReceiveMessage ->  onReceiveNotification ->  onOpenNotification
    try {
      _jPush.addEventHandler(
        onReceiveNotification: (Map<String, dynamic> message) async {
          printLog(StackTrace.current, "flutter onReceiveNotification: $message");
        },

        onOpenNotification: (Map<String, dynamic> message) async {
          printLog(StackTrace.current, "flutter onOpenNotification: $message");
        },

        onReceiveMessage: (Map<String, dynamic> message) async {
          printLog(StackTrace.current, "flutter onReceiveMessage: $message");
        },

        onReceiveNotificationAuthorization: (Map<String, dynamic> message) async {
          printLog(StackTrace.current, "flutter onReceiveNotificationAuthorization: $message");
        },

        onNotifyMessageUnShow: (Map<String, dynamic> message) async {
          printLog(StackTrace.current, "flutter onNotifyMessageUnShow: $message");
        });
    } on PlatformException {
      printLog(StackTrace.current, "flutter PlatformException");
    }
  }
}
```

```dart
// 请在合适时机初始化
JPushUtil.initJPush();
```

