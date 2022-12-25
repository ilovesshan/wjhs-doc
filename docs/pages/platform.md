## 平台端开发文档


### 一、项目初始化

#### 1、集成 vue-router

+ 官网地址：https://router.vuejs.org/zh/

  

+ 安装vue-router

  ```
  # npm 安装
  npm install vue-router@4
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
  # NPM
  npm install element-plus --save
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

  

#### 4、集成 axios

+ 官网地址：https://www.axios-http.cn/

  

+ 安装axios

  ```
  # 使用 npm:
  npm install axios
  ```

  

### 二、工具类

#### 1、深拷贝

```typescript
export function deepClone<T>(data: object): T {
    return JSON.parse(JSON.stringify(data));
}
```



#### 2、本地存储

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



#### 3、网络请求

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
  prodBaseUrl: "https://ilovesshan/wjhs",
  prodTimeout: 5000,
}

export default ServiceConfig;
```

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



### 三、路由和Layout布局

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
    // 业务逻辑
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
              <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in">
                  <component :is="Component" />
                </transition>
              </router-view>
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
  
+ 组件切换动画css

  ```css
  /* fade */
  .fade-enter-active,
  .fade-leave-active {
      transition: opacity 0.28s;
  }
  
  .fade-enter,
  .fade-leave-active {
      opacity: 0;
  }
  
  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
      transition: all .5s;
  }
  
  .fade-transform-enter {
      opacity: 0;
      transform: translateX(-20px);
  }
  
  .fade-transform-leave-to {
      opacity: 0;
      transform: translateX(20px);
  }
  ```

  
