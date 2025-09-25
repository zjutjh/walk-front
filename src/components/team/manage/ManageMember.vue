<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NEmpty, NModal, NMessageProvider, NInput, useMessage } from 'naive-ui';
import ManageMemberCard from './ManageMemberCard.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ServerConfig from "../../../config/server"
import { useRefresh } from '../../../utility';

const message = useMessage()

// Vue router 对象
const router = useRouter();

const refresh = useRefresh()

// 团队数据
const teamData = ref(JSON.parse(<string>localStorage.getItem('team_data')));

function goBack() {
  router.push('/info/team/teaminfo');
}

//添加成员dialog
const isDialogShow = ref(false)
const memberId = ref("")
interface AddResponse {
  code: number
  data: null
  msg: string
}
const onSubmitAdd = async (): Promise<void> => {
  const joinTeamUrl = ServerConfig.urlPrefix + ServerConfig.apiMap['team']['add'];

  try{
    const addResult = await axios.get<AddResponse>(joinTeamUrl,{
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      params: {
        stuid: memberId.value
      },
      timeout: 3000
    }
    )
    if(addResult.data.code === 200) { 
      message.success("添加成员成功")
      refresh("/info/team/managemember")
    }else{
      message.error(addResult.data.msg)
    }
  }catch{
    (error: Error) => {
      message.error(error.message)
    }
  }
}
</script>

<template>
  <n-message-provider>
    <n-modal 
    :show="isDialogShow" 
    :closable="false"
    preset="dialog"
    title="增加队员"
    positive-text="提交"
    negative-text = "取消"
    @negative-click="() => isDialogShow = false"
    @positive-click="() => onSubmitAdd()"
    >
      <n-card
        style="width: 100%; height: 50vh"
        size="small"
        :bordered="false"
      >
        <div style="font-size: 16px;">请输入要添加的队员学号</div>
        <n-input
          style="margin-top: 8px;"
          placeholder="学号"
          v-model:value="memberId"
          @keyup.enter="onSubmitAdd"
        />
      </n-card>
    </n-modal>
  </n-message-provider>
  <manage-member-card
    style="margin-top: 15px"
    v-for="member in teamData['member']"
    :name="member['name']"
    :tel="member['contact']['tel']"
    :open-id="member['open_id']"
  ></manage-member-card>

  <n-empty
    style="margin-top: 30px; margin-bottom: 20px"
    v-if="teamData['member'] == null"
    description="还没有队员"
  ></n-empty>

  <n-button @click="() => isDialogShow = true" style="width: 100%; margin-top: 18px"
    >增加队员</n-button
  >

  <n-button @click="goBack" style="width: 100%; margin-top: 18px"
    >返回上一步</n-button
  >
</template>

<style></style>
