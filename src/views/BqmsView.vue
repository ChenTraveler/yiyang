<template>
  <div class="bqms">
    <header class="header">
      <div class="msg">
        <div class="left">
          <img src="../assets/image/1.webp" alt="">
        </div>
        <div class="right">
          <div class="name">{{ data.ygxm }}</div>
          <div class="hui">{{ data.ksmc }}<span> |{{ data.ygjb }}</span></div>
        </div>
      </div>
      <van-field
        class="jzr shadow"
        v-model="jzrs.val"
        is-link
        readonly
        label="选择就诊人"
        placeholder=""
        input-align="right"
        @click="jzrs.showjzr = true"
      />
      <van-popup v-model:show="jzrs.showjzr" round position="bottom">
        <van-picker
          :columns="jzrs.columns"
          @cancel="jzrs.showjzr = false"
          @confirm="jzrs.onConfirm"
        />
      </van-popup>
    </header>
    <main class="main shadow">
      <van-cell-group inset class="jyms bb">
        <van-field
          v-model="main.message"
          rows="3"
          autosize
          label="疾病简要描述:"
          label-class="lab"
          type="textarea"
          required
          maxlength="100"
          placeholder="请详细描述病症症状、持续时间，方便医生快速了解您的病情。我们将确保您的隐私安全，此信息仅当前接诊医生可见。"
          show-word-limit
          label-align="top"
        />
      </van-cell-group>
      <van-cell-group inset class="jyms bb">
        <div class="title"><span class="hong">*</span>就诊经历</div>
        <van-radio-group v-model="main.checked" direction="horizontal">
          <van-radio name="1">有</van-radio>
          <van-radio name="2">无</van-radio>
        </van-radio-group>
      </van-cell-group>
      <!-- <van-cell-group v-show="+main.checked === 1" class="jyms bb" inset>
        <van-field class="mb-2" v-model="main.date" label="初诊时间" placeholder="请输入最近一次就诊时间(年、月、日)" />
        <van-field class="mb-2" v-model="main.yiyuan" label="初诊医院" placeholder="请输入就诊医院名称" />
        <van-field v-model="main.binmin" label="确诊病症" placeholder="请输入诊断的病情名称，例：高血压" />
      </van-cell-group> -->
      <van-cell-group inset class="jyms bb" v-if="true">
        <div class="title">图片资料<span class="tips hui">病症部位，检查报告或其他病情资料</span></div>
        <van-uploader
          v-model="upload.fileList"
          @oversize="upload.onOversize"
          :before-read="upload.beforeRead"
          :max-size="3 * 1024 * 1024"
          :max-count="3"
          multiple
        />
      </van-cell-group>
      <div class="foot">
        <van-checkbox v-model="main.tyxy" shape="square">
          <span>已阅读并同意</span>
          <router-link class="blue" to="">《在线问诊服务协议》</router-link>
        </van-checkbox>
        <div class="tip hui">*医生基于患者自述病情所发表的言论仅供参考，不能作为诊断和治疗的直接依据</div>
      </div>
    </main>
    <div class="submit"  @click="tz({path:'/wait', query:{data:JSON.stringify(data)}})">
      <van-button round block type="primary">
        提问
      </van-button>
  </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showNotify, showConfirmDialog, showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const data = route.query.data && reactive(JSON.parse(route.query.data))
const jzr = route.query.data && reactive(JSON.parse(route.query.jzr))

const jzrs = reactive({
  val: '',
  showjzr: false,
  id: 0,
  columns: computed(() => {
    const data = reactive([])
    const sexs = ['女', '男']
    jzr.forEach(i => {
      data.push({ text: i.name, value: i.name + '  |  ' + sexs[i.sex] })
    })
    data.push({
      text: '添加就诊人',
      value: '/rej'
    })
    return data
  }),
  onConfirm ({ selectedOptions }) {
    jzrs.showjzr = false
    if (selectedOptions[0].value !== '/rej') {
      jzrs.val = selectedOptions[0].value
      jzrs.id = jzr[jzr.findIndex(i => i.name === selectedOptions[0].text)].id
    } else {
      router.push('/rej')
    }
  }
})

const upload = reactive({
  fileList: [],
  formdata: computed(() => {
    const formdata = new FormData()
    upload.fileList.forEach(i => {
      console.log(i)
      formdata.append('file', i.file)
    })
    return formdata
  }),
  // 校验上传图片大小
  onOversize (file) {
    // console.log(file)
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
  }
})

const main = reactive({
  message: '',
  checked: '1',
  tyxy: '',
  date: '',
  yiyuan: '',
  binmin: ''
})

onBeforeMount(() => {
  jzrs.val = jzrs.columns[0].value
  jzrs.id = jzr[jzr.findIndex(i => i.name === jzrs.columns[0].text)].id
})

const tz = (v) => {
  if (main.message) {
    if (main.tyxy) {
      const obj = reactive({
        openId: localStorage.getItem('token'),
        grxxid: jzrs.id,
        zzms: main.message,
        wzys: data.ygdm
      })
      const xyb = da => {
        proxy.$axios.post('/chat/startChat', da).then(d => {
          console.log(d)
          if (d.code === 1) {
            obj.id = d.data
            console.log(obj)
            v.query.xx = JSON.stringify(da)
            router.replace(v)
          }
        })
      }
      if (!upload.fileList[0]) {
        obj.img = ''
        xyb(obj)
      } else {
        proxy.$axios.upload('/uploadPic', upload.formdata).then(d => {
          if (d.code === 1) {
            obj.img = d.data.join(',')
          }
          console.log(d)
        }).then(() => {
          xyb(obj)
        })
      }
    } else {
      showConfirmDialog({
        title: '请阅读并同意在线问诊服务协议'
      })
    }
  } else {
    showNotify({ type: 'warning', message: '疾病简要描述不能为空' })
  }
}

console.log(data)
</script>

<style lang="stylus" scoped>
.bqms
  position relative
  min-height 100vh
  background-color #f5f5f5
  .shadow
      box-shadow 0 0 0.3rem -0.1rem rgba(0,0,0,.2)
  .header
    padding 0.2rem
    .msg
      display flex
      .left
        img
          width 1.5rem
          height 1.5rem
          border-radius 50%
      .right
        padding-top 0.2rem
        margin-left 0.3rem
        .name
          font-size 0.3rem
          margin-bottom 0.1rem
    .jzr
          margin 0.3rem 0
          padding 0.2rem  0.4rem  0.2rem 0.2rem
          display flex
          justify-content space-between
          border-radius 0.1rem
.main
  background-color #fff
  margin  0 0.2rem
  padding 0.2rem 0.2rem 0.2rem
  border-radius 0.1rem
  .jyms
    padding-bottom 0.2rem
    margin 0 0 0.2rem
    border-radius 0
    > div
      padding 0
    .title
      margin-bottom 0.3rem
      .tips
        font-size 0.2rem
        margin-left 0.2rem
  .bb
    border-bottom 0.02px solid #ccc
  .foot
    margin-top 0.4rem
    .tip
      font-size 0.1rem
      margin-top 0.1rem
.submit
  margin 0.2rem 0.2rem 0.4rem
</style>
