module.exports = {
  title: '网捷回收',
  description: '网捷回收-项目开发文档',
  base: "/wjhs-doc/",
  theme: 'reco',
  markdown: {
    lineNumbers:true,
    extractHeaders: ['h4', 'h3']
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/63763453.jpg',
      },
    ],
  ],
  themeConfig: {
    // logo: ' /63763453.jpg',
    lastUpdated: '最后更新时间',
    sidebar: 'auto',
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '项目设计',
        link: '/pages/design.md',
      },
      {
        text: '服务端',
        link: '/pages/server.md',
      },
      {
        text: '平台端',
        link: '/pages/platform.md',
      },
      {
        text: 'APP',
        link: '/pages/app.md',
      },
      {
        text: '小程序',
        link: '/pages/mp.md',
      },
      {
        text: '迭代回顾',
        link: '/pages/iteration.md',
      },
      {
        text: '项目资源地址',
        items: [
          {
            text: '服务端',
            link: 'https://github.com/ilovesshan/wjhs.git',
          },
          {
            text: '平台端',
            link: 'https://github.com/ilovesshan/wjhs-admin.git',
          },
          {
            text: 'APP',
            link: 'https://github.com/ilovesshan/wjhs-app.git',
          },
          {
            text: '小程序',
            link: 'https://github.com/ilovesshan/wjhs-mp.git',
          },
        ],
      },
    ],
  },
}