<template>
  <div class="yshome">
    <header class="header">
      <div class="bg">
        <img src="../assets/image/bg.jpg" alt="">
      </div>
      <div class="jz" v-if="!data">加载中...</div>
      <div class="cont shadow" v-if="data">
        <div class="head">
          <img v-if="!data.image" src="../assets/image/1.webp" alt="">
          <img v-if="data.image" :src="data.image" alt="">
        </div>
        <div class="text">
          <div class="name">
            <div>{{ data.ygxm }}<span class="txt hui_6">{{data.ygjb}}</span></div>
            <div class="txt hui_6">当前正在咨询:<span class="txt green">{{ data.dq }}</span>人</div>
          </div>
          <div class="hui_6">{{ data.ksmc }}</div>
          <div class="name hui_6">弋阳县人民医院</div>
          <div class="hui_6">接诊总量:<span class="red">{{ data.lj }}</span></div>
        </div>
      </div>
      <div class="twwz shadow">
        <div class="left">
          <img src="../assets/image/twwz.jpg" alt="">
        </div>
        <div class="middle">
          <div class="title">图文咨询<span class="red">￥{{ +flag === 1 && wzbg.jg ? wzbg.jg : 0 }}<i class="small">/次</i></span></div>
          <div class="small hui">使用图文咨询医生</div>
        </div>
        <div class="right">
          <van-button class="btn" v-if="+flag === 0" @click="tz({path:'/bqms', query:{data:JSON.stringify(data),price: 0}},0)">免费咨询</van-button>
          <van-button class="btn" v-if="+flag === 1 && wzbg.jg" @click="tz({path:'/bqms', query:{data:JSON.stringify(data),price: wzbg.jg}},wzbg.jg)">自费咨询</van-button>
          <van-button class="btn" v-if="+flag === 1 && !wzbg.jg" disabled >未开诊</van-button>
        </div>
      </div>
    </header>
    <main class="main">
      <nav class="nav">
        <div :class="index===nav.index ? 'active' : ''" @click="nav.cidx(index)" v-for="(item, index) in nav.navs" :key="index" >{{ item }}</div>
      </nav>
      <div class="content">
        <div class="js" v-show="nav.index === 0">
          <div class="sc">
            <div class="title"><i class="clire"></i><span>介绍</span></div>
            <div class="nr hui_6">{{data.wzjs || '暂无详情'}}</div>
          </div>
          <div class="sc">
            <div class="title"><i class="clire"></i><span>擅长</span></div>
            <div class="nr hui_6">{{data.wzsc  || '暂无详情'}}</div>
          </div>
          <div class="hzpj">
            <div class="title title_pj"><i class="clire"></i><span>患者评价</span></div>
            <div class="nr hui_6" v-if="!wzbg.pj[0]">暂无评价</div>
            <div class="nr pjnr" v-if="wzbg.pj[0]" >
              <div class="shadow dyg" v-for="item in wzbg.pj" :key="item.id">
                <div class="top">
                  <span class="hui_6">{{ (item?.commentName?.slice(0,1) || '')  + '**' }}</span>
                  <van-rate color="#fd7916" size="0.3rem" readonly v-model="item.scoreNum" />
                </div>
                <div class="middle">{{ item.pjnr }}</div>
                <div class="bottom hui">{{ item.createDate }}</div>
              </div>
              <div class="more hui" v-if="wzbg.num<wzbg.pjs.length" @click="wzbg.num=wzbg.pjs.length">查看更多</div>
            </div>
          </div>
        </div>
        <div class="fw" v-show="nav.index === 1">
          <div class="wzxx" v-for="item in wzbg?.data || []" :key="item.id">
            <wzxxCom class="shadow" :data="item" />
          </div>
        </div>
      </div>
    </main>
    <BackHome />
  </div>
</template>

<script setup>
import { showConfirmDialog, closeDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const data = JSON.parse(sessionStorage.getItem('ysxx')) || (route.query.data && reactive(JSON.parse(route.query.data)))

const flag = localStorage.getItem('showFlag')

const nav = reactive({
  navs: ['介绍', '为我提供的服务'],
  index: 0,
  cidx (v) {
    nav.index = v
  }
})

const wzbg = reactive({
  datay: [],
  data: computed(() => {
    const result = []
    const sx = [2, 1, 3, 4, -1]
    sx.forEach(i => {
      wzbg.datay?.forEach(j => {
        if (i === +j?.wzzt) {
          result.push(j)
        }
      })
    })
    return result
  }),
  jg: computed(() => data?.hisDoctorPb?.dj),
  pj: computed(() => {
    const data = []
    for (let i = 0; i < Math.min(wzbg.num, wzbg.pjs.length); i++) {
      data.push(wzbg.pjs[i])
    }
    return data
  }),
  page: 1,
  num: 3,
  pjs: []
})

const tz = (v, p) => {
  showConfirmDialog({
    title: '本次预计等候接诊时间约为12小时',
    messageAlign: 'left',
    message: '1、医生为医院在职医生，工作日需要出诊、查房、手术等。\n2、医生网上接诊患者都是在休息时间进行。\n3、网上问诊患者数量较大，医生回复可能不及时。\n4、以上数据是根据医生的实际回复情况计算。\n点击确认继续咨询'
  })
    .then(() => {
      proxy.$axios.get('/getjzr', { openId: localStorage.getItem('token') }).then(d => {
        if (d.code === 1) {
          router.push(v)
        } else {
          router.push({ path: '/rej', query: { path: '/yshome' } })
        }
      })
    })
    .catch(() => closeDialog())
}

proxy.$axios.post('/chat/getltbt', { openId: localStorage.getItem('token'), sataus: data.ygdm }).then(d => {
  if (d.code === 1) {
    wzbg.datay = d.data
  }
})
proxy.$axios.post('/chat/getComentLimit', { ysdm: data.ygdm, page: wzbg.page }).then(d => {
  if (d.code === 1) {
    wzbg.pjs = d.data.records
  }
})
</script>

<style lang="stylus" scoped>
.yshome
  position relative
  min-height 100vh
  background-color #fff
  .shadow
      box-shadow 0 0 0.3rem -0.1rem rgba(0,0,0,.2)
  .header
    padding 1rem 0.2rem 0.2rem
    .bg
      position absolute
      top 0
      left 0
      z-index 0
      img
        width 100%
    .jz
      position relative
      z-index: 1
      top 1rem
      text-align center
      margin-bottom 1.2rem
    .cont
      position relative
      z-index 1
      background-color #fff
      padding  0 0.2rem 0.2rem
      border-radius 0.2rem
      .head
        transform translateY(-0.4rem)
        img
          width 1.4rem
      .text
        div
          font-size 0.25rem
          font-weight bold
          span
            margin-left 0.2rem
            font-weight bold
        .name
          display flex
          justify-content space-between
          div
            font-size 0.3rem
        .txt
          font-size 0.25rem !important
    .twwz
      display flex
      align-items center
      justify-content flex-start
      padding 0.2rem
      border-radius 0.1rem
      margin 0.3rem 0 0.1rem
      img
        width 0.8rem
        border-radius 50%
      .middle
        margin-left 0.2rem
        .title
          font-weight bold
          font-size 0.3rem
          span
            margin-left 0.2rem
            font-weight normal
        .small
          font-size 0.2rem
      .right
        margin-left auto
        .btn
          border-radius 10rem
          background-color #67A729
          padding   0.2rem 0.3rem
          font-size 0.28rem
          letter-spacing 0.05rem
          color #fff
.main
  .nav
    display flex
    justify-content space-between
    padding 0.2rem 0.4rem
    font-size 0.28rem
    letter-spacing 0.05rem
    border solid #f9f9f9
    border-width 1px 0
    .active
      position relative
      color #84a870
    .active::after
      position absolute
      left 0
      bottom -0.2rem
      content ''
      height 0.05rem
      width 100%
      background-color #84a870
  .js
    >div
      padding 0.2rem 0.3rem 0.3rem
      border-bottom 1px solid #f5f5f5
      .title
        display flex
        align-items center
        font-size 0.3rem
        font-weight  bold
        margin-bottom 0.1rem
        i
          width 0.15rem
          height 0.15rem
          border-radius 50%
          background-color #84a870
          margin-right 0.12rem

      .title_pj
        margin-bottom 0.2rem
      .nr
        padding-left 0.25rem
        font-size 0.25rem
      .pjnr
        .top
          span
            margin-right 0.2rem
        .middle
          margin 0.1rem 0
        .dyg
          padding 0.2rem
          margin-bottom 0.2rem
        .more
          display flex
          justify-content flex-end
</style>
