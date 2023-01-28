<template>
  <div class="bqms">
    <header class="header">
      <div class="msg">
        <div class="left">
          <img v-if="!data.image" src="../assets/image/1.webp" alt="">
          <img v-if="data.image" :src="data.image" alt="">
        </div>
        <div class="right">
          <div class="name">{{ data.ygxm }}</div>
          <div class="hui">{{ data.ksmc }}<span v-if="data.ygjb"> |{{ data.ygjb }}</span></div>
        </div>
      </div>
      <div class="jzrcard">
        <van-field
          class="jzr shadow"
          v-model="jzrs.val"
          is-link
          readonly
          label-class="lab"
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
      </div>
      <div class="btns" v-show="price > 0">
        <van-button
          v-show="price > 0 && !jzrs?.dqjzr?.jzk"
          @click="router.push({path:'/rej',query:{data:JSON.stringify(jzrs.dqjzr),type:'bq'}})"
          class="bk"
          type="primary"
          size="small"
        >绑定就诊卡号</van-button>
        <van-button
          @click="router.push({path:'/jk'})"
          class="jk"
          type="primary"
          size="small"
        >创建并绑定就诊卡号</van-button>
      </div>
    </header>
    <main class="main shadow">
      <van-cell-group inset class="jyms bb">
        <van-field
          v-model="main.message"
          rows="3"
          autosize
          label="疾病简要描述:"
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
      <van-cell-group v-show="+main.checked === 1" class="jyms bb" inset>
        <van-field class="mb-2" @click="date.show = true" is-link readonly v-model="main.date" label="就诊时间" placeholder="请选择就诊时间" />
        <van-field class="mb-2" v-model="main.yiyuan" label="就诊医院" placeholder="请输入就诊医院名称" />
        <van-field v-model="main.binmin" label="确诊病症" placeholder="请输入确诊的病情，例：高血压" />
        <van-popup v-model:show="date.show" round position="bottom" :style="{ height: '50%' }">
          <van-date-picker
            position="bottom"
            v-model="date.data"
            title="选择日期"
            :min-date="date.minDate"
            :max-date="date.maxDate"
            @confirm="date.onConfirm"
          />
        </van-popup>
      </van-cell-group>
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
          <span class="blue" @click="main.show=true;main.tyxy=!main.tyxy">《在线问诊服务协议》</span>
        </van-checkbox>
        <van-popup v-model:show="main.show" position="bottom" :style="{ height: '100%',padding: '0.3rem 0.3rem 0' }">
          <FwXy>
            <van-button @click="main.show=false;main.tyxy=true" type="primary" size="large">同意协议</van-button>
          </FwXy>
        </van-popup>
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
import { showNotify, showConfirmDialog, showToast, setNotifyDefaultOptions } from 'vant'

setNotifyDefaultOptions({ duration: 1000 })
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const data = route.query.data && reactive(JSON.parse(route.query.data))
const price = route.query.price

proxy.$axios.get('/getjzr', { openId: localStorage.getItem('token') }).then(d => {
  if (d.code === 1) {
    jzrs.jzr = d.data
    jzrs.val = jzrs.columns[0].value
    jzrs.id = jzrs.jzr[jzrs.jzr.findIndex(i => i.name === jzrs.columns[0].text)].id
  }
})

const jzrs = reactive({
  val: '',
  jzr: [],
  showjzr: false,
  id: 0,
  dqjzr: '',
  columns: computed(() => {
    const data = []
    const sexs = ['女', '男']

    jzrs.jzr.forEach(i => {
      data.push({ id: i.id, text: i.name, value: i.name + ' | ' + sexs[i.sex] + ' | ' + (i.jzk ? i.jzk : i.sfz.slice(-4)) })
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
      jzrs.id = selectedOptions[0].id
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
      formdata.append('file', i.file)
    })
    return formdata
  }),
  // 校验上传图片大小
  onOversize (file) {
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
  binmin: '',
  show: false,
  gz: false
})

const ndate = new Date()
const fordate = n => {
  return n < 10 ? '0' + n : '' + n
}

const date = reactive({
  show: false,
  data: [fordate(ndate.getFullYear()), fordate(ndate.getMonth() + 1), fordate(ndate.getDate())],
  onConfirm () {
    main.date = date.data.join('-')
    date.show = false
  },
  minDate: new Date(ndate.getFullYear() - 5, 0, 1),
  maxDate: new Date(ndate.getFullYear() + 5, 11, 31)
})

const tz = (v) => {
  if (price > 0 && !jzrs?.dqjzr?.jzk) {
    showNotify({ type: 'warning', message: '该病人未绑定就诊卡号，请绑定就诊卡号' })
  } else if (main.message) {
    if (main.tyxy) {
      const obj = reactive({
        openId: localStorage.getItem('token'),
        grxxid: jzrs.id,
        zzms: main.message,
        wzys: data.ygdm,
        feeFlag: 0,
        flag: 2
      })
      const setxx = () => {
        const xyb = da => {
          proxy.$axios.post('/chat/startChat', da).then(d => {
            if (d.code === 1) {
              obj.id = d.data
              v.query.xx = JSON.stringify(da)
              router.replace(v)
            }
          })
        }
        const hurl = (d) => `http://yyxrmyy.yujiankang.com/Zhyy/wx/confirmOrder6?ksmc=${data?.ksmc}&ksdm=${data?.ksdm}&ygdm=${data?.ygdm}&ygxm=${data?.ygxm}&jzrq=${data?.hisDoctorPb?.jzrq}&sdbzValue=${data?.hisDoctorPb?.sdbzValue}&dj=${data?.hisDoctorPb?.dj}&ghhm=${data?.hisDoctorPb?.ghhm}&xmid=${data?.hisDoctorPb?.xmid}&brid=${jzrs?.dqjzr?.brid}&brxm=${jzrs?.dqjzr?.name}&mzhm=${jzrs?.dqjzr?.jzk}&openId=${localStorage.getItem('token')}&grxxid=${d.grxxid}&feeFlag=1&zzms=${d.zzms}&wzys=${d.wzys}&img=${encodeURIComponent(d.img)}`
        if (!upload.fileList[0]) {
          obj.img = ''
          if (!(price > 0)) {
            xyb(obj)
          } else {
            window.location.href = hurl(obj)
          }
        } else {
          proxy.$axios.upload('/uploadPic', upload.formdata).then(d => {
            if (d.code === 1) {
              obj.img = d.data.join(',')
            }
          }).then(() => {
            if (!(price > 0)) {
              xyb(obj)
            } else {
              window.location.href = hurl(obj)
            }
          })
        }
      }
      if (+main.checked === 1) {
        if (main.date && main.yiyuan && main.binmin) {
          proxy.$axios.post('/setczxx', {
            openId: localStorage.getItem('token'),
            grxxId: jzrs.id,
            date10: main.date + ' 00:00:00',
            yyname: main.yiyuan,
            qzbz: main.binmin
          }).then(d => {
            if (d.code === 1) {
              obj.blid = d.msg
              setxx()
            }
          })
        } else {
          showNotify({ type: 'warning', message: '请完善就诊信息' })
        }
      }
      if (+main.checked !== 1) {
        setxx()
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

if (price > 0) {
  watchEffect(() => {
    jzrs.dqjzr = jzrs.jzr.find(i => i.id === jzrs.id)
    if (jzrs.jzr.find(i => i.id === jzrs.id) && !jzrs.jzr.find(i => i.id === jzrs.id)?.jzk) {
      showNotify({ type: 'warning', message: '该病人未绑定就诊卡号，请绑定就诊卡号' })
    }
  })
}

</script>

<style lang="stylus" scoped>
.bqms
  position relative
  padding-bottom 0.4rem
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
        ..name
          font-size 0.3rem
          margin-bottom 0.1rem
    .jzrcard
      position relative
      .jzr
        margin 0.3rem 0
        padding 0.2rem  0.4rem  0.2rem 0.2rem
        display flex
        justify-content space-between
        border-radius 0.1rem
    .btns
      display flex
      justify-content space-around
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
  margin 0.2rem 0.2rem 0
</style>
