<script setup lang="ts">
import {
  NCard,
  NForm,
  NInput,
  NFormItem,
  NButton,
  NRadioGroup,
  NRadioButton,
  useMessage,
} from 'naive-ui';
import { ref } from 'vue';
import Server from '../../../config/server';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';

const formRef = ref();
const message = useMessage();
const router = useRouter();
const formValue = ref({
  name: '',
  home: '身份证号',
  id: '',
  tel: '',
});
const rules = ref({
  name: {
    required: true,
    message: '请输入姓名',
    trigger: 'blur',
  },
  id: {
    required: true,
    validator(rule: any, value: any) {
      if (!value) {
        return new Error('请输入' + formValue.value.home);
      } else if (formValue.value.home == '身份证号') {
        if (
          !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
            value
          )
        ) {
          return new Error(formValue.value.home + '格式不正确');
        }
      } else if (formValue.value.home == '港澳身份证') {
        if (!/^([A-Z]\d{6,10}(\(\w{1}\))?)$/.test(value)) {
          return new Error(formValue.value.home + '格式不正确');
        }
      } else if (formValue.value.home == '台湾身份证') {
        if (!/^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/.test(value)) {
          return new Error(formValue.value.home + '格式不正确');
        }
      } else if (formValue.value.home == '台湾身份证') {
        if (
          !/ ^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/.test(
            value
          )
        ) {
          return new Error(formValue.value.home + '格式不正确');
        }
      }
      return true;
    },
    trigger: ['input', 'blur'],
  },
    tel: {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('请输入电话号码');
        } else if (!/^1([3456789])\d{9}$/.test(value)) {
          return new Error('手机号格式不正确');
        }
        return true;
      },
      trigger: ['input', 'blur'],
    },
});

function submit() {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      // 提交数据
      const submitAlumniUrl =
        Server.urlPrefix + Server.apiMap['register']['alumni'];
      axios
        .post(submitAlumniUrl, formValue.value, {
          timeout: 3000,
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
        })
        .then(function (response: AxiosResponse) {
          const responseData: any = response.data;
          if (responseData['code'] == 200) {
            message.success('登录成功');
            setTimeout(() => router.push('/loading'), 1000); // 跳转到加载信息页面
          } else {
            message.error(responseData['msg']); // 报错信息
          }
        });
    } else {
      message.error('请正确输入数据');
    }
  });
}
</script>

<template>
  <n-form
    :model="formValue"
    :rules="rules"
    ref="formRef"
    style="margin: 10px auto 0"
  >
    <n-form-item style='margin-top: -30px'>
      <n-text style='color: gray'>以报名时所提交信息为准，可能由于报名时信息填写有误导致无法登录，如有问题联系吴同学，微信号：hrw654789</n-text>
    </n-form-item>
    <n-form-item label="姓名" path="name">
      <n-input placeholder="请输入姓名" v-model:value="formValue.name" />
    </n-form-item>

    <n-form-item :label="formValue.home" path="id">
      <n-input
        :placeholder="'请输入' + formValue.home"
        v-model:value="formValue.id"
      />
    </n-form-item>
    <n-form-item label="电话号码" path="tel">
      <n-input
        placeholder="请输入电话号码"
        v-model:value="formValue.tel"
      />
    </n-form-item>
    <n-form-item>
      <n-button
        @click="submit"
        attr-type="button"
        style="margin: auto; width: 100%"
        type="primary"
      >提交</n-button
      >
    </n-form-item>
  </n-form>
</template>

<style></style>
