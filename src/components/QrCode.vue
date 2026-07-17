<script setup lang='ts'>
import QrcodeVue from 'qrcode.vue'
import { NCard } from 'naive-ui'
import { ref,onMounted } from 'vue'
import { getUserData } from '../utility'

const props = defineProps(['method'])

const { method } = props

const qrcode = ref()
const userId = ref(undefined)

const name = method === 'user' ? '️🔑' + String.fromCharCode(32) + '个人通行码' : '🔑' + String.fromCharCode(32) + '团队通行码'

onMounted(() => {
  flushCode();
})

const flushCode = () => {
  if (method === 'user') {
    const jwt = localStorage.getItem('jwt')
    const userData = getUserData()
    const time = new Date().getTime()
    qrcode.value = JSON.stringify({
      name: userData?.name,
      type: 3,
      user_id: userData?.id,
      time: time
    })
    userId.value = userData?.id
  } else if (method === 'team') {
    const teamData = JSON.parse(<string>localStorage.getItem('team_data'))

    const time = new Date().getTime()

    qrcode.value = JSON.stringify({
      type: 1,
      team_id: teamData?.id,
      time: time
    })
  }
}



</script>

<template>
  <n-card :title='name' embedded :bordered='false' size='small'>
    <div style='display:flex ;justify-content: center'>
      <qrcode-vue :value='qrcode' :size='150' level='H' />
    </div>
    <div v-if="method === 'user'" style="text-align: center;">{{ userId }}</div>
  </n-card>
</template>

<style scoped>

</style>



