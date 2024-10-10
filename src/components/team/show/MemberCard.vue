<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { NTable, NTag, NSpace, NCard } from 'naive-ui';
const props = defineProps({
  name: String,
  isLeader: Boolean,
  tel: String,
  qq: String,
  walkStatus: Number,
  campus: Number,
  wechat: String,
  type: Number
});


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
  const walkStatus = props.walkStatus;
  if(walkStatus === 1) return '未开始'
  else if(walkStatus === 2) return '进行中'
  else if(walkStatus === 3) return '扫码成功'
  else if(walkStatus === 4) return '放弃'
  else if(walkStatus === 5) return '已完成'
})

const campusName = computed(() => {
  if (props.campus == 1) return '朝晖';
  else if (props.campus == 2) return '屏峰';
  else if (props.campus == 3) return '莫干山';
});
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
        <n-tag
          v-if="type == 1"
          style="margin-right: 10px"
          size="small"
          type="success"
        >学生</n-tag
        >
        <n-tag
          v-if="type == 2"
          style="margin-right: 10px"
          size="small"
          type="success"
          >教职工</n-tag
        >
        <n-tag v-if=' campus !== 0 ' style="margin-right: 10px" size="small" type="warning">{{
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
  </n-card>
</template>
