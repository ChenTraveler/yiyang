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
      <div class="ksys">
        <div class="headest">
          <div class="search">
            <img src="../assets/image/search.jpg" alt="">
            <input type="text" placeholder="医生姓名" v-model="search.val">
            <div class="btn" @click="search.cv">搜索</div>
          </div>
          <div class="head">
            <van-field
              v-model="keshi.show"
              is-link
              readonly
              @click="keshi.isshow = true"
            />
            <van-popup v-model:show="keshi.isshow" round position="bottom">
              <van-picker
                :columns="keshi.cont"
                @cancel="keshi.isshow = false"
                @confirm="keshi.onConfirm"
              />
            </van-popup>
          </div>
        </div>
        <div class="cont">
          <YsCom  :ys="ys" />
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
  data: computed(() => {
    const d = keshi.show === '全部科室' ? ys.datay : ys.datay.filter(i => i.ksmc === keshi.show)
    const da = !search.value.trim() ? d : d.filter(i => i.ygxm.includes(search.value.trim()))
    return da
  }),
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

const search = reactive({
  val: '',
  value: '',
  cv () {
    search.value = search.val
  }
})

watchEffect(() => {
  if (search.val === '') {
    search.value = ''
  }
})

const keshi = reactive({
  show: '全部科室',
  isshow: false,
  xz: 'all',
  cont: computed(() => {
    const data = [
      {
        text: '全部科室',
        value: 'all'
      }
    ]
    const type = {}
    ys.datay.forEach((i, index) => {
      if (!Object.values(type).includes(i.ksmc)) {
        type['ksmc' + index] = i.ksmc
      }
    })
    for (const key in type) {
      data.push({
        text: type[key],
        value: key
      })
    }
    return data
  }),
  onConfirm ({ selectedOptions }) {
    keshi.isshow = false
    keshi.show = selectedOptions[0].text
  }
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
  padding 0.2rem 0 0
  .ksys
    position relative
    background-color #f5f5f5
    .headest
      position absolute
      width 100%
      left 0
      top 0
      z-index 999
      background-color #fff
      padding 0.2rem 0.4rem 0
      border-bottom 1px solid #f5f5f5
      .search
        display flex
        align-items center
        border 1px solid #ccc
        border-radius 1rem
        height 0.8rem
        padding 0 0.3rem
        img
          width 0.6rem
          border-radius 50%
        input
          border 0
          width 65%
        .btn
          font-weight bold
          font-size 0.3rem
          letter-spacing 0.05rem
          border-left: 1px solid #ccc
          padding-left 0.2rem
      .head
        display flex
        font-weight bold
    .cont
      background-color #fff
      position relative
      padding 1.8rem 0 0.2rem
      .foot
        display flex
        justify-content center
        align-items center
        padding 0.2rem
</style>
