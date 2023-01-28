<template>
  <div class="myzx">
    <header class="header">
      <van-dropdown-menu>
        <van-dropdown-item v-model="zx.val" :options="zx.option" />
      </van-dropdown-menu>
    </header>
    <main class="main">
      <van-empty description="暂无数据，快去问诊吧" v-if="!zx.data.length" />
      <div class="dyg"  v-for="item in zx.data" :key="item.id">
        <WzxxCom class="shadow" :data="item" />
      </div>
    </main>
    <FooterCom pname="myzx" />
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance()

const zx = reactive({
  val: 'all',
  xxbg: [],
  data: computed(() => {
    const data = (zx.val === 'all' ? zx.xxbg.reverse() : zx.xxbg.filter(i => i.gx === zx.val)).reverse()
    const result = []
    const sx = [2, 1, 3, 4, -1]
    sx.forEach(i => {
      data.forEach(j => {
        if (i === +j?.wzzt) {
          result.push(j)
        }
      })
    })
    return result
  }),
  option: computed(() => {
    const data = [{ text: '就诊人', value: 'all' }]
    const type = {}
    zx.xxbg.forEach(i => {
      if (!type[i.gx]) {
        type[i.gx] = i.gx
      }
    })
    for (const k in type) {
      data.push({
        text: k,
        value: k
      })
    }
    return data
  })
})

proxy.$axios.post('/chat/getltbt', { openId: localStorage.getItem('token') }).then(d => {
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
