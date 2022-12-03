## 小程序开发文档

### 第一章、环境搭建

小程序官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/

#### 1、注册账号

在微信公众平台注册一个开发账号，地址：https://mp.weixin.qq.com/

#### 2、开发工具下载

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 第二章、项目初始化

#### 1、创建项目

+ 在微信开发工具中填入项目名称、目录、appID等信息。
+ 开发模式选择：小程序。
+ 后端服务：不使用云服务。
+ 模板选择：Typescript基础模板，然后创建即可。

#### 2、集成Vant Weapp UI库

Vant 是一个轻量、可靠的移动端组件库，于 2017 年开源。官网地址：https://vant-contrib.gitee.io/vant-weapp/#/home

目前 Vant 官方提供了 [Vue 2 版本](https://vant-contrib.gitee.io/vant/v2)、[Vue 3 版本](https://vant-contrib.gitee.io/vant)和[微信小程序版本](http://vant-contrib.gitee.io/vant-weapp)，并由社区团队维护 [React 版本](https://github.com/3lang3/react-vant)和[支付宝小程序版本](https://github.com/ant-move/Vant-Aliapp)

+ 具体的安装步骤也可以参考官方文档：https://vant-contrib.gitee.io/vant-weapp/#/quickstart

  ```
  # 通过 npm 安装
  npm i @vant/weapp -S --production
  
  # 通过 yarn 安装
  yarn add @vant/weapp --production
  
  # 安装 0.x 版本
  npm i vant-weapp -S --production
  
  ```

  

+ 修改 app.json

  将 app.json 中的 `"style": "v2"` 去除，小程序的[新版基础组件](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style)强行加上了许多样式，难以覆盖，不关闭将造成部分组件样式混乱。

+ 修改 project.config.json

  ```json
  {
    ...
    "setting": {
      ...
      "packNpmManually": true,
      "packNpmRelationList": [
        {
          "packageJsonPath": "./package.json",
          "miniprogramNpmDistDir": "./miniprogram/"
        }
      ]
    }
  }
  
  ```

  

+ 构建 npm 包

  打开微信开发者工具，点击 工具 -> 构建 npm，并勾选 使用 npm 模块 选项，构建完成后，即可引入组件。

  

+ typescript 支持

  ```
  # 通过 npm 安装
  npm i -D miniprogram-api-typings
  
  # 通过 yarn 安装
  yarn add -D miniprogram-api-typings
  ```

+ 在 tsconfig.json 中增加如下配置，以防止 tsc 编译报错。

  请将`path/to/node_modules/@vant/weapp`修改为项目的 `node_modules` 中 @vant/weapp 所在的目录。

  ```json
  {
    ...
    "compilerOptions": {
      ...
      "baseUrl": ".",
      "types": ["miniprogram-api-typings"],
      "paths": {
        "@vant/weapp/*": ["node_modules/@vant/weapp/dist/*"]
      },
      "lib": ["ES6"]
    }
  }
  ```



#### 3、封装本地存储工具

```typescript
class Cache {

  set(key: string, value: any): void {
    wx.setStorageSync(key, JSON.stringify(value));
  }

  get(key: string): any {
    const value = wx.getStorageSync(key)
    if (value) {
      return JSON.parse(value)
    }
    return null;
  }

  remove(key: string): void {
    wx.removeStorageSync(key);
  }

  clear(): void {
    wx.clearStorage();
  }
}

export default new Cache()
```



#### 4、封装网络请求库

```typescript
import Cache from "../utils/cache"

const BASE_URL: string = "http://114.55.32.234:8127";

type ALLOW_METHODS = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
type ALLOW_DATA = string | Map<String, any> | ArrayBuffer | any;


const get = (uri: string, query?: ALLOW_DATA, loading: boolean = true): Promise<any> => {
  return baseRequest(uri, "GET", query, loading);
}

const post = (uri: string, data?: ALLOW_DATA, loading: boolean = true): Promise<any> => {
  return baseRequest(uri, "POST", data, loading);
}

const put = (uri: string, data?: ALLOW_DATA, loading: boolean = true): Promise<any> => {
  return baseRequest(uri, "PUT", data, loading);
}

const delete_ = (uri: string, data?: ALLOW_DATA, loading: boolean = true): Promise<any> => {
  return baseRequest(uri, "DELETE", data, loading);
}


const baseRequest = (uri: string, method: ALLOW_METHODS, data?: ALLOW_DATA, loading: boolean = true): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (loading) {
      wx.showLoading({ title: "加载中..." })
    }
    wx.request({
      url: `${BASE_URL}${uri}`,
      method,
      data,
      header: {
        "Authorization": Cache.get("token") ? "Bearer " + Cache.get("token") : "",
      },
      success: res => {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          // 请求失败情况(业务逻辑)
          if (res.statusCode == 401) {
            // 未授权
            if ((res.data as any).message != null) {
              wx.showToast({ title: (res.data as any).message, icon: "none" });
            } else {
              wx.showToast({ title: "授权信息过期，请重新登录授权", icon: "none" })
            }
          } else {
            wx.showToast({ title: "服务器繁忙" + ((res.data as any).error || (res.data as any)), icon: "none" })
          }
          reject(res);
        }
      },
      fail: err => {
        wx.showToast({ title: "服务器繁忙，请稍后再试", icon: "none" })
        console.log(err);
        reject(err);
      },
      complete: () => {
        if (loading) {
          wx.hideLoading()
        }
      }
    })
  });
}


export {
  get, post, delete_, put
}
```



### 第三章、登录和Tabbar搭建

#### 1、Tabbar搭建

采用官方默认 `tabBar` 配置来构建，如果不使用默认的Tabbar样式风格，也可以进行自定义。下面贴出完整`app.json` 文件内容。

```json
{
  "pages": [
    // 登录页(授权) 
    "pages/auth/auth",
    // 首页 
    "pages/home/home",
    // 回收分类 
    "pages/category/category",
    // 快速预约 
    "pages/appointment/appointment",
    // 我的 
    "pages/profile/profile"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "网捷回收",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    // 自定义需要改成 true
    // 在跟目录新建一个自定义组件custom-tab-bar(名字不能错)
    "custom": false,
    "list": [{
        "pagePath": "pages/home/home",
        "text": "首页",
        "iconPath": "/assets/images/tabbar/home.png",
        "selectedIconPath": "/assets/images/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "回收分类",
        "iconPath": "/assets/images/tabbar/category.png",
        "selectedIconPath": "/assets/images/tabbar/category-active.png"
      },
      {
        "pagePath": "pages/appointment/appointment",
        "text": "快速预约",
        "iconPath": "/assets/images/tabbar/appointment.png",
        "selectedIconPath": "/assets/images/tabbar/appointment-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "/assets/images/tabbar/profile.png",
        "selectedIconPath": "/assets/images/tabbar/profile-active.png"
      }
    ]
  },
  "sitemapLocation": "sitemap.json"
}
```



#### 2、授权功能

+ 实现思路：

  通过调用`wx.login()` 获取到code之后，携带code带后端服务器进行校验，校验成功后端会返回`openID、sessionKey、skey` 等信息，同时也会返回当前用户的ID，可以通过ID去获取用户的一些基本信息，客户端保存`openID`，之后请求是都携带上即可。



+ API方法封装

  ```typescript
  import { get, post } from "./request";
  
  // 获取openID接口
  export function requestOpenId(code: string) {
    return post(`/wx/auth?code=${code}`, {}, false)
  }
  
  // 获用户信息接口
  export function requestUserInfo(userId: string) {
    return get(`/wx/users/${userId}`, {}, false)
  }
  ```

  

+ 界面使用到了 `van-loading` 和 `van-empty`组件，做一个引入。

  ```json
  {
    "usingComponents": {
      "van-loading": "@vant/weapp/loading/index",
      "van-empty": "@vant/weapp/empty/index"
    }
  }
  ```

  

+ 界面代码

  ```html
  <view class="auth-container">
    <van-loading wx:if="{{ isloading }}" type="spinner" size="50" />
    <van-empty bindtap="tologin" wx:else="" image="error" description="轻触重新加载" />
  </view>
  ```

  ```less
  .auth-container{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ```

  

+ 逻辑代码

  ```typescript
  import { requestOpenId, requestUserInfo } from "../../api/apis";
  import Cache from "../../utils/cache";
  
  Page({
    data: {
      isLoading: false,
    },
    onLoad() {
      this.tologin();
    },
  
    tologin() {
      this.setData({ isloading: true })
      // 登录
      wx.login({
        success: response => {
          console.log(response.code)
          requestOpenId(response.code).then(res => {
            if (res.code === 200) {
              Cache.set("userId", res.data.id);
              Cache.set("openId", res.data.openId);
  
              // 获取用户信息
              requestUserInfo(res.data.id).then(res => {
                console.log(res);
              })
  
              // 跳到首页
              wx.switchTab({
                url: "/pages/home/home",
              })
            }
          }, error => {
            this.setData({ isloading: false })
          })
        },
      })
    }
  })
  ```

  
