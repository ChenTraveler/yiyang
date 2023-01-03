<template>
  <div class="wzxx" @click="other.tz">
    <div class="head" v-if="!other.isys">
      <div class="left">
        <img src="../assets/image/1.webp" alt="">
      </div>
      <div class="right" >
        <div class="name">{{ data?.ygxm || '医生' }} | {{ data?.ygjb || '住院医师' }}</div>
        <div class="hui">弋阳县人民医院</div>
      </div>
    </div>
    <div class="state hong">{{ other.state[data?.wzzt || 1] }}</div>
    <div class="main">
      <div>
        <span class="title">就 诊 人:</span>
        <span class="cont">{{ data?.name || '' }}</span>
      </div>
      <div class="van-multi-ellipsis--l2">
        <span class="title">症状描述:</span>
        <span class="cont">{{ data?.zzms ||  '' }}</span>
      </div>
    </div>
    <div class="foot hui">
      <div class="top">
        <div>门诊咨询</div>
        <div>图文</div>
      </div>
      <div class="bottom">
        <div class="date">{{ data.startime }}</div>
        <div class="price hong"  v-if="!other.isys">￥0</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(['data'])
const { data } = toRefs(props)
const other = reactive({
  ys: [],
  data: props.data,
  isys: localStorage.getItem('ysdm'),
  jzr: '',
  state: {
    '-1': '已取消',
    0: '待提问',
    1: '待接诊',
    2: '问诊中',
    3: '待评价',
    4: '问诊结束'
  },
  tz () {
    const map = reactive({
      '-1': () => ({
        path: '/wait',
        query: {
          status: -1,
          data: JSON.stringify(other.data)
        }
      }),
      0: () => ({
        path: '',
        query: {
          status: 0
        }
      }),
      1: () => ({
        path: '/wait',
        query: {
          data: JSON.stringify(other.data),
          status: 1
        }
      }),
      2: () => ({
        path: '/ltck',
        query: {
          data: JSON.stringify(other.data),
          time: other.time
        }
      }),
      3: () => ({
        path: '/ltck',
        query: {
          data: JSON.stringify(other.data),
          status: 3
        }
      }),
      4: () => ({
        path: '/ltck',
        query: {
          data: JSON.stringify(other.data),
          status: 4
        }
      })
    })
    router.push(other.isys ? map[2]() : map[other.data.wzzt]())
  }
})

// console.log(data)

</script>

<style lang="stylus" scoped>
.wzxx
  position relative
  width 100%
  background-color #fff
  padding 0.2rem
  .head
    display flex
    font-weight bold
    padding-bottom 0.1rem
    border-bottom 1px solid #f5f5f5
    margin-bottom 0.2rem
    .left
      img
        width 1rem
        height 1rem
    .right
      margin 0.1rem  0 0 0.2rem
      font-size 0.22rem
      .name
        font-size 0.25rem
        margin-bottom 0.1rem
  .state
    position absolute
    right 0.2rem
    top 0.2rem
.main
  >div
    margin-bottom 0.15rem
    display flex
    .title
      width 24%
      text-align justify
    .cont
      width 72%
      margin-left 0.2rem
      letter-spacing 0.06rem
.foot
  >div
    display flex
    justify-content space-between
  .top
    margin-bottom 0.2rem
</style>
