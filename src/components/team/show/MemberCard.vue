<script setup lang="ts">
import { computed } from 'vue';
import { NTable, NTag, NSpace, NCard, NButton, useMessage, useDialog } from 'naive-ui'
import Config from '../../../config/server'
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'
import { campusText, isCaptain, userTypeText, walkStatusText } from '../../../config/walk'
const message = useMessage()
const router = useRouter()
const dialog = useDialog()
const userData = JSON.parse(<string>localStorage.getItem("user_data"))
const props = defineProps({
  name: String,
  isLeader: Boolean,
  tel: String,
  qq: String,
  walkStatus: String,
  campus: String,
  wechat: String,
  type: String,
  userId: Number,
});
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
const handleClick = () => {
  dialog.warning({
    title: '警告',
    content: '你确定要转移队长？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      transferCaptain()
    },
    onNegativeClick: () => {},
  })
}
const transferCaptain = () => {
  const transferCaptainUrl = Config.urlPrefix + Config.apiMap['team']['transferCaptain']
  axios.post(transferCaptainUrl, { id: props.userId }, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    timeout: 3000,
  }).then(function (response: AxiosResponse) {
    const respData: any = response.data
    if (respData['code'] == 200) {
      message.success('移交成功')
      refresh()
    } else {
      message.error(respData['msg'])
    }
  })
    .catch(function (error) {
      message.error('请检查你的网络连接')
    })
}
const qqStr = computed(() => {
  const qqStr = props.qq;
  if (qqStr == '') return '无';
  else return qqStr;
});
const wechatStr = computed(() => {
  const wechatStr = props.wechat;
  if (wechatStr == '') return '无';
  else return wechatStr;
});

const walkStatus = computed(() => {
  return walkStatusText(props.walkStatus ?? '')
})

const campusName = computed(() => {
  return campusText(props.campus ?? '').replace('校区', '')
});

const typeName = computed(() => userTypeText(props.type ?? ''))
</script>

<template>
  <n-card
    :segmented="{
      content: 'soft',
    }"
    :title="'&nbsp;&nbsp;&nbsp;' + name"
    size="small"
  >
    <template #header-extra>
      <n-space>
        <n-tag style="margin-right: 10px" size="small" type="success">{{ typeName }}</n-tag>
        <n-tag v-if="campus" style="margin-right: 10px" size="small" type="warning">{{
          campusName
        }}</n-tag>
        <n-tag
          v-if="isLeader"
          style="margin-right: 10px"
          size="small"
          type="success"
          >队长</n-tag
        >
        <n-tag v-else style="margin-right: 10px" size="small" type="warning"
          >队员</n-tag
        >
      </n-space>
    </template>

    <n-table :bordered="false" :single-line="true">
      <tbody>
        <tr>
          <td>电话</td>
          <td style="text-align: right">{{ tel }}</td>
        </tr>
        <tr>
          <td>QQ</td>
          <td style="text-align: right">{{ qqStr }}</td>
        </tr>
        <tr>
          <td>微信</td>
          <td style="text-align: right">{{ wechatStr }}</td>
        </tr>
        <tr>
          <td>状态</td>
          <td style="text-align: right">{{ walkStatus }}</td>
        </tr>
      </tbody>
    </n-table>
    <n-button
      style="width: 100%; margin: 10px auto auto;"
      type="warning"
      v-if="!props.isLeader && isCaptain(userData['role'])"
      @click='handleClick'
    >移交队长</n-button>
  </n-card>
</template>
