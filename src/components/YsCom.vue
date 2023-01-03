<template>
  <div class="ys">
    <van-loading class="jz" size="24px" v-if="ys.state === 1">加载中...</van-loading>
    <van-empty description="没有医生排班" v-if="ys.state === 0" />
    <div class="cont" v-for="item in ys.data" :key="item.ygdm"  @click="tz({name: 'yshome', query:{data:JSON.stringify(item)}}, item)">
      <div class="left">
        <img src="../assets/image/1.webp" alt="">
      </div>
      <div class="right">
        <div class="name">
          <div>{{item.ygxm}} /<span class="texto">{{ item.ygjb || '住院医师' }}</span></div>
          <div class="texto">当前接诊:<span class="green">{{ item.dq }}</span>人</div>
        </div>
        <div class="text">{{item.ksmc}}<span>弋阳县人民医院</span></div>
        <div class="text hui van-multi-ellipsis--l2">擅长:<span>{{ item.wzsc }}</span></div>
        <div class="text">接诊总量:<span class="red">{{ item.lj }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, defineProps } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['ys'])
const router = useRouter()

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
    .head
      font-size 0.3rem
      font-weight bold
      padding-left 0.2rem
      margin-bottom 0.4rem
      border-left 0.05rem solid #68b73d
    .cont
      display flex
      border-bottom 1px solid #f5f5f5
      padding 0.2rem 0
      img
        width 1.5rem
        height 1.5rem
      .right
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
        .texto
          font-size 0.25rem
          margin-left 0.1rem
</style>
