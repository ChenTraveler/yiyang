<template>
  <div class="nf">
    <van-empty description="" />
    <h1>404，你的页面走丢了</h1>
    <div>
      <span>{{num}}秒后，</span>
      <router-link to="/index">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const num = ref(5)
const time = setInterval(() => {
  num.value -= 1
  if (num.value <= 0) {
    router.replace('index')
    num.value = 5
    clearInterval(time)
  }
}, 1000)
</script>

<style lang="stylus" scoped>
.nf
  display flex
  justify-content center
  margin-top 3rem
  flex-wrap wrap
  div
    width 100%
    text-align center
</style>
