<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton, useMessage, NAlert } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { defaultTab, getUserData } from '../utility'

const router = useRouter()
const message = useMessage()
const userData = getUserData()

// 该页面默认显示的 tab
const defaultTabName = ref(defaultTab())
// 用户信息页面默认要展示的是老师页面还是学生页面
const userInfoRoute = '/info/user/showinfo'
const messagesRoute = '/info/message/showlist'
const noMessageRoute = '/info/message/nomessage'

const showSubscribePrompt = computed(() => {
  if (localStorage.getItem('show_subscribe_prompt') == 'no') {
    return false
  } else {
    return true
  }
})

// 设置默认 tab 下显示的页面
onMounted(() => {
  if (defaultTab() == 'team') {
    if (userData['team_id'] < 0) {
      router.push('/info/team/notjoin')
    } else {
      router.push('/info/team/teaminfo')
    }
  } else if (defaultTab() === 'user') {
    router.push(userInfoRoute)
  } else if (defaultTab() === 'message') {
    if (localStorage.getItem('message_data') == '') {
      router.push(noMessageRoute)
    } else {
      router.push(messagesRoute)
    }
  }
})

// 在修改以后设置 tab 应该显示的页面
function changeTab(value: string) {
  if (value === 'team') {
    if (userData['team_id'] < 0) {
      router.push('/info/team/notjoin')
    } else {
      router.push('/info/team/teaminfo')
    }
  } else if (value === 'user') {
    router.push(userInfoRoute)
  } else if (value === 'message') {
    if (localStorage.getItem('message_data') == '') {
      router.push(noMessageRoute)
    } else {
      router.push(messagesRoute)
    }
  }
}

function refresh() {
  if (localStorage.getItem('canLoadInfo') == null || localStorage.getItem('canLoadInfo') == 'yes') {
    localStorage.setItem('canLoadInfo', 'no')
    router.push('/loading')
    setTimeout(() => {
      localStorage.setItem('canLoadInfo', 'yes')
    }, 1000)
  } else {
    message.warning('让生产队的驴休息一下吧')
  }
}

function closePrompt() {
  localStorage.setItem('show_subscribe_prompt', 'no')
}
</script>

<template>
  <n-card title="毅行信息管理 &nbsp; 🚀" style="margin: 4% auto; width: 93%">
    <template #header-extra>
      <n-button @click="refresh" round>
        <div style="margin-left: 8px">刷新 🔥</div>
      </n-button>
    </template>

    <n-tabs
      justify-content="space-evenly"
      @update:value="changeTab"
      :default-value="defaultTabName"
      type="line"
    >
      <n-tab-pane name="user" tab="个人信息">
        <router-view></router-view>
      </n-tab-pane>

      <n-tab-pane name="team" tab="团队信息">
        <router-view></router-view>
      </n-tab-pane>

      <n-tab-pane name="message" tab="消息列表">
        <n-alert
          v-if="showSubscribePrompt"
          title="关于微信消息通知"
          type="info"
          v-on:close="closePrompt"
          closable
          id="wechat-subscribe-prompt"
        >
          请关注「浙江工业大学精弘网络」公众号,以正常接收来自微信公众号的通知
          <br/><br/>
          关注后请立即点击公众号底部消息框发送 “收到”,以订阅毅行消息通知
        </n-alert>

        <router-view></router-view>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style>
#wechat-subscribe-prompt {
  margin-bottom: 13px;
}
</style>
