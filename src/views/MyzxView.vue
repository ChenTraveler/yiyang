<template>
  <div class="myzx">
    <header class="header">
      <van-dropdown-menu>
        <van-dropdown-item v-model="zx.val" :options="zx.option" />
      </van-dropdown-menu>
    </header>
    <main class="main">
      <div class="dyg"  v-for="item in zx.data" :key="item.id">
        <WzxxComVue class="shadow" :data="item" />
      </div>
    </main>
    <FooterCom pname="myzx" />
  </div>
</template>

<script setup>
import WzxxComVue from '@/components/WzxxCom.vue'
import FooterCom from '@/components/FooterCom.vue'
import { reactive, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()

const zx = reactive({
  val: 'all',
  xxbg: [],
  data: computed(() => {
    return zx.val === 'all' ? zx.xxbg : zx.xxbg.filter(i => i.gx === zx.val)
  }),
  option: [
    { text: '就诊人', value: 'all' },
    { text: '本人', value: '本人' },
    { text: '家人', value: '家人' },
    { text: '朋友', value: '朋友' }
  ]
})

proxy.$axios.post('/chat/getltbt', { openId: localStorage.getItem('token') }).then(d => {
  console.log(d)
  if (d.code === 1) {
    zx.xxbg = d.data
  }
})
</script>

<style lang="stylus" scoped>
.myzx
  min-height 100vh
  background-color #f5f5f5
  padding-bottom 2rem
  .header
    width 100%
    position fixed
    left 0
    top 0
    z-index 9
.main
  padding-top 0.8rem
  .dyg
    margin-bottom 0.1rem
</style>
