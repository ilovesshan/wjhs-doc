## 小程序开发文档

### 一、TabBar

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



### 二、公共webview

```html
<web-view src="{{ pagePath }}"></web-view>
```

```typescript
Page({
  data: {
    // 页面跳转路径
    pagePath: "",
    // 页面标题
    pageTitle: "",
  },

  onLoad(options) {
    const { pagePath, pageTitle} = options;
    if (options && pagePath) {
      this.setData({
        pagePath,
        pageTitle,
      });
    };
    if (pageTitle) {
      wx.setNavigationBarTitle({
        title: pageTitle,
      });
    }
  }
})
```

```typescript
wx.navigateTo({
    url: `/components/webView/webView?pageTitle=${pageTitle}&pagePath=${pagePath}`,
});
```





### 三、工具类

#### 1、本地存储

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



#### 2、网络请求库

```typescript
import Cache from "../utils/cache"


const BASE_URL: string = "http://192.168.1.102";

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
        "Authorization": "Openid " + Cache.get("openId"),
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
            wx.navigateTo({
              url: "/pages/auth/auth"
            })
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
  get, post, delete_, put, BASE_URL
}
```



#### 3、地址转换

```typescript
// 通过地址获取经纬度信息
export function getlocationByAddress(address: string): Promise<{ lat: number, lng: number }> {
    return new Promise((resovle, reject) => {
        wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=******`,
            success: async (res: { statusCode: number, data: { status: number, result: any } }) => {
                if (res.statusCode == 200 && res.data.status == 0) {
                    resovle(res.data.result.location);
                }
            },
            fail(err) {
                wx.showToast({ title: "抱歉不能识别的地址，您也可以更换地址或者联系联系客服", icon: "none" });
                reject(err);
            }
        });
    })
}


// 省市区详细地址 逆向解析 
// 四川省巴中市平昌县西兴职业中学 => [四川省, 巴中市, 平昌县, 西兴职业中学] 
// 四川省成都市锦江区春熙路太古里 => [四川省, 成都市, 锦江区, 春熙路太古里] 
export function parseAddress(address: string, name: string): Array<String> {
    const provinceIndex = address.indexOf("省") + 1;
    const cityIndex = address.indexOf("市") + 1;
    const areaIndex = address.indexOf("县") + 1 || address.indexOf("区") + 1;

    const province = address.substring(0, provinceIndex);
    const city = address.substring(provinceIndex, cityIndex);
    const area = address.substring(cityIndex, areaIndex);
    const detailAddress = address.substring(areaIndex) + name;

    return [province, city, area, detailAddress];
}
```



#### 4、时间转换

```typescript
export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('-') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}
```



#### 5、Loading和Toast

```typescript
const showToast = function (content: string, duration: number): void {
    if (!duration) duration = 2000
    wx.showToast({
        title: content,
        icon: 'none',
        duration: duration,
    })
}

var isShowLoading: boolean = false
const showLoading = function (title: string): void {
    if (isShowLoading) return
    wx.showLoading({
        title: title ? title : '',
        mask: true,
        success: () => {
            isShowLoading = true
        }
    })
}

const hideLoading = function (): void {
    if (!isShowLoading) return
    isShowLoading = false
    wx.hideLoading()
}

module.exports = {
    showToast,
    showLoading,
    hideLoading
}
```



### 四、授权功能

+ 实现思路：

  通过调用`wx.login()` 获取到code之后，携带code带后端服务器进行校验，校验成功后端会返回`openId、sessionKey、userId` 等信息，可以通过`userId`或者`openId`去获取用户的一些基本信息，客户端保存`openId`，之后请求是都携带上即可（具体步骤得看业务逻辑）。

```json
{
  "usingComponents": {
    "van-loading": "@vant/weapp/loading/index",
    "van-empty": "@vant/weapp/empty/index"
  }
}
```

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

```typescript
import { requestOpenId, requestSystemDict, requestUserInfo } from "../../api/apis";
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
                            Cache.set("userInfo", res.data);
                        })

                        // 获取数据字典
                        requestSystemDict().then(res => {
                            Cache.set("systemDict", res.data);
                        })

                        // 跳到首页
                        wx.switchTab({
                            url: "/pages/home/home",
                        })
                    }
                }, _ => {
                    this.setData({ isloading: false })
                })
            },
        })
    }
})
```
