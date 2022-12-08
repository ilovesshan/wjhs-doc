## 平台端开发文档

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

+ 添加pinia相关文件，采用分模块

  在项目`src`目录下建立`store/index.ts` 文件

  ```typescript
  import userModule from "./modules/user"
  
  // 用户模块
  const userStore = userModule();
  
  export {
    userStore
  }
  ```

  在项目`src`目录下建立`store/modules/user.ts` 文件

  ```typescript
  import { defineStore } from "pinia";
  import { SCache } from "../../utils/cache";
  
  const rootStore = defineStore("userStore", {
    state(): IUserStore {
      return {
          name:"ilovesshan"
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

  界面中使用store中的数据

  ```typescript
  import { userStore } from "../../store/index"
  
  const username = computed(()=> userStore.name);
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
    devBaseUrl: "http://localhost:80",
    devTimeout: 15000,
  
    prodProxyBaseUrl: "/api/wjhs",
    prodBaseUrl: "http://114.55.32.234:8127",
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
  import { LCache, SCache } from "../utils/cache"
  
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
    config.headers!["Authorization"] = SCache.get("token");
  
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
    return response;
  },
    error => {
      // 关闭loading
      loadingInstance.close();
      if (error.response && error.response.status == 301) {
        router.push("/login");
        ElMessage({ message: error.response.data.message, type: 'error' });
      } else {
        ElMessage({ message: "请求失败,请联系网站管理员", type: 'error' });
      }
  });
  
  const request = async<T = any>(config: AxiosRequestConfig): Promise<CusResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      const res = await instance.request<CusResponse<T>>(config);
      const { code, message, data } = res.data;
      if(code == 200){
        resolve(res.data)
      }else{
        ElMessage({ message, type: 'error' });
      }
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
  
  

### 第三章、路由和Layout布局

#### 1、404页面

```vue
<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/images/404_images/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/images/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/images/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/images/404_images/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">{{ subMessage }}</div>
        <a href="/" class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup >
import { ref } from 'vue';

const message = ref<string>("The webmaster said that you can not enter this page...")
const subMessage = ref<string>("Please check that the URL you entered is correct, or click the button below to return to the homepage.")

</script>

<style lang="scss" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}

.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;

  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;

    &__parent {
      width: 100%;
    }

    &__child {
      position: absolute;

      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }

      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }

        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }

        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }

        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }

      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }

        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }

        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }

        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }

      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }

        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }

        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }

        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }

  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;

    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }

      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
```



#### 2、路由配置

路由中涉及的界面请自行创建、也可以参考项目源码。

```typescript
import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const dynamicRoutes: RouteRecordRaw[] = [
];

const commonRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/views/layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        meta: { title: "首页", icon: "home" },
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "/system",
        name: "system",
        redirect:"/swiper",
        meta: { title: "系统管理", icon: "system" },
        component: () => import("@/views/system/index.vue"),
        children:[
          {
            path: "swiper",
            name: "swiper",
            meta: { title: "轮播图管理", icon: "swiper" },
            component: () => import("@/views/system/pages/swiper/index.vue"),
          },
          {
            path: "notice",
            name: "notice",
            meta: { title: "公告管理", icon: "notice" },
            component: () => import("@/views/system/pages/notice/index.vue"),
          },
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    meta: {},
    component: () => import("@/views/login/index.vue"),
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import("@/views/404.vue") },
];

const router = createRouter({
  history:  createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes: [...commonRoutes],
});

export default router;

```



#### 3、Layout布局

Layout布局我们暂时分成左右结构，左边就是导航栏，右边分成三部分(页头、主体、页脚)，因此就拆分出了四个组件。

+ aside.vue 导航栏

  ```vue
  <template>
    <el-aside width="200px">
      <div class="logo-container">
        <img src="../../assets/images/logo.4eeb8a8e.png" />
        <p>网捷回收</p>
      </div>
      <el-menu router unique-opened background-color="#304156" :default-active="currentPath" text-color="#bfcbd9"
        @open="handleOpen" @close="handleClose">
        <el-menu-item index="/home"> 
          <el-icon> <Orange /> </el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>系统管理</span>
  	    </template>
          <el-menu-item index="/system/swiper">
            <template #title>
              <el-icon><Picture /> </el-icon>
              <span>轮播图管理</span>
            </template>
          </el-menu-item>
  
          <el-menu-item index="/system/notice">
            <template #title>
              <el-icon><Notification /> </el-icon>
              <span>公告管理</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  
  import {
    Orange, DataBoard, Iphone, Picture, Notification, Monitor
  } from '@element-plus/icons-vue'
  
  import { useRoute } from "vue-router"
  
  
  const route = useRoute()
  const currentPath = ref("");
  
  watch(() => route.fullPath, (newVal) => {
    currentPath.value = newVal;
  }, { immediate: true })
  
  const handleOpen = (key: string, keyPath: string[]) => {
  }
  
  const handleClose = (key: string, keyPath: string[]) => {
  }
  
  </script>
  
  <style lang="less" scoped>
  .logo-container {
    width: 200px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
  
    p {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin-left: 5px;
    }
  }
  
  .el-aside,
  .el-menu {
    background-color: #304156;
    border-right: none;
  
    .el-sub-menu,
    .el-menu-item {
      width: 200px;
    }
  
    ::v-deep .is-active {
      width: 200px;
    }
  
    ::v-deep .is-opened .el-menu {
      background-color: #1f2d3d;
    }
  }
  </style>
  ```

  

+ header.vue页头,实现面包屑和退出登录

  ```vue
  <template>
    <el-header>
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
           <!--  实现面包屑 -->
          <el-breadcrumb-item v-for="item in breadCrumbList">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-button @click="logout" plain>logout</el-button>
      </div>
    </el-header>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from "vue"
  import { useRoute, useRouter } from "vue-router"
  
  import { userStore } from "../../store/index"
  
  const route = useRoute()
  const router = useRouter()
  const breadCrumbList = ref<any[]>([]);
  
  const logout = () => {
    userStore.cleanUserInfo();
    userStore.cleanUserLoginInfo();
    router.push({ path: "/login" });
  }
  
  
  watch(() => route.matched, (newVal) => {
    breadCrumbList.value = newVal.filter(r => r.meta && r.meta.title);
  }, { immediate: true })
  
  
  </script>
  
  <style lang="less" scoped>
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>
  ```

  

+ footer.vue  页脚

  ```vue
  
  <template>
    <el-footer>
      <p class="footer-text"></p>
    </el-footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: "",
  });
  </script>
  
  <style lang="less" scoped>
  .el-footer {
    background-color: #ffffff;
    color: #3a3737;
    text-align: center;
    line-height: 60px;
  
    .footer-text {
      font-size: 14px;
    }
  }
  </style>
  ```

  

  

+ layout/index.vue 主体(作为路由出口)

  ```vue
  <template>
    <div id="index">
      <div class="common-layout">
        <el-container>
          <IndexAside />
          <el-container direction="vertical">
            <IndexHeader />
            <el-main> 
              <!-- 路由出口 -->
              <router-view></router-view>
            </el-main>
            <IndexFooter />
          </el-container>
        </el-container>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import IndexHeader from "@/components/layout/header.vue"
    import IndexAside from "@/components/layout/aside.vue"
    import IndexFooter from "@/components/layout/footer.vue"
  </script>
  
  <style scoped lang="less">
  #index {
    width: 100%;
    height: 100vh;
    background-color: #f1f3f4;
  
    .common-layout,
    .el-container {
      height: 100%;
  
      .el-main {
        width: 100%;
        background-color: #ffffff;
      }
    }
  }
  </style>
  ```

  ​	

### 第四章、登录鉴权

#### 1、登录功能

```typescript
interface ILoginUserInfo {
  username: String,
  password: String,
}

export type {
  ILoginUserInfo
}
```



新建两个文件、分别负责请求用户和系统字典相关的请求处理

```typescript
import { ILoginUserInfo } from "../views/login/type";
import request from "./request";

// 用户授权
export function userAuth(loginUserInfo: ILoginUserInfo) {
  return request({
    method: "POST",
    url: `/auth`,
    data: loginUserInfo
  })
}

// 获取用户信息
export function userInfo(userId: string) {
  return request({
    method: "GET",
    url: `users/${userId}`,
  })
}
```

```typescript
import request from "./request";

// 数据字典
export function systemDict() {
  return request({
    method: "GET",
    url: `/systemDict`,
  })
}

```



```vue
<template>
  <div id="login-page">
    <div class="login-form">
      <p class="title">Hi，欢迎登录</p>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="0" class="demo-ruleForm">
        <el-form-item label="" prop="username">
          <el-input :prefix-icon="Avatar" v-model="ruleForm.username" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input :prefix-icon="Lock" v-model="ruleForm.password" show-password type="password"
            autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="loginHandler(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="form-bottom">
        <el-button class="register-btn" link type="primary">找回密码</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Avatar, Lock } from "@element-plus/icons-vue";
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, FormInstance } from 'element-plus';

import { userAuth, userInfo } from "../../api/user";

import { userStore } from "../../store/index"

import type { ILoginUserInfo } from "./type";
import type { IUserInfo, IUserLoginInfo } from "../../store/modules/user";
import { systemDict } from "../../api/system-dict";
import { SCache } from "../../utils/cache";
import { canAccess } from "../../permission";


const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ILoginUserInfo>({
  username: "admin",
  password: "123456",
})

const rules = reactive({
  username: [{ required: true, min: 4, max: 24, trigger: 'blur' }],
  password: [{ required: true, min: 6, max: 32, trigger: 'blur' }],
})

const loginHandler = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 授权登录
      const authResult = await userAuth(ruleForm);
      userStore.saveUserLoginInfo(authResult.data as IUserLoginInfo);

      // 请求用户信息
      const userInfoResult = await userInfo(authResult.data.id);
      userStore.saveUserInfo(userInfoResult.data as IUserInfo);

      // 权限判断
      if(canAccess(userInfoResult.data.userType)){
         // 请求数据字典
        const systemDictResult = await systemDict();
        SCache.set("systemDict", systemDictResult.data)
        // 跳转到首页
        router.push({path:"/"});
      }else{
        ElMessage({ message: "非管理员用户暂时不能登录后台管理系统", type: 'error' });
        userStore.cleanUserInfo();
        userStore.cleanUserLoginInfo();
      }
    }
  });
}

</script>

<style lang="less" scoped>
#login-page {
  width: 100%;
  height: 100vh;
  background: url("../../assets/images/login_background.e80f4621.png");
  background-size: cover;

  /* element-ui 样式重置 */
  .login-form {
    box-sizing: border-box;
    width: 320px;
    height: 340px;
    position: absolute;
    background-color: #ffffff;
    border-radius: 8px;
    right: 105px;
    bottom: 150px;
    text-align: center;
    padding: 20px 10px;

    .title {
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 30px;
    }

    .login-btn {
      width: 100px;
    }

    .form-bottom {
      margin-top: 30px;
      text-align: right;
      padding: 0 10px;
    }
  }
}
</style>
```



pinia中user.ts相关代码

```typescript
import { defineStore } from "pinia";
import { SCache } from "../../utils/cache";

export interface IUserInfo {
  id: string,
  username: string,
  userType: string,
  gender: string,
  attachmentId: string,
  nickName: string,
  phone: string,
  isDelete: string,
  lastVisitTime: string,
  createTime: string,
  updateTime: string,
}

export interface IUserLoginInfo {
  id: string,
  username: string,
  token: string,
}

export interface IUserStore {
  userInfo: IUserInfo
  userLoginInfo: IUserLoginInfo
}



const rootStore = defineStore("userStore", {
  state(): IUserStore {
    return {
      userLoginInfo: {
        id: SCache.get("id"),
        username: SCache.get("username"),
        token: SCache.get("token"),
      },
      userInfo: SCache.get("userInfo"),
    }
  },

  getters: {},

  actions: {
    saveUserLoginInfo(userLoginInfo: IUserLoginInfo) {
      this.userLoginInfo = userLoginInfo;
      SCache.set("id", userLoginInfo.id);
      SCache.set("username", userLoginInfo.username);
      SCache.set("token", userLoginInfo.token);
    },

    cleanUserLoginInfo() {
      this.$patch({ userLoginInfo: {} })
      SCache.clear()
    },

    saveUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo;
      SCache.set("userInfo", userInfo);
    },

    cleanUserInfo() {
      this.$patch({ userInfo: {} })
      SCache.clear()
    }
  }
});


export default rootStore;
```



#### 2、鉴权逻辑

```typescript
import { ElMessage } from "element-plus";
import router from "./router";
import { IUserInfo } from "./store/modules/user";
import { SCache } from "./utils/cache";

// 路由拦截
const whileList: Array<string> = ["notFound", "login"];
router.beforeEach((to, from, next) => {
  if (SCache.get("token") && SCache.get("userInfo")) {
    if (to.path === "/login") {
      // 已经登录情况下 不能直接访问登录界面
      next(from.path);
      return;
    }
    // has token
    // 判断是否有权限(根据角色CODE)进入
    if (canAccess((SCache.get("userInfo") as IUserInfo).userType)) {
      next();
    } else {
      ElMessage({ message: "非管理员用户暂时不能登录后台管理系统", type: 'error' });
      next("/login");
    }
  } else {
    // no token
    if (whileList.includes(to.name as string)) {
      // 白名单放行
      next();
    } else {
      // to login page
      next("/login");
    }
  }
})

export function canAccess(code: string): boolean {
  return code === "0";
}
```

需要在main.ts中引入

```typescript
import "./permission";
```



### 第五章、轮播图和通知公告

#### 1、定义接口

+ swiper

  ```typescript
  export interface ISwiperCreateOrUpdate {
    id: string,
    type: number,
    attachmentId: string,
    title: string,
    subTitle: string
    detail: string,
    link: string,
    attachment?: IAttachment,
  }
  
  interface IAttachment {
    id?: string,
    url?: string,
    createByUserId?: string,
    createByUserName?: string,
    createByUserType?: string,
    createTime?: string,
  }
  
  export interface ISwiper {
    id: string,
    type: string,
    attachmentId: string,
    title: string,
    subTitle: string,
    detail: string,
    link: string,
    attachment: IAttachment,
    createTime: string,
  }
  
  export interface ISwiperSelect {
    type: number,
    title?: string,
    beginTime?: string
    endTime?: string
    tempTime?: string
  }
  
  
  ```

  

+ notice

  ```typescript
  export interface INoticeCreateOrUpdate {
    id?: string,
    type: number,
    title: string,
    subTitle?: string,
    detail?: string,
    link?: string,
  }
  
  export interface INoticeSelect {
    type: number,
    title?: string ,
    detail?: string
    beginTime?: string
    endTime?: string
    tempTime?: string
  }
  
  
  export interface INotice {
    id: string
    type: string
    title: string
    subTitle: string
    detail: string
    link: string
    createTime: string
  }
  
  ```

  

#### 2、API封装

+ swiper

  ```typescript
  import request from "./request";
  import type { ISwiperCreateOrUpdate, ISwiperSelect } from "../views/system/pages/swiper/type";
  
  // 获取轮播图列表
  export function swiperList(swiperSelect: ISwiperSelect) {
    return request({
      method: "GET",
      url: `/swiper`,
      params: swiperSelect
    });
  }
  
  
  // 新增轮播图
  export function swiperInsert(swiper: ISwiperCreateOrUpdate) {
    return request({
      method: "POST",
      url: `/swiper`,
      data: swiper,
    });
  }
  
  
  // 更新轮播图
  export function swiperUpdate(swiper: ISwiperCreateOrUpdate) {
    return request({
      method: "PUT",
      url: `/swiper`,
      data: swiper,
    });
  }
  
  
  // 删除轮播图
  export function swiperDelete(id: string) {
    return request({
      method: "DELETE",
      url: `/swiper/${id}`
    });
  }
  
  
  // 根据ID获取轮播图
  export function swiperGetById(id: string) {
    return request({
      method: "GET",
      url: `/swiper/${id}`
    });
  }
  ```

  

+ notice

  ```typescript
  import request from "./request";
  import type { INoticeSelect, INoticeCreateOrUpdate } from "../views/system/pages/Notice/type";
  
  // 获取通知公告列表
  export function noticeList(noticeSelect: INoticeSelect) {
    return request({
      method: "GET",
      url: `/notice`,
      params: noticeSelect,
    });
  }
  
  // 新增通知公告
  export function noticeInsert(notice: INoticeCreateOrUpdate) {
    return request({
      method: "POST",
      url: `/notice`,
      data: notice,
    });
  }
  
  // 更新通知公告
  export function noticeUpdate(notice: INoticeCreateOrUpdate) {
    return request({
      method: "PUT",
      url: `/notice`,
      data: notice,
    });
  }
  
  
  // 删除通知公告
  export function noticeDelete(id: string) {
    return request({
      method: "DELETE",
      url: `/notice/${id}`
    });
  }
  
  
  
  // 根据ID查询公告
  export function noticeGetById(id: string) {
    return request({
      method: "GET",
      url: `/notice/${id}`
    });
  }
  ```

  

#### 3、轮播图实现

+ store

  ```typescript
  import { defineStore } from "pinia";
  import { swiperList } from "../../api/swiper";
  import ServiceConfig from "../../config/serviceConfig";
  import { ISwiper, ISwiperSelect } from "../../views/system/pages/swiper/type";
  
  interface ISwiperStore {
    type: number,
    list: Array<ISwiper>
  }
  
  
  const swiperModule = defineStore("swiperStore", {
    state() {
      return {
        type: 0,
        list: []
      } as ISwiperStore
    },
  
    getters: {},
  
    actions: {
      saveSwiper(SwiperList: Array<ISwiper>) {
        this.list = SwiperList;
      },
  
      saveType(type: number) {
        this.type = type;
      },
  
      async requestSwiper(requestData: ISwiperSelect) {
        const result = await swiperList(requestData);
        const swiperData: Array<ISwiper> = result.data;
        swiperData.map(swiper => {
          const baseUrl = import.meta.env.MODE == "development" ? ServiceConfig.devBaseUrl : ServiceConfig.prodBaseUrl;
          swiper.attachment.url = `${baseUrl + swiper.attachment.url}`
          return swiper;
        })
  
        this.saveSwiper(result.data as Array<ISwiper>);
        this.saveType(requestData.type);
      }
    }
  });
  
  
  export default swiperModule;
  ```

  

+ 父层组件(tab)

  ```vue
  <template>
    <div id="swiper-page">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="小程序" name="wx"> <swiper-list-cpn :list="noticeLIst" :currentIndex="31" />
        </el-tab-pane>
        <el-tab-pane label="App" name="app"> <swiper-list-cpn :list="noticeLIst" :currentIndex="32" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { swiperStore } from '../../../../store';
  
  import swiperListCpn from "./components/swiper-list.vue"
  
  const activeName = ref('wx')
  
  const noticeLIst = computed(() => swiperStore.list);
  const handleClick = () => swiperStore.requestSwiper({ type: activeName.value.includes("wx") ? 32 : 31 });
  
  // 默认加载请求小程序轮播图
  swiperStore.requestSwiper({ type: 31 });
  
  </script>
  
  <style lang="less" scoped>
  #swiper-page {}
  </style>
  ```

  

+ 子层组件(筛选条件和数据列表)

  ```vue
  <template>
    <div id="swiper-list-container">
      <!-- 头部 -->
      <div class="conditions-container">
        <el-card shadow="never">
  
          <!-- 搜索条件框 -->
          <el-row :gutter="20" class="condition-input-container">
            <el-col :span="6">
              <el-form-item label="标题">
                <el-input v-model="selectedConditions.title" placeholder="标题关键字" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="selectedConditions.tempTime" format="YYYY-MM-DD" type="daterange"
                  range-separator="到" value-format="YYYY-MM-DD HH:mm:ss" @change="datePickerChange"
                  start-placeholder="开始日期" end-placeholder="结束日期" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 搜索、重置 按钮-->
          <el-row class="search-and-reset-container">
            <el-button @click="handleSearch" type="primary">搜索 <el-icon class="el-icon--right">
                <Search />
              </el-icon>
            </el-button>
  
            <el-button @click="handleReset">重置 <el-icon class="el-icon--right">
                <RefreshRight />
              </el-icon>
            </el-button>
          </el-row>
  
          <!-- 新增 、修改、删除、导出 按钮-->
          <el-row>
            <el-button @click="handleInsert" plain type="primary">新增 <el-icon class="el-icon--right">
                <Plus />
              </el-icon>
            </el-button>
  
            <el-button @click="handleUpdate(selectedIds[0])" type="success" :disabled="(selectedIds.length != 1)"
              plain>更新<el-icon class="el-icon--right">
                <Edit />
              </el-icon>
            </el-button>
  
            <el-button @click="handleDelete(selectedIds[0])" type="danger" :disabled="(selectedIds.length < 1)"
              plain>删除<el-icon class="el-icon--right">
                <Delete />
              </el-icon>
            </el-button>
  
            <el-button @click="handleExport" type="warning" :disabled="(selectedIds.length < 1)" plain>导出<el-icon
                class="el-icon--right">
                <Download />
              </el-icon>
            </el-button>
          </el-row>
  
        </el-card>
      </div>
  
      <!-- 表格数据 -->
      <div id="notice-list-container">
        <el-card shadow="never">
          <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="50" />
            <el-table-column prop="title" show-overflow-tooltip label="标题" width="240" />
            <el-table-column prop="link" show-overflow-tooltip label="图片" width="240">
              <template #default="scope">
                <el-image :preview-teleported="true" style="width: 200px; height: 50px" :src="scope.row.attachment.url"
                  :preview-src-list="[scope.row.attachment.url]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="link" show-overflow-tooltip label="跳转链接" width="240">
              <template #default="scope">
                <el-link :href="scope.row.link" target="_blank">{{ scope.row.link }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="240" align="center" />
            <el-table-column fixed="right" label="操作" width="200">
              <template #default="scope">
                <el-button @click="handleUpdate(scope.row.id)" link type="primary" size="small">更新</el-button>
                <el-button @click="handleDelete(scope.row.id)" link type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  
    <el-dialog v-model="dialogVisible" title="新增/更新" width="30%" :before-close="() => dialogVisible = false">
      <el-form label-position="left" :model="createOrUpdateData" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="createOrUpdateData.title" />
        </el-form-item>
        <el-form-item label="子标题">
          <el-input type="textarea" :rows="4" v-model="createOrUpdateData.subTitle" />
        </el-form-item>
        <el-form-item label="详情信息">
          <el-input type="textarea" :rows="2" v-model="createOrUpdateData.detail" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload style="width:200px; height:80px; border: 1px solid #dcdfe6; line-height: 80px; text-align: center;"
            :action="baseUrl + '/attachments'" :headers="uploadHeader" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200" height="80" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="createOrUpdateData.link" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleCreateOrUpdate">确定</el-button>
          <el-button @click="() => dialogVisible = false"> 取消</el-button>
        </span>
      </template>
    </el-dialog>
  
  </template>
  
  <script lang="ts" setup>
  
  import { toRefs, ref, reactive } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import type { UploadProps } from 'element-plus'
  import { Delete, Download, Search, RefreshRight, Plus, Edit } from '@element-plus/icons-vue';
  
  import type { ISwiper, ISwiperSelect, ISwiperCreateOrUpdate } from "../type"
  
  import { swiperStore } from "../../../../../store";
  import { deepClone } from "../../../../../utils/deep-clone"
  import { swiperGetById, swiperUpdate, swiperInsert, swiperDelete } from "../../../../../api/swiper";
  import ServiceConfig from "../../../../../config/serviceConfig";
  import { SCache } from "../../../../../utils/cache";
  
  
  //子组件接收父组件数据
  const props = defineProps({
    list: Array<ISwiper>,
    currentIndex: {
      required: true,
      type: Number
    },
  });
  const { list, currentIndex } = toRefs(props);
  
  const baseUrl = import.meta.env.MODE == "development" ? ServiceConfig.devBaseUrl : ServiceConfig.prodBaseUrl;
  
  const uploadHeader = {
    Authorization: "Bearer " + SCache.get("token"),
  }
  
  
  const selectedIds = ref<Array<string>>([]);
  const dialogVisible = ref<boolean>(false);
  const imageUrl = ref<string>("");
  
  const handleSelectionChange = (selected: Array<ISwiper>) => {
    selectedIds.value = selected.map((swiper: ISwiper) => swiper.id)
  }
  
  // 默认的查询条件
  const defaultSelectConditions: ISwiperSelect = {
    type: currentIndex.value,
    title: "",
    tempTime: "",
    beginTime: "",
    endTime: "",
  }
  
  // 新增或者更新的数据
  const defaultCreateOrUpdateDate: ISwiperCreateOrUpdate = {
    id: "",
    attachmentId: "",
    type: currentIndex.value,
    title: "",
    subTitle: "",
    detail: "",
    link: "",
    attachment: {},
  }
  
  
  const selectedConditions = reactive(deepClone<ISwiperSelect>(defaultSelectConditions));
  let createOrUpdateData = reactive(deepClone<ISwiperCreateOrUpdate>(defaultCreateOrUpdateDate));
  
  // 搜索
  const handleSearch = () => {
    const requestData = deepClone<ISwiperSelect>(selectedConditions);
    delete requestData["tempTime"]
    swiperStore.requestSwiper(requestData)
  };
  
  // 重置
  const handleReset = () => {
    Object.assign(selectedConditions, deepClone<ISwiperSelect>(defaultSelectConditions));
    handleSearch();
  };
  
  
  // 新增(弹框)
  const handleInsert = () => {
    createOrUpdateData = reactive(deepClone<ISwiperCreateOrUpdate>(defaultCreateOrUpdateDate));
    imageUrl.value = "";
    dialogVisible.value = true
  };
  
  
  // 更新(弹框)
  const handleUpdate = async (id: string) => {
    const result = await swiperGetById(id);
    createOrUpdateData = reactive(result.data);
    imageUrl.value = (baseUrl + createOrUpdateData.attachment?.url + '?t=' + new Date().getTime())
    dialogVisible.value = true;
  }
  
  
  // 删除
  const handleDelete = (id: string) => {
    ElMessageBox.confirm('确定要删除吗?', '删除', { type: "error" })
      .then(async () => {
        const result = await swiperDelete(id);
        const { code, message } = result
        if (code == 200) {
          ElMessage({ type: "success", message });
          handleSearch();
        } else {
          ElMessage({ type: "success", message });
        }
      })
      .catch(() => { })
  }
  
  // 导出
  const handleExport = () => ElMessage({ type: "warning", message: "功能开发中..." })
  
  // 新增或者更新
  const handleCreateOrUpdate = async () => {
    let result = null;
    if (createOrUpdateData.id) {
      // 更新
      result = await swiperUpdate(createOrUpdateData);
    } else {
      // 新增
      result = await swiperInsert(createOrUpdateData);
    }
  
    const { code, message } = result
    if (code == 200) {
      dialogVisible.value = false;
      ElMessage({ type: "success", message });
      handleSearch();
    } else {
      ElMessage({ type: "success", message });
    }
  }
  
  const datePickerChange = (value: any) => {
    value[1] = value[1].replace("00:00:00", "23:59:59");
    selectedConditions.beginTime = value[0];
    selectedConditions.endTime = value[1];
  }
  
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    createOrUpdateData.attachment!.url = response.data.url;
    createOrUpdateData.attachmentId = response.data.id;
    imageUrl.value = baseUrl + response.data.url;
  }
  
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('Avatar picture must be JPG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error('Avatar picture size can not exceed 4MB!')
      return false
    }
    return true
  }
  
  </script>
  
  <style lang="less" scoped>
  #swiper-list-container {}
  </style>
  ```

  

#### 4、通知公告实现

+ store

  ```typescript
  import { defineStore } from "pinia";
  import { noticeList } from "../../api/notice";
  import type { INotice, INoticeSelect } from "../../views/system/pages/notice/type";
  
  interface INoticeStore {
    type: number,
    list: Array<INotice>
  }
  
  const noticeModule = defineStore("noticeStore", {
    state(): INoticeStore {
      return {
        type: 0,
        list: []
      }
    },
  
    getters: {
  
    },
  
    actions: {
      saveNotice(noticeList: Array<INotice>) {
        this.list = noticeList;
      },
  
      saveType(type: number) {
        this.type = type;
      },
  
      async requestNotice(requestData: INoticeSelect) {
        const result = await noticeList(requestData);
        this.saveNotice(result.data as Array<INotice>);
        this.saveType(requestData.type);
      }
    }
  });
  
  export default noticeModule;
  ```

  

+ 父层组件(tab)

  ```vue
  <template>
    <div id="notice-page">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="小程序" name="wx"> <notice-list-cpn :list="noticeLIst" :currentIndex="31" />
        </el-tab-pane>
        <el-tab-pane label="App" name="app"> <notice-list-cpn :list="noticeLIst" :currentIndex="32" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  
  import noticeListCpn from "./components/notice-list.vue";
  
  import { noticeStore } from '../../../../store';
  
  const activeName = ref("wx")
  
  const noticeLIst = computed(() => noticeStore.list);
  const handleClick = () => noticeStore.requestNotice({ type: activeName.value.includes("wx") ? 32 : 31 });
  
  // 默认加载请求小程序通知公告
  noticeStore.requestNotice({ type: 31 });
  
  </script>
  
  <style lang="less" scoped>
  #notice-page {
    background-color: transparent;
  }
  </style>
  ```

  

+ 子层组件(筛选条件和数据列表)

  ```vue
  <template>
    <div id="notice-list-container">
      <!-- 头部 -->
      <div class="conditions-container">
        <el-card shadow="never">
  
          <!-- 搜索条件框 -->
          <el-row :gutter="20" class="condition-input-container">
            <el-col :span="6">
              <el-form-item label="标题">
                <el-input v-model="selectedConditions.title" placeholder="标题关键字" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="详情">
                <el-input v-model="selectedConditions.detail" placeholder="详情关键字" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-date-picker v-model="selectedConditions.tempTime" format="YYYY-MM-DD" type="daterange"
                  range-separator="到" value-format="YYYY-MM-DD HH:mm:ss" @change="datePickerChange"
                  start-placeholder="开始日期" end-placeholder="结束日期" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 搜索、重置 按钮-->
          <el-row class="search-and-reset-container">
            <el-button @click="handleSearch" type="primary">搜索 <el-icon class="el-icon--right">
                <Search />
              </el-icon>
            </el-button>
  
            <el-button @click="handleReset">重置 <el-icon class="el-icon--right">
                <RefreshRight />
              </el-icon>
            </el-button>
          </el-row>
  
          <!-- 新增 、修改、删除、导出 按钮-->
          <el-row>
            <el-button @click="handleInsert" plain type="primary">新增 <el-icon class="el-icon--right">
                <Plus />
              </el-icon>
            </el-button>
  
            <el-button @click="handleUpdate(selectedIds[0])" type="success" :disabled="(selectedIds.length != 1)"
              plain>更新<el-icon class="el-icon--right">
                <Edit />
              </el-icon>
            </el-button>
  
            <el-button @click="handleDelete(selectedIds[0])" type="danger" :disabled="(selectedIds.length < 1)"
              plain>删除<el-icon class="el-icon--right">
                <Delete />
              </el-icon>
            </el-button>
  
            <el-button @click="handleExport" type="warning" :disabled="(selectedIds.length < 1)" plain>导出<el-icon
                class="el-icon--right">
                <Download />
              </el-icon>
            </el-button>
          </el-row>
  
        </el-card>
      </div>
  
      <!-- 表格数据 -->
      <div id="notice-list-container">
        <el-card shadow="never">
          <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="50" />
            <el-table-column prop="title" show-overflow-tooltip label="标题" width="240" />
            <el-table-column prop="subTitle" show-overflow-tooltip label="子标题" width="600" />
            <el-table-column prop="link" show-overflow-tooltip label="跳转链接" width="240">
              <template #default="scope">
                <el-link :href="scope.row.link" target="_blank">{{ scope.row.link }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="240" />
            <el-table-column fixed="right" label="操作" width="200">
              <template #default="scope">
                <el-button @click="handleUpdate(scope.row.id)" link type="primary" size="small">更新</el-button>
                <el-button @click="handleDelete(scope.row.id)" link type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  
    <el-dialog v-model="dialogVisible" title="新增/更新" width="30%" :before-close="() => dialogVisible = false">
      <el-form label-position="left" :model="createOrUpdateData" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="createOrUpdateData.title" />
        </el-form-item>
        <el-form-item label="子标题">
          <el-input type="textarea" :rows="4" v-model="createOrUpdateData.subTitle" />
        </el-form-item>
        <el-form-item label="详情信息">
          <el-input type="textarea" :rows="2" v-model="createOrUpdateData.detail" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="createOrUpdateData.link" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleCreateOrUpdate">确定</el-button>
          <el-button @click="() => dialogVisible = false"> 取消</el-button>
        </span>
      </template>
    </el-dialog>
  
  </template>
  
  <script lang="ts" setup>
  
  import { toRefs, ref, reactive } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { Delete, Download, Search, RefreshRight, Plus, Edit } from '@element-plus/icons-vue'
  import type { INotice, INoticeSelect, INoticeCreateOrUpdate } from "../type"
  import { noticeStore } from "../../../../../store";
  import { deepClone } from "../../../../../utils/deep-clone"
  import { noticeGetById, noticeUpdate, noticeInsert, noticeDelete } from "../../../../../api/notice";
  
  //子组件接收父组件数据
  const props = defineProps({
    list: Array<INotice>,
    currentIndex: {
      required: true,
      type: Number
    },
  });
  const { list, currentIndex } = toRefs(props);
  
  const selectedIds = ref<Array<string>>([]);
  const dialogVisible = ref<boolean>(false);
  
  const handleSelectionChange = (selected: Array<INotice>) => {
    selectedIds.value = selected.map((notice: INotice) => notice.id)
  }
  
  // 默认的查询条件
  const defaultSelectConditions: INoticeSelect = {
    type: currentIndex.value,
    title: "",
    detail: "",
    tempTime: "",
    beginTime: "",
    endTime: "",
  }
  
  // 新增或者更新的数据
  const defaultCreateOrUpdateDate: INoticeCreateOrUpdate = {
    id: "",
    type: currentIndex.value,
    title: "",
    subTitle: "",
    detail: "",
    link: "",
  }
  
  
  const selectedConditions = reactive(deepClone<INoticeSelect>(defaultSelectConditions));
  let createOrUpdateData = reactive(deepClone<INoticeCreateOrUpdate>(defaultCreateOrUpdateDate));
  
  // 搜索
  const handleSearch = () => {
    const requestData = deepClone<INoticeSelect>(selectedConditions);
    delete requestData["tempTime"]
    noticeStore.requestNotice(requestData)
  };
  
  // 重置
  const handleReset = () => {
    Object.assign(selectedConditions, deepClone<INoticeSelect>(defaultSelectConditions));
    handleSearch();
  };
  
  
  // 新增(弹框)
  const handleInsert = () => {
    createOrUpdateData = reactive(deepClone<INoticeCreateOrUpdate>(defaultCreateOrUpdateDate));
    dialogVisible.value = true
  };
  
  
  // 更新(弹框)
  const handleUpdate = async (id: string) => {
    const result = await noticeGetById(id);
    createOrUpdateData = reactive(result.data);
    dialogVisible.value = true;
  }
  
  
  // 删除
  const handleDelete = (id: string) => {
    ElMessageBox.confirm('确定要删除吗?', '删除', { type: "error" })
      .then(async () => {
        const result = await noticeDelete(id);
        const { code, message } = result
        if (code == 200) {
          ElMessage({ type: "success", message });
          handleSearch();
        } else {
          ElMessage({ type: "success", message });
        }
      })
      .catch(() => { })
  }
  
  // 导出
  const handleExport = () => ElMessage({ type: "warning", message: "功能开发中..." })
  
  // 新增或者更新
  const handleCreateOrUpdate = async () => {
    let result = null;
    if (createOrUpdateData.id) {
      // 更新
      result = await noticeUpdate(createOrUpdateData);
    } else {
      // 新增
      result = await noticeInsert(createOrUpdateData);
    }
  
    const { code, message } = result
    if (code == 200) {
      dialogVisible.value = false;
      ElMessage({ type: "success", message });
      handleSearch();
    } else {
      ElMessage({ type: "success", message });
    }
  }
  
  const datePickerChange = (value: any) => {
    // if (value[0] === value[1]) {
    //   value[1] = value[1].replace("00:00:00", "23:59:59");
    // }
    value[1] = value[1].replace("00:00:00", "23:59:59");
    selectedConditions.beginTime = value[0];
    selectedConditions.endTime = value[1];
  }
  
  </script>
  
  <style lang="less" scoped>
  #notice-list-container {
    background: transparent;
  }
  </style>
  ```

  
