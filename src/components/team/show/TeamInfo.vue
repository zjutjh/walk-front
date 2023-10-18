<script setup lang="ts">
import {ref , computed} from 'vue'
import BasicInfo from './BasicInfo.vue'
import TeamInfoButtons from './TeamInfoButtons.vue'
import MemberInfo from './MemberInfo.vue'
import QrCode from '../../QrCode.vue'
import { getTeamData} from '../../../utility'

const teamData = ref(getTeamData())

const isSubmitted = computed(() => {
  return teamData.value['submitted'];
})
</script>

<template>
  <basic-info></basic-info>

  <qr-code method='team' v-show='isSubmitted'></qr-code>

  <member-info></member-info>

  <team-info-buttons></team-info-buttons>
</template>

<style></style>
