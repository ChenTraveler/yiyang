<template>
  <div class="yslb">
    <header class="header">
      <div>{{ ysxm }}医生,欢迎您</div>
    </header>
    <van-sidebar class="navs" v-model="data.nav">
      <van-sidebar-item title="待接诊" :badge="data.num" />
      <van-sidebar-item title="接诊中" :badge="data.nums" />
    </van-sidebar>
    <div class="bg" v-for="item in data.datay" :key="item">
       <WzxxCom class="shadow" :data="item" />
    </div>
  </div>
</template>

<script setup>
import WzxxCom from '@/components/WzxxCom.vue'
import { reactive, getCurrentInstance, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { proxy } = getCurrentInstance()
const ysxm = route.query.ysxm
console.log({
  openId: localStorage.getItem('token'),
  ygdm: route.query.ygdm
})
proxy.$axios.post('/chat/getltbt', {
  openId: localStorage.getItem('token'),
  ygdm: route.query.ygdm
}).then(d => {
  data.data = d.data
})
const data = reactive({
  data: [],
  datay: computed(() => {
    return data.data.filter(i => i.wzzt === data.nav + 1)
  }),
  num: computed(() => {
    return data.data.filter(i => i.wzzt === 1).length
  }),
  nums: computed(() => {
    return data.data.filter(i => i.wzzt === 2).length
  }),
  nav: 0
})
console.log(data)
</script>

<style lang="stylus" scoped>
.yslb
  min-height 100vh
  background-color #f5f5f5
  .shadow
    box-shadow: 0.2rem 0.2rem 0.5rem -0.1rem rgba(0,0,0,.2);
.header
  div
    text-align center
    padding 0.2rem
    background-color #fff
.navs
  position fixed
  left 0
  width 1.5rem
  height 100vh
  z-index 99
  background-color #fff
  .van-sidebar-item
    background-color #fff
  .van-sidebar-item.van-sidebar-item--select
    background-color #ededed
.bg
  margin 0 0 0.1rem 1.51rem
</style>
