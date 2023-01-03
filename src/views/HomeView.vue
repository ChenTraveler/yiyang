<template>
  <div class="home">
    <header class="header">
      <div class="top">
        <img src="../assets/image/logo.png" alt="">
        <span>弋阳县人民医院</span>
      </div>
      <div class="bottom">
          <img src="../assets/image/zx.png" alt="" @click="tz('/ksys')">
      </div>
    </header>
    <main class="main">
      <div class="head">优选医护</div>
      <YsCom :ys="ys" />
    </main>
    <FooterCom pname="home" />
  </div>
</template>

<script setup>
import FooterCom from '@/components/FooterCom.vue'
import YsCom from '@/components/YsCom.vue'
import { getCurrentInstance, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

const ys = reactive({
  data: [],
  num: [],
  state: 1
})

const tz = (v) => {
  router.push(v)
}

proxy.$axios.get('/getKsYs').then(d => {
  console.log(d.data)
  ys.data = d.data
  ys.state = ys?.data[0] ? 2 : 0
})

onMounted(() => {
  if (localStorage.getItem('ysdm')) localStorage.removeItem('ysdm')
  if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
    // proxy.$axios.get('/getToken').then(d => {
    //   if (d.msg === '成功') {  }
    // })
    localStorage.setItem('token', route.query.openId || '')
  }
})
</script>

<style scoped lang="stylus">
.home
  background-color #f5f5f5
  min-height 100vh
  padding-bottom 1.5rem
.header
  display flex
  flex-wrap wrap
  background-color #0EAEAE
  padding 0.2rem 0.2rem  0.3rem
  .top
    width 100%
    display flex
    align-items center
    img
      width 1rem
      border-radius 50%
      margin-right 0.2rem
    span
      color: #fff
      font-weight bold
      font-size 0.3rem
      letter-spacing 0.05rem
  .bottom
    img
      width 100%
      margin-top 0.2rem
.main
  margin-top 0.2rem
  background-color #fff
  padding 0.2rem 0.2rem 0
</style>
