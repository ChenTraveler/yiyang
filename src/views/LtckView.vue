<template>
  <div class="wait">
    <header class="header">
      <div class="warn">24小时后会话自动关闭</div>
      <div class="bcxx" v-if="!lt.isys">
        <span class="hui">补充初诊信息</span>
        <div class="btn">去补充</div>
      </div>
      <div class="card">
        <div class="left" v-if="!lt.isys">
          <img src="../assets/image/1.webp" alt="">
        </div>
        <div class="right" v-if="!lt.isys">
          <div class="name">{{ data?.ygxm || '医生' }}</div>
          <div class="hui">{{ data?.ygjb || '住院医师' }}</div>
          <div class="hui">{{ data?.ksmc || '科室' }}</div>
          <div class="hui">弋阳县人民医院</div>
          <div class="huang" v-if="false">接诊我0次</div>
        </div>
        <div class="right ysr"  v-if="lt.isys">
          <div class="name">{{ data?.name || '患者' }}</div>
          <div class="hui mst">症状描述：</div>
          <div class="hui ms">{{ data?.zzms || '症状描述' }}</div>
        </div>
        <div class="btns hui_6" v-if="lt.isys">
          <div class="ml" @click="lt.yltp" v-if="data?.img">图片信息</div>
          <div v-if="false">查病历夹</div>
        </div>
        <div class="backhome" @click="tz('/index')" v-if="!lt.isys">
          回到首页
        </div>
        <div class="backhome" @click="tz(`/yslb?ygdm=${data?.ygdm}&ysxm=${data?.ygxm}`)" v-if="lt.isys">
          返回列表
        </div>
      </div>
    </header>
    <div ref="view" class="view" @click="lt.hidden = false">
      <div class="lt">
        <div :class="+lt.guishu === +item.fsz ? 'mine ltxx' : 'other ltxx'" v-for="item in lt.aname" :key="item.id">
          <div class="xx" v-if="+lt.guishu === +item.fsz">
            <div class="date hui">{{ item.startime?.slice(0,-3) }}</div>
            <div class="msg" v-if="item.xxnr.trim()">{{ item.xxnr.trim() }}</div>
            <div class="msg" v-if="item.tpxx">
              <img :src="item.tpxx" @click="showImagePreview({closeable: true,images: [item.tpxx]})" alt="">
            </div>
          </div>
          <div class="tx">
            <img src="../assets/image/1.webp" v-if="+data.ygdm === +item.fsz" alt="">
            <img src="../assets/image/2.webp" v-if="+data.ygdm !== +item.fsz" alt="">
          </div>
          <div class="xx" v-if="+lt.guishu !== +item.fsz">
            <div class="date hui">{{ item.startime?.slice(0,-3) }}</div>
            <div class="msg" v-if="item.xxnr.trim()">{{ item.xxnr.trim() }}</div>
            <div class="msg" v-if="item.tpxx">
              <img :src="item.tpxx" @click="showImagePreview({closeable: true,images: [item.tpxx]})" alt="" >
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer" v-if="lt.isys || data?.wzzt===2">
      <div class="top">
        <van-field class="ipt" autosize rows="1" max-rows="4" type="textarea" v-model="lt.val" placeholder="请输入文字" />
        <van-button class="btn" v-show="lt.val" type="success" @click="lt.sendxx">发送</van-button>
        <van-icon class="more" v-show="!lt.val" name="add-o" @click="lt.hidden = !lt.hidden" />
      </div>
      <!-- v-model="upload.fileList" -->
      <div class="hidden" v-show="lt.hidden">
        <div class="tpsc">
          <van-uploader
            ref="tpsc"
            :show-upload="false"
            :preview-image="false"
            class="ipt"
            @oversize="upload.onOversize"
            :before-read="upload.beforeRead"
            :after-read="upload.captrueRead"
            :max-size="3 * 1024 * 1024"
            :max-count="1"
          />
        </div>
        <div :class="'fun '  + item.class" v-for="item in lt.fun" :key="item.text" @click="item.fn">
          <div class="icon"><i :class="'iconfont ' + item.icon"></i></div>
          <div>{{ item.text }}</div>
        </div>
      </div>
    </footer>
    <footer class="footer pj" v-if="!lt.isys && data?.wzzt===3 || data?.wzzt===4">
      <van-button class="btn" plain v-if="!lt.isys && data?.wzzt===3"  @click="lt.showpj=true" type="primary">点击评价</van-button>
      <van-button class="btn two" plain v-if="!lt.isys && data?.wzzt===4" @click="lt.showmypj=true" type="primary">我的评价</van-button>
      <van-button class="btn two" v-if="!lt.isys && data?.wzzt===4" @click="router.push('/index')" type="success">再次问诊</van-button>
    </footer>
    <van-popup v-if="!lt.isys && data?.wzzt===3" class="tc" v-model:show="lt.showpj" position="bottom" :style="{ height: '35%' }" >
      <van-cell-group inset class="group">
        <span>星级：</span><van-rate color="#fd7916" size="0.3rem" v-model="lt.star" />
        <van-field
          v-model="lt.message"
          rows="3"
          autosize
          label="评价:"
          label-class="lab"
          type="textarea"
          maxlength="100"
          placeholder="请根据真实情况对本次问诊填写客官评价"
          show-word-limit
          label-align="top"
        />
      </van-cell-group>
      <div class="btns">
        <van-button class="btn qx" square type="primary" @click="lt.showpj=false">暂不评价</van-button>
        <van-button class="btn pj" square type="success" @click="lt.fspj">评价</van-button>
      </div>
    </van-popup>
    <van-popup v-if="!lt.isys && data?.wzzt===4" class="tc" v-model:show="lt.showmypj" position="bottom" :style="{ height: '32%' }" >
      <van-cell-group inset class="group">
        <span>星级：</span><van-rate readonly color="#fd7916" size="0.3rem" v-model="lt.mystar" />
        <van-field
          v-model="lt.mymessage"
          rows="3"
          autosize
          readonly
          label="评价:"
          label-class="lab"
          type="textarea"
          label-align="top"
        />
      </van-cell-group>
      <div class="btns">
        <van-button class="btn pj" square type="success" @click="lt.showmypj=false">关闭</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { reactive, watchEffect, getCurrentInstance, computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showImagePreview, showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const data = route.query.data && reactive(JSON.parse(route.query.data))
const tpsc = ref(null)

const tz = (v) => {
  router.push(v)
}

const upload = reactive({
  // 校验上传图片大小
  onOversize (file) {
    // console.log(file)+++++-+--+-+--`---------
    showToast('文件大小不能超过3MB')
  },
  // 校验图片的格式
  beforeRead (file) {
    const isgs = f => {
      if (!/(.jpg|.jpeg|.png|.JPG|.PNG|.webp|.svg)/g.test(f.type)) {
        showToast('请上传正确格式的图片')
        return false
      }
    }
    if (!file[0]) {
      isgs(file)
    } else {
      file.forEach(i => {
        isgs(i)
      })
    }
    return true
  },
  captrueRead (file) {
    const formdata = new FormData()
    formdata.append('file', file.file)
    proxy.$axios.upload('/uploadPic', formdata).then(d => {
      console.log(d)
      if (d.code === 1) {
        lt.sendxx(d.data[0])
      }
    })
  }
})

const lt = reactive({
  val: '',
  aname: [],
  message: '',
  mymessage: '',
  star: 1,
  mystar: 1,
  showpj: false,
  showmypj: false,
  dsqId: '',
  isys: localStorage.getItem('ysdm'),
  guishu: computed(() => localStorage.getItem('ysdm') || data.grxxid),
  hidden: false,
  fun: [
    {
      icon: 'icon-charutupian',
      text: '图片',
      class: 'tp',
      fn () {
        tpsc.value.chooseFile()
      }
    },
    {
      icon: 'icon-caozuo-kaiguan',
      text: '结束问诊',
      class: '',
      fn () {
        showConfirmDialog({
          title: '是否却结束本次问诊会话'
        })
          .then(() => {
            proxy.$axios.post('/chat/endCaht', { titleId: data.id, status: 3 }).then(d => {
              if (!lt.isys && d.code === 1) {
                data.wzzt = 3
                router.replace({ path: '/ltck', query: { data: JSON.stringify(data) } })
              } else if (lt.isys && d.code === 1) {
                router.push(`/yslb?ygdm=${data?.ygdm}&ysxm=${data?.ygxm}`)
              }
            })
          })
      }
    }
  ],
  sendxx (tpdz) {
    if (lt.val.trim() || tpdz) {
      proxy.$axios.post('/chat/sendTexts', {
        titleId: data.id,
        content: lt.val,
        id: lt.guishu,
        tpdz
      }).then(d => {
        if (d.code === 1) {
          lt.updchat()
          lt.val = ''
        }
      })
    }
  },
  updchat () {
    proxy.$axios.post('/chat/getTheMessageList', { titleId: data.id }).then(d => {
      // console.log(d)
      lt.aname = d.data
      lt.scrollbottom()
    })
  },
  scrollbottom () {
    nextTick(() => {
      setTimeout(() => {
        view.value.scrollTop = view.value.scrollHeight
      }, 10)
    })
  },
  yltp () {
    showImagePreview({
      closeable: true,
      images: data?.img?.split(',')
    })
  },
  fspj () {
    if (lt.message.trim()) {
      proxy.$axios.post('/chat/insertComment', {
        titleId: data.id,
        ysdm: data.ygdm,
        ysxm: data.ygxm,
        pjnr: lt.message,
        scoreNum: lt.star,
        commentName: data.name,
        openId: localStorage.getItem('token')
      }).then(d => {
        if (d.code === 1) {
          showToast('评论成功，谢谢配合')
          lt.showpj = false
          proxy.$axios.post('/chat/endCaht', { titleId: data.id, status: 4 }).then(d => {
            if (d.code === 1) {
              router.push('/index')
            }
          })
        }
      })
    }
  }
})

lt.updchat()

if (!lt.isys && data.wzzt === 4) {
  proxy.$axios.post('/chat/getCommentOne', { titleId: data.id }).then(d => {
    lt.mymessage = d.data.pjnr
    lt.mystar = d.data.scoreNum
  })
}

onMounted(() => {
  lt.dsqId = setInterval(() => {
    if (data.wzzt === 2) {
      lt.updchat()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(lt.dsqId)
})

const view = ref(null)

watchEffect(() => {
  lt.scrollbottom()
})
watchEffect(() => {
  if (lt.val) {
    lt.hidden = false
  }
})

console.log(data)
</script>

<style lang="stylus" scoped>
.wait
  background-color #ededed
  height 100vh
.header
  width 100%
  position fixed
  top 0
  left 0
  z-index 999
  background-color #ededed
  .warn
    background-color #f8f0ee
    padding 0.2rem 0
    display flex
    align-items center
    justify-content center
    color #dd796c
    font-weight bold
  .bcxx
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
  .card
    position relative
    width 100%
    height 100%
    background-color #fff
    padding 0.2rem 0.4rem 0.3rem
    display flex
    flex-wrap wrap
    margin-top 0.2rem
    .ysr
      min-height 2.6rem
      max-height 2.6rem
    .backhome
      position absolute
      right 0
      top 0.2rem
      color #fff
      background-color #16a589
      border-radius 10rem 0 0 10rem
      padding 0.1rem 0.35rem 0.15rem 0.3rem
    .left
      img
        width 1.5rem
        height 1.5rem
    .right
      .name
        font-size 0.3rem
        font-weight bold
      div
        margin-bottom 0.1rem
    .btns
      width 100%
      display flex
      justify-content center
      div
        padding 0.12rem 0.2rem
        border 1px solid #ccc
        border-radius 10rem
      .ml
        margin-right 0.2rem
        position absolute
        bottom 0.2rem
        right 0.2rem
.view
  position fixed
  bottom 0
  width 100%
  max-height: 100vh
  height 100vh
  padding 4.4rem 0.2rem 1.2rem
  background-color #ededed
  overflow scroll
  .sjts
    display flex
    justify-content center
    color #fff
    span
      background-color rgba(0,0,0,0.1)
      padding 0.1rem
      border-radius 0.1rem
  .ltxx
    display flex
    align-items flex-start
    margin-bottom 0.2rem
    .xx
      display flex
      flex-direction column
    .tx
      img
        width 0.8rem
        height 0.8rem
    .msg
      position relative
      padding 0.1rem 0.2rem
      background-color #fff
      border-radius 0.1rem
      font-size 0.3rem
      max-width 4rem
      img
        width 2rem
    .date
      margin-bottom 0.1rem
  .other
    justify-content flex-start
    .xx
      align-items flex-start
    .msg
      margin-left 0.3rem
    .msg:after
      position absolute
      content ''
      height 0
      border 0.1rem solid transparent
      border-right-color #fff
      left -0.2rem
      top 0.18rem
    .date
      margin-left 0.3rem
  .mine
    justify-content flex-end
    .xx
      align-items flex-end
    .msg
      margin-right 0.3rem
    .msg:after
      position absolute
      content ''
      height 0
      border 0.1rem solid transparent
      border-left-color #fff
      right -0.2rem
      top 0.18rem
    .date
      margin-right 0.3rem
.footer
  position fixed
  bottom 0
  left 0
  width 100%
  margin 0
  background-color #f7f7f7
  .top
    display flex
    align-items flex-end
    padding 0.2rem 0.2rem
    .ipt
      max-height 3rem
      overflow: auto
      border-radius 0.1rem
      padding 0.15rem 0.3rem
    .btn
      width 20%
      margin-left 0.2rem
      height auto
      padding 0.185rem 0.3rem
    .more
      font-size 0.65rem
      margin-left 0.2rem
  .hidden
    position relative
    display flex
    flex-wrap wrap
    padding 0.2rem
    border-top 1px solid #dedede
    .fun
      position relative
      z-index 2
      display flex
      flex-direction column
      align-items center
      width 25%
      margin-bottom 0.2rem
      justify-content space-between
      .icon
        background-color #fff
        padding 0.2rem 0.25rem
        margin-bottom 0.1rem
        border-radius 0.1rem
        i
          font-size 0.4rem
.footer.pj
  display flex
  padding  0.2rem 0.6rem  0
  justify-content space-between
  align-items center
  .btn
    width 100%
    margin-bottom 0.3rem
  .btn.two
    width 45%
.tc
  .group
    margin-top 0.2rem
  .btns
    display flex
    justify-content flex-end
    padding-right 0.2rem
  .btn
    border-radius: 0.1rem
    margin-left 0.2rem
</style>
