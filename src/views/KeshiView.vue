<template>
  <div class="ksys">
    <header class="header">
      <div class="search">
        <img src="../assets/image/search.jpg" alt="">
        <input type="text" placeholder="医生" v-model="search.val">
        <div class="btn" @click="search.cv">搜索</div>
      </div>
    </header>
    <main class="main">
      <div class="head">
        <div class="xx" @click="keshi.cisshow(true)">
          {{keshi.show}}<span>﹀</span>
        </div>
        <div class="keshi" v-show="keshi.isshow">
          <div class="bg" @click="keshi.cisshow(false)"></div>
          <div class="xz">
            <div v-for="item in keshi.cont"  :key="item.at" :class="{active:keshi.xz === item.at}" @click="keshi.cks(item.at,item.name)">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <YsCom  :ys="ys" />
      <!-- <van-loading class="jz" v-if="!ys.datay[0]">加载中...</van-loading>
      <div class="jz" v-if="ys.datay[0] && !ys.data[0]">没有数据</div>
      <div class="cont" v-for="item in ys.data" :key="item.ygdm" @click="tz({name: 'yshome', query:{data:JSON.stringify(item)}})">
        <div class="left">
          <img src="../assets/image/1.webp" alt="">
        </div>
        <div class="right">
          <div class="name">
            <div>{{item.ygxm}} /<span class="texto">{{item.ygjb || '住院医师'}}</span></div>
            <div class="texto">当前接诊:<span class="green">15</span>人</div>
          </div>
          <div class="text">{{item.ksmc}}<span>弋阳县人民医院</span></div>
          <div class="text hui">擅长:<span></span></div>
        </div>
      </div> -->
    </main>
    <BackHome />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, watchEffect } from 'vue'
// import { useRouter } from 'vue-router'
import BackHome from '@/components/BackHome.vue'
import YsCom from '@/components/YsCom.vue'

// const router = useRouter()
const { proxy } = getCurrentInstance()

// const tz = (v) => {
//   router.push(v)
// }

const ys = reactive({
  datay: [],
  data: computed(() => {
    const d = keshi.show === '全部科室' ? ys.datay : ys.datay.filter(i => i.ksmc === keshi.show)
    const da = !search.value.trim() ? d : d.filter(i => i.ygxm.includes(search.value.trim()))
    return da
  }),
  state: 1
})

proxy.$axios.get('/getKsYs').then(d => {
  ys.datay = d.data
  ys.state = ys.datay[0] ? 2 : 0
  console.log(d.data)
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
        name: '全部科室',
        at: 'all'
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
        name: type[key],
        at: key
      })
    }
    return data
  }),
  cisshow (v) {
    keshi.isshow = v
  },
  cks (v, s) {
    keshi.xz = v
    keshi.show = s
    keshi.isshow = false
  }
})

watchEffect(() => {
  ys.state = ys.data[0] ? 2 : 0
})

</script>

<style lang="stylus" scoped>
.ksys
  background-color #f5f5f5
  padding-bottom 3rem
  min-height 100vh
.header
  background-color #fff
  padding 0.2rem 0.4rem
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
.main
  background-color #fff
  position relative
  padding 0.2rem
  .head
    display flex
    div
      font-weight bold
    span
      font-family monospace
      font-weight bold
      margin-left 0.1rem
    .keshi
      position absolute
      left 0
      top 0.6rem
      width 100%
      height calc(100vh - 1.83rem)
      .bg
        position absolute
        z-index 0
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
      .xz
        position relative
        z-index 1
        height 50%
        background-color #f5f5f5
        overflow auto
        div
          padding 0.2rem 0.2rem
        div.active
          background-color #fff
  .foot
    display flex
    justify-content center
    align-items center
    padding 0.2rem
</style>
