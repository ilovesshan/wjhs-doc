### 第一章、前端环境搭建

#### 1、安装Node.js

+ 官网地址：https://nodejs.org/en/。

+ 下载之后双击安装即可，参考地址：https://blog.csdn.net/weixin_58988988/article/details/126184356

+ 在cmd窗口中输入对应命令，能看到版本信息就表示成功了。

  ```
  C:\Users\26659>node -v
  v16.13.2
  
  C:\Users\26659>npm -v
  8.19.2
  ```

  

#### 2、vue-cil 搭建 vue3 开发环境

+ 安装：vue-cli

  如果使用 `yarn` 工具、需要使用npm进行安装 `npm install -g yarn`

  ```
  C:\Users\26659>npm install -g @vue/cli
  或者
  C:\Users\26659>yarn global add @vue/cli
  ```

  

+ 查看vue版本，能看到版本信息就表示成功了。

  ```
  C:\Users\26659>vue --version
  @vue/cli 4.5.13
  ```

  

+ 创建vue项目

  ```
  C:\Users\26659>vue create 项目名
  ```



#### 3、使用vite创建项目

+ vite官网地址：https://cn.vitejs.dev/

+ 搭建第一个 Vite 项目，参考地址：https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project、在创建过程中请勾选 `vue-ts`这一项、因为本项目也是使用typescript来开发的。

  ```
  # 使用 NPM:
  npm create vite@latest
  
  # 使用 Yarn:
  yarn create vite
  
  # 使用 PNPM:
  pnpm create vite
  ```

  你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

  ```
  # npm 6.x
  npm create vite@latest my-vue-app --template vue
  
  # npm 7+, extra double-dash is needed:
  npm create vite@latest my-vue-app -- --template vue
  
  # yarn
  yarn create vite my-vue-app --template vue
  
  # pnpm
  pnpm create vite my-vue-app --template vue
  ```

  

+ 等待项目创建完成之后，进入到项目根路径中执行：`npm run dev` ，然后在浏览器中输入 `http://127.0.0.1:5173/`，能访问到界面，项目就搭建成功了。

  

### 第二章、项目初始化

#### 1、集成 vue-router

+ 官网地址：https://router.vuejs.org/zh/

  

+ 安装vue-router

  ```
  # npm 安装
  npm install vue-router@4
  
  # yarn 安装
  yarn add vue-router@4
  ```

  

+ 添加router相关文件

  在项目`src`目录下建立`router/index.ts` 文件

  ```typescript
  import { createRouter, createWebHistory } from "vue-router"
  import type { RouteRecordRaw } from "vue-router"
  
  const commonRoutes: RouteRecordRaw[] = [];
  const dynamicRoutes: RouteRecordRaw[] = [];
  
  const router = createRouter({
    history: createWebHistory(),
    routes: [...commonRoutes, ...dynamicRoutes],
  });
  
  export default router;
  ```

  

+ 使用

  在main.ts中加入以下代码

  ```typescript
  import { createApp } from "vue";
  import router from "./router"
  
  import App from "./App.vue";
  
  const app = createApp(App);
  app.use(router)
  app.mount("#app");
  ```

  

#### 2、集成 pinia

+ 官网地址：https://pinia.web3doc.top/

  

+ 安装 pinia

  ```
  # 使用 yarn
  yarn add pinia
  
  # 使用 npm
  npm install pinia
  ```

+ 添加pinia相关文件

  在项目`src`目录下建立`store/index.ts` 文件

  ```typescript
  import { defineStore } from "pinia";
  
  const rootStore = defineStore("rootStore", {
    state() {
      return {
        name: "ilovesshan"
      }
    },
    getters: {},
    actions: {}
  });
  
  
  export default rootStore;
  ```

  

+ 使用

  在main.ts中加入以下代码

  ```typescript
  import { createApp } from "vue";
  import { createPinia } from 'pinia'
  
  import App from "./App.vue";
  
  const app = createApp(App);
  app.use(createPinia())
  app.mount("#app");
  
  ```

  

#### 3、集成 element-plus

+ 官网地址：https://element-plus.gitee.io/zh-CN/

  

+ 安装  element-plus

  ```
  # 选择一个你喜欢的包管理器
  
  # NPM
  npm install element-plus --save
  
  # Yarn
  yarn add element-plus
  
  # pnpm
  pnpm install element-plus
  ```

  

+ 使用

  在main.ts中加入以下代码

  ```typescript
  import { createApp } from 'vue'
  import ElementPlus from 'element-plus'
  import 'element-plus/dist/index.css'
  import App from './App.vue'
  
  const app = createApp(App)
  
  app.use(ElementPlus)
  app.mount('#app')
  ```

+ 更多高级用法，请参考：https://element-plus.gitee.io/zh-CN/guide/quickstart.html

  

#### 4、集成 axios

+ 官网地址：https://www.axios-http.cn/

  

+ 安装axios

  ```
  # 使用 npm:
  npm install axios
  
  # 使用 bower:
  bower install axios
  
  # 使用 yarn:
  yarn add axios
  ```

+ 对axios进行封装

  

  serviceConfig.ts

  ```typescript
  interface IServiceConfig {
    devProxyBaseUrl: string,
    devBaseUrl: string,
    devTimeout: number,
  
    prodProxyBaseUrl: string,
    prodBaseUrl: string,
    prodTimeout: number,
  }
  
  const ServiceConfig: IServiceConfig = {
    devProxyBaseUrl: "/api/wjhs",
    devBaseUrl: "http://localhost",
    devTimeout: 15000,
  
    prodProxyBaseUrl: "/api/wjhs",
    prodBaseUrl: "https://xxxx.com",
    prodTimeout: 5000,
  }
  
  export default ServiceConfig;
  ```

  

  cache.ts

  ```typescript
  enum CacheType {
    l = 'localStorage',
    s = 'sessionStorage'
  }
  
  class Cache {
    storage: Storage
  
    constructor(type: CacheType) {
      this.storage = type === CacheType.l ? window.localStorage : window.sessionStorage
    }
  
    set(key: string, value: any): void {
      const data = JSON.stringify(value)
      this.storage.setItem(key, data)
    }
  
    get(key: string) {
      const value = this.storage.getItem(key)
      if (value) {
        return JSON.parse(value)
      }
    }
  
    remove(key: string) {
      this.storage.removeItem(key)
    }
  
  
    clear() {
      this.storage.clear()
    }
  }
  
  // localStorage 本地存储
  const LCache = new Cache(CacheType.l)
  // sessionStorage 会话存储
  const SCache = new Cache(CacheType.s)
  
  export { LCache, SCache }
  ```

  

  request.ts

  ```typescript
  import axios from "axios"
  import type { AxiosInstance, AxiosRequestConfig } from "axios"
  import { ElMessage, ElLoading } from 'element-plus'
  
  import ServiceConfig from "../config/serviceConfig"
  
  import router from "../router"
  import { LCache } from "../utils/cache"
  
  const baseConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.MODE == "development" ? ServiceConfig.devBaseUrl : ServiceConfig.prodBaseUrl,
    timeout: import.meta.env.MODE == "development" ? ServiceConfig.devTimeout : ServiceConfig.prodTimeout,
  }
  
  interface CusResponse<T = any> {
    code: number;
    message: string;
    data: T;
  }
  
  const instance: AxiosInstance = axios.create(baseConfig)
  
  let loadingInstance: any = null;
  
  // 请求拦截器
  instance.interceptors.request.use(config => {
    // 开启loading
    loadingInstance = ElLoading.service({ lock: true, text: '拼命加载中...', background: 'rgba(0, 0, 0, 0.7)', });
  
    // 添加token信息
    config.headers!["Authorization"] = LCache.get("token");
  
    // 添加时间戳
    config.url += `?t=${new Date().getTime()}`
    return config;
  },
    error => {
      // 关闭loading
      loadingInstance.close();
      ElMessage({ message: "请求失败,请联系网站管理员", type: 'error' });
      console.log(error);
    });
  
  
  // 响应拦截器
  instance.interceptors.response.use(response => {
    // 关闭loading
    loadingInstance.close();
    return response.data;
  },
    error => {
      // 关闭loading
      loadingInstance.close();
      if (error.response && error.response.status == 301) {
        // 后期优化
        router.push("/login");
        ElMessage({ message: error.response.data.message, type: 'error' });
      } else {
        ElMessage({ message: "请求失败,请联系网站管理员", type: 'error' });
      }
    });
  
  const request = async<T = any>(config: AxiosRequestConfig): Promise<CusResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      const data = await instance.request<CusResponse<T>>(config);
      resolve(data.data);
    });
  }
  
  export default request;
  ```

  

  用法

  ```vue
  <script setup lang="ts">
      import request from "./api/request";
  	
      // 后期会对这个方法进行封装，抽离到单独的文件中、方便统一管理
      request({
          method: "get",
          url: "/"
      }).then(res => {
          console.log(res);
      })
  
  </script>
  ```

  

