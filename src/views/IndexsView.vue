<template>
  <div class="home">
    <header class="header">
      <div class="top">
        <img src="../assets/image/logo.png" alt="">
        <span>弋阳县人民医院</span>
      </div>
      <div class="bottom">
          <img v-if="+flag !== 1" src="../assets/image/zx.png" alt="" @click="tz('/ksys')">
          <img v-if="+flag === 1" src="../assets/image/zfzx.png" alt="" @click="tz('/ksys')">
      </div>
    </header>
    <main class="main">
      <div class="top">
        <van-sidebar class="navs" v-model="keshi.show">
          <van-sidebar-item class="item" v-for="(item,index) in keshi.cont" :title="item" :key="index" />
        </van-sidebar>
      </div>
      <div class="bottom">
        <div class="cont">
          <YsCom :ys="ys" />
        </div>
      </div>
    </main>
    <FooterCom pname="home" />
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

const flag = 1
localStorage.setItem('showFlag', flag)

const ys = reactive({
  datay: [],
  data: computed(() => +keshi.show === 0 ? ys.datay : ys.datay.filter(i => i.ksmc === keshi.cont[keshi.show])),
  state: 1
})

const tz = (v) => {
  router.push(v)
}

proxy.$axios.get('/getKsYs', { showFlag: flag }).then(d => {
  if (d.code === 1) {
    ys.datay = d.data
    watchEffect(() => {
      ys.state = ys?.data[0] ? 2 : 0
    })
  }
})

const keshi = reactive({
  show: '0',
  isshow: false,
  cont: computed(() => {
    const data = ['全部科室']
    ys.datay.forEach((i, index) => {
      if (!data.includes(i.ksmc)) {
        data.push(i.ksmc)
      }
    })
    console.log(ys.datay, data)
    return data
  })
})

onMounted(() => {
  if (localStorage.getItem('ysdm')) localStorage.removeItem('ysdm')
  if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
    localStorage.setItem('token', route.query.openId || '')
  }
})
</script>

<style scoped lang="stylus">
.home
  background-color #f5f5f5
  min-height 100vh
  max-height 100vh
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
  max-height 61vh
  margin-top 0.2rem
  background-color #fff
  display flex
  justify-content space-between
  .top
      width 20%
      max-height 61vh
      overflow auto
    .navs
      width 100%
      .item
        padding 0.4rem 0.1rem
        text-align center
  .bottom
    width 80%
    max-height 61vh
    overflow auto
    .cont
      width 100%
      background-color #fff
      position relative
      padding 0 0 0.2rem
      margin-bottom 0.2rem
      .foot
        display flex
        justify-content center
        align-items center
        padding 0.2rem
</style>
