<script lang="ts" setup>
import axios from 'axios'
import { NPageHeader, NCard, NAlert, NSpin, useMessage , NButton } from 'naive-ui'
import { onMounted, ref , nextTick} from 'vue'
import { useRouter } from 'vue-router'
import server from '../config/Server'
import html2canvas from 'html2canvas'
import { type } from 'os'
import b1 from "../assets/b1.png"
import b2 from "../assets/b2.png"
import b3 from "../assets/b3.png"
import b4 from "../assets/b4.png"
import b5 from "../assets/b5.png"
import r1 from "../assets/r1.png"
import r2 from "../assets/r2.png"
import r3 from "../assets/r3.png"
import r4 from "../assets/r4.png"
import r5 from "../assets/r5.png"


const router = useRouter()
let isLoading = ref(false)
const posterB = ref<keyof map>(1);
const posterR = ref<keyof map>(6);
const message = useMessage();
const team = ref({
  r: 0,
  name: "",
  members: [] as string[],
  slogan: ""
});
type member = {
  name: string
}



type map = { [n: number]: any};
const showAttention = ref(true);
const urlMap: map = {
  1 : b1,
  2: b2,
  3: b3,
  4: b4,
  5: b5,
  6: r1,
  7: r2,
  8: r3,
  9: r4,
  10: r5,
}
const memberColor = ['#331B14','#331B14','#1C1C42','#1C1C42','#243A24','#243A24']
const r = ref(0);
onMounted(async () => {
  axios.get(server.urlPrefix+server.apiMap.team.info,{
    timeout: 3000,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
  }).then((res: {
    data: any
  }) => {
    if(res.data.code !== 200)
      message.error("请求出错,请稍后重试");
    else {
      const teamData: {
        status: number
        route: number
        slogan: string
        name: string
        leader: {
          name: string
        }
        member: member[]
      } = res.data.data;
      console.log(teamData);
      if(teamData.status !== 4){
        message.info("请先完成毅行");
        setTimeout(() => {
          router.push('/info/user/showinfo')
        },1000)
      }
      else {
        team.value.r = teamData.route;
        posterB.value = team.value.r
        posterR.value = 5+team.value.r;
        team.value.slogan = teamData.slogan;
        team.value.name = teamData.name;
        team.value.members.push(teamData.leader.name);
        for(let member in teamData.member){
          team.value.members.push(teamData.member[member]["name"]);
        }
        isLoading.value = false;
      }
    }
  })

})

async function download(this: any) {
  await  nextTick();
  const content  = document.querySelector('.poster-img-container');
  console.log(content);
  //@ts-ignore
  html2canvas(content, {
    allowTaint: true,
    useCORS: true,
    height: content?.scrollHeight,
    width: 767
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      //@ts-ignore
      const href = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = href
      link.download = 'poster.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 'image/png')
  })
}

function goBack() {
  router.push('/info/user/showinfo')
}
function close() {
  showAttention.value = false;
}
</script>

<template>
  <n-card style=" width: 767px">
    <n-page-header title="团队海报查看" @back="goBack">
      <div v-if='showAttention'>
        <n-alert title="如何保存海报" type="info">点击保存海报即可保存,如手机端不可保存可以在微信浏览器电脑端保存 </n-alert>
        <div class="button-wrapper">
          <n-button  class='button-downLoad' @click="download()" round>
            <div style="margin-left: 8px">保存海报</div>
          </n-button>
          <n-button  class='button-downLoad' @click="close()" round>
            <div style="margin-left: 8px">隐藏提示</div>
          </n-button>
        </div>

      </div>
      <!-- 海报加载动画 -->
      <div v-if="isLoading" id="loading-state">
        <n-spin size="large">
          <template #description>
            <div id="loading-prompt">加载海报中</div>
          </template>
        </n-spin>
      </div>

    </n-page-header>
  </n-card>
  <div v-if='!isLoading' class="poster-img-container" >
    <img :src="urlMap[posterB]" id='poster-background' alt=''>
    <div id='poster-words'>
      <div id='team-name'>
        {{team.name}}
      </div>
      <div id='team-slogan'>
        ----{{team.slogan}}
      </div>
      <div id='team-member-wrapper' :style="{ color : memberColor[team.r] }">
        <ul id='team-member' v-for="member in team.members">
          {{member}}
        </ul>
      </div>
    </div>
    <img :src="urlMap[posterR]" id='poster-route'>
  </div>
</template>

<style>
.button-wrapper {
  display: flex;
}
.poster-img-container {
  position: relative;
  display: inline-block;
}

.button-downLoad {
  display: inline-block;
  top: 10px;
  margin: auto auto;
}

#poster-background {
  position: absolute;
  display: inline-block;
}

#poster-words {
  width: 1000px;
  display: inline-block;
  position: absolute;
  font-family: AlbbBold;
}

#team-name {
  color: #FFFFFF;
  left: 20px;
  top: 10px;
  position: absolute;
  font-size: 70px;
}

#team-slogan {
  left: 20px;
  top: 110px;
  color: #DDDDDD;
  position: absolute;
  font-size: 18px;
}

#team-member-wrapper {
  font-size: 60px;
  text-align: center;
  position: absolute;
  /*background: black;*/
  align-items: center;
  width: 700px;
  height: 200px;
  top: 270px;
}

#team-member{
  line-height: 20px;
}

#poster-route {
  position: absolute;
  font-family: albb;
}


#loading-state {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 30px;
}

#loading-prompt {
  margin-top: 20px;
}


</style>
