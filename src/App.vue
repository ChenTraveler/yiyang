<template>
  <router-view/>
</template>

<script setup>
onBeforeUnmount(() => {
  console.log('app')
  localStorage.removeItem('showFlag')
})
</script>

<style lang="stylus">
</style>
