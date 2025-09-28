import 'vfonts/FiraCode.css'
import 'vfonts/Lato.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import VConsole from 'vconsole'
import { routes } from './routes'
import { disableWeChatShare, isWeChatBrowser } from './utility'

// 设置前端路由
const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')

const enforceWeChatMenuPolicy = () => {
  if (isWeChatBrowser()) {
    disableWeChatShare()
  }
}

router.isReady().then(() => {
  enforceWeChatMenuPolicy()
  router.afterEach(() => {
    enforceWeChatMenuPolicy()
  })
})

if (import.meta.env.DEV) {
  setTimeout(() => {
    new VConsole();
    console.warn("DEV 环境下 VConsole 启动")
  })
}
