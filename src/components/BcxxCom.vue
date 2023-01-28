<template>
  <div class="bcxx">
    <span class="hui">补充初诊信息</span>
    <div class="btn" @click="bc.show=true">去补充</div>
    <van-popup v-model:show="bc.show" closeable position="bottom" :style="{ height: '100%',padding: '1rem 0.2rem 0' }">
      <div class="title">补充就诊信息</div>
      <van-empty image-size="2rem" v-if="!bc.data.length" description="没有就诊信息" />
      <BcxxSon
        @qrxg="BS.qrxg"
        @del="BS.del"
        @qx="BS.qx"
        @qrxz="BS.qrxz"
        v-for="item in bc.data"
        :key="item" :data="item"
      />
      <van-button round size="large" v-show="bc.upd && !bc.data.length" type="primary" @click="bc.data.push({xz:true});bc.cstate=true">新建就诊信息</van-button>
    </van-popup>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { showNotify, setNotifyDefaultOptions } from 'vant'

setNotifyDefaultOptions({ duration: 1000 })
const { proxy } = getCurrentInstance()
const props = defineProps(['data'])

const bc = reactive({
  show: false,
  data: [],
  cstate: false,
  upd: 10,
  getxx () {
    proxy.$axios.post('/getczxx', props.data).then(d => {
      bc.data = d.data
    })
  }
})

bc.getxx()

const BS = reactive({
  qrxg ({ id, date10, yyname, qzbz }) {
    proxy.$axios.post('/setczxx', {
      openId: localStorage.getItem('token'),
      Itbtid: props.data?.btid,
      grxxId: props.data?.grxxid,
      id,
      date10,
      yyname,
      qzbz
    }).then(d => {
      if (d.code === 1) {
        showNotify('修改成功')
      } else {
        showNotify('修改失败')
      }
    })
  },
  del () {},
  qx () {
    bc.data.pop()
    bc.cstate = false
  },
  qrxz ({ date10, yyname, qzbz }) {
    proxy.$axios.post('/setczxx', {
      openId: localStorage.getItem('token'),
      grxxId: props.data?.grxxid,
      date10,
      yyname,
      qzbz
    }).then(d => {
      if (d.code === 1) {
        proxy.$axios.post('/chat/startChat', {
          id: props.data?.btid,
          blid: d.msg
        }).then(d => {
          if (d.code === 1) {
            showNotify('添加成功')
            bc.upd = Math.random() + 1
          } else {
            showNotify('添加失败')
          }
        })
      }
    })
  }
})

watch(
  () => bc.upd,
  () => {
    bc.getxx()
  }
)
</script>

<style lang="stylus" scoped>
.bcxx
  position relative
  display flex
  justify-content space-between
  padding 0.2rem 0.2rem
  align-items center
  background-color #fff
  .btn
    padding 0.05rem 0.3rem
    background-color #16a589
    color #fff
    border-radius 10rem
  .title
    font-size 0.4rem
    font-weight bold
    position absolute
    left 50%
    top 0.2rem
    transform translateX(-50%)
</style>
