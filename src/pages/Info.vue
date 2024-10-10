<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton, useMessage, NAlert, NSpace, NMessageProvider, NModal } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { defaultTab, getUserData } from '../utility'

const router = useRouter()
const message = useMessage()
const userData = getUserData()

// 该页面默认显示的 tab
const showModal = ref(false)
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
function onPositiveClick() {
    showModal.value = false
}

function showModalClick() {
  showModal.value = true
}
</script>

<template>
  <n-message-provider>
    <n-modal
      :show="showModal"
      :mask-closable="false"
      :closable="false"
      preset="dialog"
      title="报名须知"
      positive-text="确认"
      @positive-click="onPositiveClick"
    >
      <n-card
        style="width: 100%; height: 50vh; overflow: scroll"
        size="small"
        :bordered="false"
      >
        <n-space justify="center" style="font-size: large; font-weight: bold"
        >活动要求</n-space
        >
        <n-space>
          <div>
            毅行活动是一项中高强度长距离的徒步活动，对参赛者身体状况有较高的要求，参赛者应身体健康。
          </div>
          <div>有下述情况之一的不适宜参加毅行活动：</div>
          <div style='color: red'>1.先天性心脏病和风湿性心脏病患者；</div>
          <div style='color: red'>2.高血压和心脑血管疾病患者；</div>
          <div style='color: red'>3.心肌炎和其他心脏病患者；</div>
          <div style='color: red'>4.冠状动脉病患者和严重心律不齐者；</div>
          <div style='color: red'>5.血糖过高或过少的糖尿病患者；</div>
          <div style='color: red'>6.其它不适合运动的疾病患者。</div>
        </n-space>

        <br />
        <n-space justify="center" style="font-size: large; font-weight: bold"
        >出发&行进&打卡须知</n-space
        >
        <n-space>
          <div>
            1.毅行是一个团队协作的活动，请和队员以及其他团队之间互帮互助，团结合作，勿要走散；
          </div>
          <div>
            2.队伍半数以上人员到齐之后才可以在打卡点打卡；各打卡点必须逐一盖章，不得跳盖；
          </div>
          <div>
            3.每个打卡点都有关门时间，到达关门时间后不得前进，需从打卡点处的下撤点直接下山；
          </div>
          <div>4.请妥善保存打卡单，最终结果以打卡单为准；</div>
          <div>5.路线行至陡坡需有序通过；</div>
          <div>6.毅行的过程当中，请不要在一个地点逗留太久，以免造成堵塞；</div>
          <div>
            7.毅行途中请尽量避免与他人发生冲突，毅行不易，且行且珍惜。必要时请联系工作人员解决。
          </div>
        </n-space>

        <br />
        <n-space justify="center" style="font-size: large; font-weight: bold"
        >安全须知</n-space
        >
        <n-space>
          <div>
            1.身体不适者请及时在指定位置下撤终止毅行或就近选择安全地点等待工作人员救助；
          </div>
          <div>
            2.如果队伍中有人受伤需要立即联系身边最近的工作人员，原地等待医务人员救治，不要随意移动以免二次受伤；
          </div>
          <div>3.禁止吸烟、明火，以防山火；</div>
          <div>
            4.本次活动可能包括但不限于交通事故、摔伤、坠崖、溺水、低温、生物攻击等导致的伤害或者死亡的风险，请自行评估后再作是否参与本次活动的决定；
          </div>
          <div>
            5.全程较长，请合理估计自己的身体状况，合理选择全程线或半程线路，如果发生体力不支等意外情况请及时联系工作人员下山，切勿逞能，以防发生危险。
          </div>
        </n-space>

        <br />
        <n-space justify="center" style="font-size: large; font-weight: bold"
        >免责声明</n-space
        >
        <n-space>
          <div>
            1.凡报名参加者，均视为完全民事行为能力人。
          </div>
          <div>
            2.如在活动中产生人身损害后果，领队或召集人不承担赔偿责任，将由受损害人依据法律规定和本领队或召集人声明依法解决;
          </div>
          <div>
            3.凡报名者均视为接受本领队或召集人声明。
          </div>
          <div>
            4.最终解释权归浙江工业大学精弘网络所有。
          </div>
          <div>
            5.请仔细阅读本活动须知。因违反毅行规则而产生的一切后果需要自行承担，精弘网络概不负责。
          </div>
        </n-space>
      </n-card>
    </n-modal>
  </n-message-provider>

    <n-card title="毅行信息管理 &nbsp; 🚀" style="margin: 4% auto; width: 93%">
    <template #header-extra>
      <div style='display: flex; justify-content: space-between; gap: 10px'>
      <n-button @click=" showModalClick " round>
        <div style="margin-left: 5px">公告 🔥</div>
      </n-button>
      <n-button @click='refresh' round >
        <div style="margin-left: 5px">刷新 🔄</div>
      </n-button>
      </div>
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
