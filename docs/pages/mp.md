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

const BASE_URL: string = "https://32f38232.cpolar.cn";

type ALLOW_METHODS = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
type ALLOW_DATA = string | Map<String, any> | ArrayBuffer | any;


const get = (uri: string, query?: ALLOW_DATA): Promise<any> => {
  return baseRequest(uri, "GET", query);
}

const post = (uri: string, data?: ALLOW_DATA): Promise<any> => {
  return baseRequest(uri, "POST", data);
}

const put = (uri: string, data?: ALLOW_DATA): Promise<any> => {
  return baseRequest(uri, "PUT", data);
}

const delete_ = (uri: string, data?: ALLOW_DATA): Promise<any> => {
  return baseRequest(uri, "DELETE", data);
}


const baseRequest = (uri: string, method: ALLOW_METHODS, data?: ALLOW_DATA): Promise<any> => {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: "加载中..." })
    wx.request({
      url: `${BASE_URL}${uri}`,
      method,
      data,
      header: {
        "Authorization": Cache.get("token") ? "Bearer " + Cache.get("token") : "",
      },
      success: res => {
        if (res.statusCode == 200) {
          resolve(res)
        } else {
          // 请求失败情况(业务逻辑)
          if (res.statusCode == 401) {
            // 未授权
            wx.showToast({ title: "授权信息过期，请重新登录授权", icon: "none" })
          }
        }
      },
      fail: err => {
        console.log(err);
        reject(err);
      },
      complete: () => wx.hideLoading()
    })
  });
}


export {
  get, post, delete_, put
}
```

