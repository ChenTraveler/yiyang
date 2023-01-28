<template>
  <div class="ksys">
    <header class="header shadow">
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
    </header>
    <main class="main">
      <YsCom  :ys="ys" />
    </main>
    <BackHome />
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance()
const flag = localStorage.getItem('showFlag')

const ys = reactive({
  datay: [],
  data: computed(() => {
    const d = keshi.show === '全部科室' ? ys.datay : ys.datay.filter(i => i.ksmc === keshi.show)
    const da = !search.value.trim() ? d : d.filter(i => i.ygxm.includes(search.value.trim()))
    return da
  }),
  state: 1
})

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
</script>

<style lang="stylus" scoped>
.ksys
  background-color #f5f5f5
  padding-bottom 0.7rem
  min-height 100vh
.header
  position fixed
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
.main
  background-color #fff
  position relative
  padding 1.8rem 0.2rem 0.2rem
  .foot
    display flex
    justify-content center
    align-items center
    padding 0.2rem
</style>
