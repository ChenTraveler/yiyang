<template>
  <div class="bcson shadow">
    <van-cell-group class="jyms bb" inset>
      <van-field class="mb-2" is-link readonly @click="!main.read ? main.show = true : null" v-model="main.date" label="就诊日期" placeholder="请选择就诊日期" />
      <van-field class="mb-2" ref="mc" :readonly="main.read" v-model="main.yiyuan" label="初诊医院" placeholder="请输入就诊医院名称" />
      <van-field v-model="main.binmin" :readonly="main.read" label="确诊病症" placeholder="请输入确诊病情，例：高血压" />
      <div class="btns">
        <van-button size="small" @click="btns.xg" type="primary" v-if="!isys &&!props.data.xz" v-show="!main.xg">修改信息</van-button>
        <van-button size="small" @click="btns.qrxg" type="primary" v-if="!isys &&!props.data.xz" v-show="main.xg">确认修改</van-button>
        <van-button size="small" @click="btns.del" type="primary" v-if="false && !isys && !props.data.xz">删除信息</van-button>
        <van-button size="small" @click="btns.qx" type="primary" v-if="!isys &&props.data.xz">取消新增</van-button>
        <van-button size="small" @click="btns.qrxz" type="primary" v-if="!isys &&props.data.xz">确认新增</van-button>
      </div>
    </van-cell-group>
    <van-popup v-model:show="main.show" round position="bottom" :style="{ height: '50%' }">
      <van-date-picker
        position="bottom"
        v-model="date.data"
        title="选择日期"
        :min-date="date.minDate"
        :max-date="date.maxDate"
        @confirm="date.onConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { showNotify, setNotifyDefaultOptions } from 'vant'

setNotifyDefaultOptions({ duration: 1000 })
const props = defineProps(['data'])
const { proxy } = getCurrentInstance()
const mc = ref(null)
const isys = localStorage.getItem('ysdm')

const main = reactive({
  show: props.data?.xz,
  date: props.data?.xxtime?.slice(0, 10) || '',
  yiyuan: props.data?.yyname || '',
  binmin: props.data?.qzbz || '',
  read: !props.data?.xz,
  xg: false
})

const ndate = new Date()
const fordate = n => {
  return n < 10 ? '0' + n : '' + n
}

const date = reactive({
  data: props.data?.xxtime?.slice(0, 10).split('-') || [fordate(ndate.getFullYear()), fordate(ndate.getMonth() + 1), fordate(ndate.getDate())],
  onConfirm () {
    main.date = date.data.join('-')
    main.show = false
  },
  minDate: new Date(ndate.getFullYear() - 5, 0, 1),
  maxDate: new Date(ndate.getFullYear() + 5, 11, 31)
})

const btns = reactive({
  obj: () => ({
    id: props.data?.id,
    date10: main.date + ' 00:00:00',
    yyname: main.yiyuan,
    qzbz: main.binmin
  }),
  xg () {
    main.show = true
    main.read = false
    main.xg = true
  },
  qrxg () {
    if (main.date && main.yiyuan && main.binmin) {
      proxy.$emit('qrxg', btns.obj())
      main.xg = false
      main.read = true
    } else {
      showNotify({ type: 'warning', message: '请完善就诊信息' })
    }
  },
  del () {},
  qx () {
    proxy.$emit('qx')
  },
  qrxz () {
    if (main.date && main.yiyuan && main.binmin) {
      proxy.$emit('qrxz', btns.obj())
    } else {
      showNotify({ type: 'warning', message: '请完善就诊信息' })
    }
  }
})
</script>

<style lang="stylus" scoped>
.bcson
  margin-bottom 0.2rem
  .btns
    margin 0.2rem 0
    display flex
    justify-content space-around
</style>
