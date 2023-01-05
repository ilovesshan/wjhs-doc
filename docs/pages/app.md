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

#### 1、原生通知和震动能力

flutter端调用原生Android端(Java)

+ flutter端代码

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

  

+ Android端代码

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

  

#### 2、验证码自动填充

+ flutter端代码

  `SmsReceiveUtil`工具类

  ```dart
  
  import 'dart:async';
  import 'dart:convert';
  
  import 'package:common_utils/common_utils.dart';
  import 'package:flutter/services.dart';
  
  typedef OnSmsReceived = void Function(Map<String, String> payload);
  
  class SmsReceivedListener {
      OnSmsReceived onSmsReceived;
  
      SmsReceivedListener({required this.onSmsReceived});
  }
  
  class SmsReceiveUtil {
      static const MethodChannel _channel = MethodChannel("wjhs/smsReceiveChannel");
      static const String _channelTag = "wjhs/smsReceiveChannel";
      static late SmsReceivedListener _smsReceivedListener;
  
      static Future<String?> get platformVersion async {
          final String? version = await _channel.invokeMethod('getPlatformVersion');
          return version;
      }
  
      static init() {
          printLog(StackTrace.current, "flutter 注册回调, 开始监听短信验证码发送...");
          const MethodChannel(_channelTag).setMethodCallHandler(_platformCallHandler);
      }
  
      static Future<dynamic> _platformCallHandler(MethodCall call) async {
          try {
              if (_smsReceivedListener != null) {
                  Map<String, String> smsMap = {
                      "senderPhone": jsonDecode(call.arguments)["senderPhone"],
                      "receiveMessage": jsonDecode(call.arguments)["receiveMessage"],
                  };
                  _smsReceivedListener.onSmsReceived(smsMap);
              }
          } catch (e) {
              printLog(StackTrace.current, e);
          }
      }
  
      static void setListener(SmsReceivedListener smsReceivedListener) {
          _smsReceivedListener = smsReceivedListener;
      }
  }
  
  ```

  ```dart
  
  // 初始化 SmsReceivePlugin
  SmsReceiveUtil.init();
  
  
  // 监听短信验证码
  SmsReceiveUtil.setListener(SmsReceivedListener(onSmsReceived: (Map<String,String> payload) {
      // 发件人手机号码
      final senderPhone = payload["senderPhone"];
      // 短信内容
      final receiveMessage = payload["receiveMessage"];
  }));
  ```

  

+ Android端代码

  实现思路：通过广播来监听短信，然后通过`MethodChanel` 将短信信息通知给 `flutter`

  ```xml
  <uses-permission android:name="android.permission.RECEIVE_SMS" />
  <uses-permission android:name="android.permission.READ_SMS" />
  ```

  ```java
  <receiver android:name=".receiver.SmsReceiver" />
  ```

  ```java
  public class Sms {
      private String senderPhone;
      private StringBuilder receiveMessage;
      // getter、setter、constructor 省略...
  }
  ```

  ```java
  public class ChannelConstant {
      public static final String RECEIVE_CHANNEL_NAME = "wjhs/smsReceiveChannel";
      public static final String RECEIVE_CHANNEL_METHOD_KEY = "smsReceive";
  }
  ```

  

  ```java
  public class PermissionUtils {
      public static final int REQUEST_CODE = 0;
  
  
      // Android6.0之后 需要动态获取权限
      public static void checkPermission(Activity activity, String[] permissions) {
          if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
              for (String permission : permissions) {
                  if (ActivityCompat.checkSelfPermission(activity, permission) != PackageManager.PERMISSION_GRANTED) {
                      ActivityCompat.requestPermissions(activity, new String[]{permission}, REQUEST_CODE);
                  }
              }
          }
      }
  }
  ```

  

  ```java
  /**
  * 监听短信验证码
  */
  public class SmsReceiver extends BroadcastReceiver {
      private static final String TAG = "SmsReceiver";
  
      OnSmsResultReceivedListener onSmsResultReceivedListener;
  
      @RequiresApi(api = Build.VERSION_CODES.M)
      @Override
      public void onReceive(Context context, Intent intent) {
          final String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
  
          if (intent.getAction().equals(SMS_RECEIVED_ACTION)) {
  
              // 用于存储短信内容
              StringBuilder content = new StringBuilder();
              // 存储短信发送方手机号
              String sender = null;
              // 通过getExtras()方法获取短信内容
              Bundle bundle = intent.getExtras();
              String format = intent.getStringExtra("format");
              if (bundle != null) {
                  // 根据pdus关键字获取短信字节数组，数组内的每个元素都是一条短信
                  Object[] pdus = (Object[]) bundle.get("pdus");
                  for (Object object : pdus) {
                      // 将字节数组转化为Message对象
                      SmsMessage message = SmsMessage.createFromPdu((byte[]) object, format);
                      // 获取短信手机号
                      sender = message.getOriginatingAddress();
                      // 获取短信内容
                      content.append(message.getMessageBody());
                  }
              }
  
              // 将结果通知出去
              if (onSmsResultReceivedListener != null) {
                  Sms sms = new Sms(sender, content);
                  onSmsResultReceivedListener.onSmsResultReceived(sms);
              }
          }
      }
  
      // 设置监听器
      public void setOnSmsResultReceivedListener(OnSmsResultReceivedListener onSmsResultReceivedListener) {
          this.onSmsResultReceivedListener = onSmsResultReceivedListener;
      }
  
      public interface OnSmsResultReceivedListener {
          void onSmsResultReceived(Sms sms);
      }
  }
  
  ```

  ​	

  ```java
  public class MainActivity extends FlutterActivity {
      private static final String TAG = "MainActivity";
      private static final String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
      private static final String[] permissions = {android.Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS};
      private SmsReceiver smsReceiver;
  
      @Override
      protected void onCreate(@Nullable Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          // 注册广播
          registerSmsBroadcastReceiver();
  
          // 动态申请权限
          PermissionUtils.checkPermission(MainActivity.this, permissions);
  
          private void registerSmsBroadcastReceiver() {
              smsReceiver = new SmsReceiver();
              IntentFilter intentFilter = new IntentFilter(SMS_RECEIVED_ACTION);
              registerReceiver(smsReceiver, intentFilter);
  
              // 注册回调接口 监听短信结果
              smsReceiver.setOnSmsResultReceivedListener(sms -> {
                  Log.d(TAG, "onSmsResultReceived: " + sms.getSenderPhone());
                  Log.d(TAG, "onSmsResultReceived: " + sms.getReceiveMessage());
  
                  // 将监听结果通知给 flutter
                  new Handler().post(new Runnable() {
                      @Override
                      public void run() {
                          new MethodChannel(getFlutterEngine().getDartExecutor().getBinaryMessenger(), ChannelConstant.RECEIVE_CHANNEL_NAME)
                              .invokeMethod(ChannelConstant.RECEIVE_CHANNEL_METHOD_KEY, sms.toString());
                      }
                  });
              });
          }
      }
  
  ```

  

+ 测试短信信息

  ```tex
  【网捷收回】亲，你日思慕想的包包，我已经发货了哦，单号15754512488423，她已经迫不及待要见到您喽，帮我好好照顾她啊，注意查收！
  ```

  

### 三、极光推送工具

```yaml
# 极光推送
jpush_flutter: ^2.4.0
```

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



### 四、xupdate App更新

```yaml
# flutter应用更新
flutter_xupdate: ^2.0.3
# 获取app版本信息
package_info_plus: ^1.3.0
```

```dart
import 'dart:io';

import 'package:common_utils/common_utils.dart';
import 'package:flutter_xupdate/flutter_xupdate.dart';

class XupdateUtil {
    static final String _baseUrl = HttpHelperConfig.serviceList[HttpHelperConfig.selectIndex];

    /// 初始化
    static void initXUpdate() {
        if (Platform.isAndroid) {
            FlutterXUpdate.init(
                ///是否输出日志
                debug: true,

                ///是否使用post请求
                isPost: false,

                ///post请求是否是上传json
                isPostJson: false,

                ///请求响应超时时间
                timeout: 25000,

                ///是否开启自动模式
                isWifiOnly: false,

                ///是否开启自动模式
                isAutoMode: false,

                ///需要设置的公共参数
                supportSilentInstall: false,

                ///在下载过程中，如果点击了取消的话，是否弹出切换下载方式的重试提示弹窗
                enableRetry: false
            ).then((value) {
                printLog(StackTrace.current, "Xupdate初始化成功: $value");
            }).catchError((error) {
                printLog(StackTrace.current, "Xupdate初始化失败: $error");
            });

            FlutterXUpdate.setErrorHandler(onUpdateError: (Map<String, dynamic>? message) async {
                printLog(StackTrace.current, "Xupdate初始化失败: $message");
            });
        } else {
            printLog(StackTrace.current, "ios暂不支持XUpdate更新");
        }
    }

    /// json解析
    static UpdateEntity customParseJson(UpdateEntity updateEntity) {
        return UpdateEntity(
            isForce: updateEntity.isForce,
            isIgnorable: updateEntity.isIgnorable,
            hasUpdate: updateEntity.hasUpdate,
            versionCode: updateEntity.versionCode,
            versionName: updateEntity.versionName,
            updateContent: updateEntity.updateContent,
            downloadUrl: _baseUrl + "${updateEntity.downloadUrl}",
            apkSize: updateEntity.apkSize
        );
    }
}

```

```dart
// 请在合适时机初始化
XupdateUtil.initXUpdate();
```

```dart
//  在合适时机进行app检查更新
PackageInfo packageInfo = await PackageInfo.fromPlatform();
// app版本号
String version = packageInfo.version;
final UpdateEntity updateEntity = await AppCheckUpdateService.check(version);

//更新
FlutterXUpdate.updateByInfo(updateEntity: XupdateUtil.customParseJson(updateEntity));
```



```json
// 后端返回的json格式数据
{
    "code": 200,
    "message": "查询成功",
    "data": {
        "hasUpdate": true,
        "versionCode": 1,
        "versionName": "1.0.1",
        "updateContent": "1、APP更新功能上线",
        "downloadUrl": "/apk/bd0919d84a8349caab54e0f51ba43986.apk",
        "apkSize": 41110,
        "apkMd5": "FF:DF:F8:96:29:E0:E2:C5:8C:74:A5:2F:14:0E:BA:1E",
        "isForce": true,
        "isIgnorable": false
    }
}
```



### 五、统一APK打包名称

放到 app 的 build.gradle 中  注意要放在 android{}   中

```java
android {
    applicationVariants.all { variant ->
        variant.outputs.all { output ->
            def date = new Date().format("yyyy_MM_dd_hh_mm", TimeZone.getTimeZone("GMT+08"))
            def applicationId = android.defaultConfig.applicationId
            def versionName = android.defaultConfig.versionName
            def versionCode = android.defaultConfig.versionCode
            if (variant.buildType.name == "debug") {
                output.outputFileName = "${date}${applicationId}${versionName}_debug_${versionCode}.apk"
            } else if (variant.buildType.name == "release") {
                output.outputFileName = "${date}${applicationId}${versionName}_release_${versionCode}.apk"
            }
        }
    }
}
```

```
// debug包
2023_01_05_09_44com.wjhs.app1.0.1_debug_1.apk

// realse包
2023_01_05_08_50com.wjhs.app1.0.1_release_1.apk
```

