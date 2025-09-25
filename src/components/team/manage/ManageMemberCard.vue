<script setup lang="ts">
import { NSpace, NButton, NCard, useMessage } from 'naive-ui'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Server from '../../../config/server'
import { useRefresh } from '../../../utility'

const message = useMessage()
const router = useRouter()
const refresh = useRefresh()

defineProps({
  name: String,
  isLeader: Boolean,
  tel: String,
  openId: String,
})

interface RemoveResponse{
  code: number;
  data: null;
  msg: string
}

function removeMember(openID: string | undefined) {
  const removeMemberUrl = Server.urlPrefix + Server.apiMap['team']['remove']
  axios
    .get<RemoveResponse>(removeMemberUrl, {
      params: {
        openid: openID,
      },
      timeout: 3000,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
    .then(function (result) {
      if(result.data.code === 200) {
        message.success('删除队员成功')
        refresh("/info/team/managemember")
      }else{
        message.error(result.data.msg)
      }
    })
    .catch(function (_) {
      message.error('网络错误，请检查网络')
    })
}
</script>

<template>
  <n-card
    :segmented="{
      content: 'soft',
    }"
    embedded
    :title="name"
    size="small"
  >
    <template #header-extra>
      <n-button @click="removeMember(openId)" :type="'error'" size="small">删除</n-button>
    </template>
    <n-space justify="space-between">
      <div>电话</div>
      <div style="text-align: right">{{ tel }}</div>
    </n-space>
  </n-card>
</template>
