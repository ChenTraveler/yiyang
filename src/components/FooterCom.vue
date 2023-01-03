<template>
  <footer class="footer" v-show="nav.pageName">
    <div v-for="item in nav.navs" :key="item.name">
      <router-link :to="item.path" :class="nav.pageName===item.name ? 'btn active' : 'btn'">
        <i :class="'iconfont ' + item.icon"></i>
        <span>{{item.text}}</span>
      </router-link>
    </div>
  </footer>
</template>

<script setup>
import { reactive, defineProps } from 'vue'

const props = defineProps(['pname'])

const nav = reactive({
  navs: [
    {
      name: 'home',
      path: '/index',
      icon: 'icon-yiyuan',
      text: '首页'
    },
    {
      name: 'myzx',
      path: '/myzx',
      icon: 'icon-xiaoxi',
      text: '我的问诊'
    }
  ],
  pageName: props.pname,
  cPage (v) {
    nav.pageName = v
  }
})

</script>

<style scoped lang="stylus">
.footer
  position fixed
  background-color #fff
  left 0
  bottom 0
  display flex
  width 100%
  height: 0.9rem
  border-top: 0.02px solid #ddd
  div
    width 100%
    display flex
    justify-content center
    .btn
      display flex
      flex-direction column
      justify-content center
      align-items center
      i
        font-size 0.5rem
        color #898f98
      span
        font-size 0.12rem
        color #898f98
    .btn.active
      i
        color #68b442
      span
        color #68b442
</style>
