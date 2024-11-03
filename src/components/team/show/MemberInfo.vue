<script lang="ts" setup>
import { NCard, NButton, NTag } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MemberCard from './MemberCard.vue'
import { getTeamData, getUserData } from '../../../utility'

const router = useRouter()

// 展示用的数据
const teamData = ref(getTeamData())
console.log(teamData)

// 是否是队长
const isLeader = computed(() => {
  const userData = getUserData()
  return userData['status'] == '2' ? true : false
})

function jumpToManageMember() {
  router.push('/info/team/managemember')
}


const isAllTeacher = computed(() => {
  for(const member in teamData['member']) {
    if(member['type'] != 2) return false
  }
  return true
})

const teamName = computed(() => {
  if(teamData.value['leader']['type'] === 3){
    return "校友队"
  } else if (teamData.value['leader']['type'] === 1) {
    return "学生队"
  } else if (teamData.value['leader']['type'] === 2 && isAllTeacher.value) {
    return "老师队"
  } else {
    return "师生队"
  }
})
</script>

<template>
  <n-card title="🧑‍🎓 &nbsp; 队员信息" embedded :bordered="false" size="small">
    <template #header-extra>
      <n-tag
        style="margin-right: 10px"
        size="small"
        type="success"
      >{{ teamName }}</n-tag>
      <n-button v-if="isLeader && !teamData['submitted']" @click="jumpToManageMember" size="small" round
        >管理团队</n-button>
    </template>
    <!-- 领队信息 -->
    <member-card
      :name="teamData['leader']['name']"
      :tel="teamData['leader']['contact']['tel']"
      :qq="teamData['leader']['contact']['qq']"
      :wechat="teamData['leader']['contact']['wechat']"
      :walk-status="teamData['leader']['walk_status']"
      :is-leader="true"
      :campus="teamData['leader']['campus']"
      :type="teamData['leader']['type']"
    ></member-card>

    <!-- 队员信息 -->
    <member-card
      style="margin-top: 15px"
      v-for="member in teamData['member']"
      :name="member['name']"
      :campus="member['campus']"
      :tel="member['contact']['tel']"
      :qq="member['contact']['qq']"
      :wechat="member['contact']['wechat']"
      :walk-status="member['walk_status']"
      :is-leader="false"
      :type="member['type']"
      :openid = "member['open_id']"
    ></member-card>
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
