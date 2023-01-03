<template>
  <div class="backhome">
    <img src="../assets/image/backhome.png" alt="" @click="backhome">
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const backhome = () => {
  router.push('/index')
}

</script>

<style lang="stylus" scoped>
.backhome
  position fixed
  right 0.4rem
  bottom 1rem
  opacity .5
  img
    width 1.2rem
    border-radius 50%
</style>
