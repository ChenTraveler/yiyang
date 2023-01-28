<template>
  <div class="login">
    <div class="title">医生登录</div>
    <div class="card">
      <van-cell-group inset class="dyg">
        <van-field v-model="login.val" label="医生代码" placeholder="请输入医生代码" />
      </van-cell-group>
      <div class="btn">
        <van-button round block type="primary" @click="login.dl">
          登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showToast, showNotify, setNotifyDefaultOptions } from 'vant'

setNotifyDefaultOptions({ duration: 1000 })
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const login = reactive({
  val: '',
  dl () {
    proxy.$axios.post('/yslogin', { openId: localStorage.getItem('token'), ygdm: login.val }).then(d => {
      if (d.code === 1) {
        localStorage.setItem('ysdm', login.val)
        showNotify({ type: 'success', message: '登录成功' })
        router.push({ path: '/yslb', query: { ygdm: login.val, ysxm: d?.data?.ygxm } })
      } else {
        showToast('请输入正确的医生代码')
      }
    })
  }
})

onMounted(() => {
  if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
    localStorage.setItem('token', route.query.openId || '')
  }
})
</script>

<style lang="stylus" scoped>
.login
  min-height: 100vh
  background-color #f5f5f5
  .title
    color #16a589
    font-size 0.8rem
    text-align center
    padding 1.4rem 0 0.6rem
    letter-spacing: 0.2rem
    text-shadow: 1px 1px rgba(0,0,0,.3),-1px 1px rgba(0,0,0,.3),1px -1px rgba(0,0,0,.3),-1px -1px rgba(0,0,0,.3)
  .card
    padding 0 0.2rem
    .dyg
      margin 0
    .btn
      margin 0.4rem 0
</style>
