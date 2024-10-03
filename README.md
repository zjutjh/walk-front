# 精弘毅行报名系统 · 前端

精弘毅行报名系统是使用Vue3 + TS + 微信相关接口开发的团队报名系统,并配套搭建了管理员小程序端用于点位签到打卡


## 技术栈

- Vue
- Naive UI
- Axios
- qrcode-vue

## 快速开始

1. 配置`/src/config/server.ts`
2. 安装依赖`pnpm i`
3. 让后端小伙伴设置 `frontend` 中的 `url` 为本机地址
4. `pnpm run dev` 电脑微信打开 `localhost:PORT`, 复制url到电脑微信打开
5. Coding

> 如果硬要普通浏览器打开，需要复制账号的 token，写到 localStorage 的 jwt 字段下

## 打包部署


> `pnpm run build` 后将在根目录生成的dist文件压缩成压缩包发给后端小伙伴 


## 更多资料

- Native UI 官方文档: [https://www.naiveui.com/zh-CN/os-theme/](https://www.naiveui.com/zh-CN/os-theme/)
- 毅行管理员小程序: [https://github.com/zjutjh/walk-view-admin-taro](https://github.com/zjutjh/walk-view-admin-taro)

## 开发者

精弘毅行报名系统能走到今天，离不开这些开发者对前端的贡献❤️

<a href="https://github.com/zjutjh/walk-front/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=zjutjh/walk-front"/>
</a>
