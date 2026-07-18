<script lang="ts" setup>
import { NCard, NTable, NButton, useMessage, useDialog, NTag } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamData, getUserData } from '../../../utility'
import { isCaptain, pointText, routeText, teamStatusText } from '../../../config/walk'

const teamData = ref(getTeamData())
const router = useRouter()


// 是否是队长
const isLeader = computed(() => {
  const userData = getUserData()
  return isCaptain(userData['role'])
})

// 是否能允许随机
const allowMatch = computed(() => {
  if (teamData.value['allow_match'] == true) return '允许 ✅'
  else return '不允许 ❎'
})

// 是否提交
const isSubmitted = computed(() => {
  if (teamData.value['submitted']) {
    return '提交成功 ✅'
  } else {
    return '尚未提交 ❎'
  }
})

// 毅行路线数据
const teamRoute = computed(() => {
  return routeText(teamData.value['route_name'])
})

const teamStatus = computed(() => {
  return teamStatusText(teamData.value['status'])
})

const teamPoint = computed(() => {
  return pointText(teamData.value['point_name'])
})

function jumpToUpdateTeam() {
  router.push('/info/team/updateteam')
}


</script>

<template>
  <n-card title="👟 &nbsp; 基本信息" embedded :bordered="false" size="small">
    <template #header-extra>
      <n-button v-if="isLeader && !teamData['submitted']" @click="jumpToUpdateTeam" size="small" round
        >修改信息</n-button
      >
    </template>
    <n-table :bordered="true" :single-line="false">
      <tbody>
        <tr>
          <td class="left-item">
            <strong>是否提交</strong>
          </td>
          <td class="right-item">{{ isSubmitted }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>团队名称</strong>
          </td>
          <td class="right-item">{{ teamData['name'] }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>团队口号</strong>
          </td>
          <td class="right-item">{{ teamData['slogan'] }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>团队编号</strong>
          </td>
          <td class="right-item">{{ teamData['id'] }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>团队密码</strong>
          </td>
          <td class="right-item">{{ teamData['password'] }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>毅行路线</strong>
          </td>
          <td class="right-item">{{ teamRoute }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>随机队员</strong>
          </td>
          <td class="right-item">{{ allowMatch }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>团队状态</strong>
          </td>
          <td class="right-item">{{ teamStatus }}</td>
        </tr>

        <tr>
          <td class="left-item">
            <strong>当前点位</strong>
          </td>
          <td class="right-item">{{ teamPoint }}</td>
        </tr>
      </tbody>
    </n-table>
  </n-card>

</template>

<style>
.left-item {
  text-align: center;
  width: 40%;
}
.right-item {
  text-align: center;
}
.right-teammate-item {
  text-align: center;
}
</style>
