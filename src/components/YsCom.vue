<template>
  <div class="ys">
    <van-loading class="jz" size="24px" v-if="ys.state === 1">加载中...</van-loading>
    <van-empty description="没有医生排班" v-if="ys.state === 0" />
    <div class="cont shadow" v-for="item in ys.data" :key="item.ygdm"  @click="tz({name: 'yshome', query:{data:JSON.stringify(item)}}, item)">
      <div class="left">
        <img v-if="!item.image" src="../assets/image/1.webp" alt="">
        <img v-if="item.image" :src="item.image" alt="">
      </div>
      <div class="right">
        <div class="name">
          <div>{{item.ygxm}} <i v-if="item.ygjb">/</i><span class="texto">{{ item.ygjb }}</span></div>
          <div class="texto">当前接诊:<span class="green">{{ item.dq }}</span>人</div>
        </div>
        <div class="text"><span  class="l">{{item.ksmc}}</span><span class="r">弋阳县人民医院</span></div>
        <div class="text hui van-multi-ellipsis--l2">擅长:<span>{{ item.wzsc }}</span></div>
        <div class="text">接诊总量:<span class="red">{{ item.lj }}</span></div>
        <div class="iskz" v-if="+flag === 1 && !item?.hisDoctorPb?.dj">未开诊</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps(['ys'])
const router = useRouter()
const flag = localStorage.getItem('showFlag')

const { ys } = toRefs(props)

const tz = (v, s) => {
  sessionStorage.setItem('ysxx', JSON.stringify(s))
  router.push(v)
}

</script>

<style lang="stylus" scoped>
.ys
  .jz
      text-align center
      padding 0.2rem 0
  .cont
    display flex
    border-bottom 1px solid #f5f5f5
    padding 0.2rem 0.2rem
    margin-bottom 0.2rem
    img
      width 1.5rem
    .right
      position relative
      flex 1
      padding-left 0.3rem
      .name
        display flex
        width 100%
        justify-content space-between
        >div
          font-weight bold
      >div
        font-weight bold
        font-size 0.3rem
        margin-bottom 0.1rem
        span
          margin-left 0.2rem
          font-weight bold
      .text
        font-size 0.25rem
        .l
          margin 0 0.2rem 0 0
        .r
          margin 0
          white-space nowrap
      .texto
        font-size 0.25rem
        margin-left 0.1rem
      .iskz
        position absolute
        right -0.2rem
        bottom -0.1rem
        font-size 0.2rem
        color #fff
        background-color #f00
        padding 0.1rem 0.3rem
        border-radius: 0.5rem 0 0 0.5rem
</style>
