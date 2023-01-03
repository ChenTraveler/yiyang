<template>
  <div class="wait">
    <header class="header">
      <div class="warn">24小时后会话自动关闭</div>
      <div class="bcxx">
        <span class="hui">补充初诊信息</span>
        <div class="btn">去补充</div>
      </div>
    </header>
    <main class="main">
      <div class="left">
        <img src="../assets/image/1.webp" alt="">
      </div>
      <div class="right">
        <div class="name">{{ data.ygxm }}</div>
        <div class="hui">{{ data.ygjb }}</div>
        <div class="hui">{{ data.ksmc }}</div>
        <div class="hui">弋阳县人民医院</div>
        <div class="huang" v-if="false">接诊我0次</div>
      </div>
      <div class="btns hui_6">
        <div class="ml" v-if="false">问诊信息</div>
        <div v-if="false">查病历夹</div>
      </div>
      <div class="backhome" @click="tz('/index')">
        回到首页
      </div>
    </main>
    <footer class="footer">
      <div class="cont">已通知医生接诊，请耐心等待</div>
      <div class="tips hui">若超过24小时医生未及时处理订单，系统自动退诊，诊金及其他费用原路退回</div>
      <div class="btn hui" v-if="+status !==  -1" @click="quxiao">取消问诊</div>
      <div class="btn hui" v-if="+status ===  -1" @click="router.replace('/index')">已取消，再次问诊？</div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const data = route.query.data && reactive(JSON.parse(route.query.data))
const xx = route.query.xx && route.query.data && reactive(JSON.parse(route.query.xx))
const status = route.query?.status

const quxiao = () => {
  showConfirmDialog({
    title: '是否确认取消就诊'
  })
    .then(() => {
      proxy.$axios.post('/chat/endCaht', {
        titleId: xx?.id || data.id,
        status: -1
      }).then(d => {
        if (d.code === 1) {
          router.push('/index')
        }
      })
    })
}

const tz = (v) => {
  router.push(v)
}

console.log(data)
</script>

<style lang="stylus" scoped>
.wait
  background-color #f5f5f5
  min-height 100vh
.header
  width 100%
  margin-bottom 0.1rem
  .warn
    background-color #f8f0ee
    padding 0.2rem 0
    display flex
    align-items center
    justify-content center
    color #dd796c
    font-weight bold
  .bcxx
    display flex
    justify-content space-between
    padding 0.2rem 0.2rem
    align-items center
    background-color #fff
    .btn
      padding 0.05rem 0.3rem
      background-color #16a589
      color #fff
      border-radius 10rem
.main
  position relative
  width 100%
  background-color #fff
  padding 0.2rem 0.4rem 0.4rem
  display flex
  flex-wrap wrap
  margin-bottom 0.3rem
  .backhome
    position absolute
    right 0
    top 0.2rem
    color #fff
    background-color #16a589
    border-radius 10rem 0 0 10rem
    padding 0.1rem 0.35rem 0.15rem 0.3rem
  .left
    img
      width 1.5rem
      height 1.5rem
  .right
    .name
      font-size 0.3rem
      font-weight bold
    div
      margin-bottom 0.1rem
  .btns
    width 100%
    display flex
    justify-content center
    div
      padding 0.12rem 0.2rem
      border 1px solid #ccc
      border-radius 10rem
    .ml
      margin-right 0.2rem
.footer
  padding 0 0.2rem
  .cont
    font-size 0.3rem
    margin-bottom 0.2rem
  .tips
    line-height 0.4rem
  .btn
    text-align center
    font-size 0.3rem
    margin-top 0.2rem
    text-decoration underline
</style>
