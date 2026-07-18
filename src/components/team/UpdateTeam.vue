<script setup lang="ts">
import axios, { AxiosResponse } from 'axios'
import Config from '../../config/server'
import {
  NCard,
  NForm,
  NFormItem,
  NSpace,
  NInput,
  NButton,
  NSelect,
  useMessage,
  NModal,
  FormItemRule,
FormInst,
} from 'naive-ui'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamData } from '../../utility'
import { ROUTE_OPTIONS } from '../../config/walk'

let routeOptions = ref<SelectMixedOption[]>()
let formRef: any = ref<FormInst | null>(null)

const message = useMessage()
const router = useRouter()
const rules = {
  name: {
    required: true,
    validator(rule: any, value: any) {
      if (!value) {
        return new Error('请输入团队名称')
      } else if (!/^[a-z0-9A-Z\u4e00-\u9fa5]+$/.test(value)) {
        return new Error('只能含有汉字，数字和英文字母')
      }
      return true
    },
    trigger: 'blur',
  },
  slogan: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请输入口号')
      } else if (value.length > 35) {
        return new Error('口号请不要多于 35 字')
      } else if (!/^[a-z0-9A-Z\u4e00-\u9fa5 ]+$/.test(value)) {
        return new Error('只能含有汉字，数字和英文字母')
      }
      return true
    },
    trigger: 'blur',
  },
  password: {
    required: true,
    validator(rule: any, value: any) {
      if (!value) {
        return new Error('请输入团队密码')
      } else if (!/^[a-z0-9A-Z]+$/.test(value)) {
        return new Error('只能含有数字和英文字母')
      }
      return true
    },
    trigger: 'blur',
  },
}
const allowMatchOptions = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
]

function onPositiveClick() {
  showModal.value = false
  updateTeamAPI()
}
function onNegativeClick() {
  showModal.value = false
}
routeOptions.value = ROUTE_OPTIONS

const teamData: any = getTeamData()
const formValue = ref({
  name: teamData['name'],
  slogan: teamData['slogan'],
  password: teamData['password'],
  route_name: teamData['route_name'],
  allow_match: teamData['allow_match'] ? '1' : '0',
})
const showModal = ref(false)

function updateTeam() {
  formRef?.value.validate((errors: any) => {
    if (!errors) {
      if (formValue.value.allow_match == '1') {
        showModal.value = true
      } else {
        updateTeamAPI()
      }
    } else {
      message.error('请填写完整数据')
    }
  })
}
function updateTeamAPI() {
  const postData = {
    name: formValue.value.name,
    slogan: formValue.value.slogan,
    route_name: formValue.value.route_name,
    password: formValue.value.password,
    allow_match: formValue.value.allow_match == '1' ? true : false,
  }
  const createTeamUrl = Config.urlPrefix + Config.apiMap['team']['update']
  axios
    .post(createTeamUrl, postData, {
      timeout: 3000,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
    .then(function (response: AxiosResponse) {
      const respData: any = response.data
      if (respData['code'] == 200) {
        // 队伍创建成功
        message.success('更新成功')
        setTimeout(() => router.push('/loading'))
      } else {
        message.error(respData['message'])
      }
    })
    .catch(function (error) {
      message.error('请检查你的网络连接')
    })
}

function goBack() {
  router.push('/info/team/teaminfo')
}
</script>

<template>
  <n-card title="📖 &nbsp 修改团队" embedded :bordered="false">
    <div style="margin-top: 15px">
      <n-form :model="formValue" :rules="rules" label-placement="top" ref="formRef">
        <n-form-item label="团队名称" path="name">
          <n-input placeholder="输入名称" v-model:value="formValue.name"></n-input>
        </n-form-item>

        <n-form-item label="团队口号" path="slogan">
          <n-input placeholder="输入口号" v-model:value="formValue.slogan"></n-input>
        </n-form-item>

        <n-form-item label="团队密码" path="password">
          <n-input placeholder="输入密码" v-model:value="formValue.password"></n-input>
        </n-form-item>

        <n-form-item label="是否接受随机队员">
          <n-select v-model:value="formValue.allow_match" :options="allowMatchOptions"></n-select>
        </n-form-item>

        <n-form-item label="路线选择" path="route_name">
          <n-select
            disabled
            v-model:value="formValue.route_name"
            placeholder="请选择路线"
            :options="routeOptions"
          ></n-select>
        </n-form-item>

        <n-space :size="25" style="margin-top: 10px" :vertical="true">
          <n-button @click="updateTeam" style="width: 100%" type="primary" attr-type="button"
            >更新信息</n-button
          >
          <n-button @click="goBack" style="width: 100%" attr-type="button">返回上一步</n-button>
        </n-space>

        <n-modal
          v-model:show="showModal"
          :mask-closable="false"
          :closable="false"
          preset="dialog"
          title="是否允许队员随机加入"
          content="随机队伍可能有更多小哥哥小姐姐，但也有可能来者不善，有密码泄露的风险，为了不打扰您的安宁，请考虑关闭此功能"
          positive-text="确认"
          @positive-click="onPositiveClick"
          negative-text="再想想"
          @negative-click="onNegativeClick"
        />
      </n-form>
    </div>
  </n-card>
</template>

<style></style>
