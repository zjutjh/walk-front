<script setup lang='ts'>
import QrcodeVue from 'qrcode.vue'
import { NCard } from 'naive-ui'
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'

const props = defineProps(['method'])

const { method } = props

const qrcode = ref()

const name = method === 'user' ? '️🔑' + String.fromCharCode(32) + '个人通行码' : '🔑' + String.fromCharCode(32) + '团队通行码'

onMounted(() => {
  flushCode();
})

const flushCode = () => {
  if (method === 'user') {
    const jwt = localStorage.getItem('jwt')

    const time = new Date().getTime()

    qrcode.value = JSON.stringify({
      status: 3,
      jwt: "Bearer " + jwt,
      time: time
    })
  } else if (method === 'team') {
    const teamData = ref(JSON.parse(<string>localStorage.getItem('team_data')))

    const time = new Date().getTime()

    qrcode.value = JSON.stringify({
      status: 1,
      team_id: teamData.value['id'],
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
  </n-card>
</template>

<style scoped>

</style>



