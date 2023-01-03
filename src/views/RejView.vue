<template>
  <div class="rej">
    <van-form @submit="onSubmit">
      <van-cell-group inset class="bd">
        <van-field
          v-model="name"
          name="姓名"
          label="姓名"
          size="large"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="sfz"
          name="身份证"
          label="身份证"
          size="large"
          placeholder="请输入身份证号"
          :rules="[{pattern:patterns.sfz, message: '请输入合法的身份证' }]"
        />
        <van-field
          v-model="sexobj.sex"
          is-link
          readonly
          name="性别"
          label="性别"
          size="large"
          placeholder="请选择性别"
          @click="sexobj.showsex = true"
        />
        <van-popup v-model:show="sexobj.showsex" position="bottom">
          <van-picker
            :columns="sexobj.columns"
            @confirm="sexobj.onConfirm"
            @cancel="sexobj.showsex = false"
          />
        </van-popup>
        <van-field
          v-model="szd"
          is-link
          readonly
          size="large"
          name="所在地"
          label="所在地"
          placeholder="请选择选择所在地区"
          @click="szdobj.showArea = true"
        />
        <van-popup v-model:show="szdobj.showArea" position="bottom">
          <van-area
            :area-list="areaList"
            @confirm="szdobj.onConfirm"
            @cancel="szdobj.showArea = false"
          />
        </van-popup>
        <van-field
          v-model="xxdz"
          name="详细地址"
          label="详细地址"
          size="large"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请填写详细地址' }]"
        />
        <van-field
          v-model="lxdh"
          name="联系电话"
          label="联系电话"
          size="large"
          placeholder="请输入联系电话"
          :rules="[{ pattern:patterns.phone, message: '请输入正确的手机号' }]"
        />
        <van-field
          v-model="mz"
          is-link
          readonly
          name="民族"
          label="民族"
          size="large"
          placeholder="请选择民族"
          @click="mzobj.showmz = true"
        />
        <van-popup v-model:show="mzobj.showmz" position="bottom">
          <van-picker
            :columns="mzobj.columns"
            @confirm="mzobj.onConfirm"
            @cancel="mzobj.showmz = false"
          />
        </van-popup>
        <van-field
          v-model="gx"
          is-link
          readonly
          name="关系"
          label="和本人关系"
          size="large"
          placeholder="请选择关系"
          @click="gxobj.showgx = true"
        />
        <van-popup v-model:show="gxobj.showgx" position="bottom">
          <van-picker
            :columns="gxobj.columns"
            @confirm="gxobj.onConfirm"
            @cancel="gxobj.showgx = false"
          />
        </van-popup>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          确认
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, toRefs, getCurrentInstance, computed } from 'vue'
import { areaList } from '@vant/area-data'
import { showNotify } from 'vant'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()

const router = useRouter()

const form = reactive({
  name: '',
  sfz: '',
  sex: '',
  szd: '',
  xxdz: '',
  lxdh: '',
  mz: '',
  gx: '',
  openId: localStorage.getItem('token')
})

const { name, sfz, sex, szd, xxdz, lxdh, mz, gx } = toRefs(form)

const patterns = reactive({
  sfz: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
  phone: /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
})

const sexobj = reactive({
  sex: '',
  showsex: false,
  columns: [
    { text: '男', value: '1' },
    { text: '女', value: '0' }
  ],
  onConfirm ({ selectedOptions }) {
    sexobj.sex = selectedOptions[0]?.text
    sex.value = selectedOptions[0]?.value
    sexobj.showsex = false
  }
})

const szdobj = reactive({
  showArea: false,
  onConfirm ({ selectedOptions }) {
    szdobj.showArea = false
    szd.value = selectedOptions.map(i => i.text).join('/')
  }
})

const mzobj = reactive({
  showmz: false,
  mzlist: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'],
  columns: computed(() => {
    const data = reactive([])
    mzobj.mzlist.forEach(i => {
      data.push({
        text: i,
        value: i
      })
    })
    return data
  }),
  onConfirm ({ selectedOptions }) {
    mz.value = selectedOptions[0]?.text
    mzobj.showmz = false
  }
})

const gxobj = reactive({
  showgx: false,
  columns: [
    { text: '本人', value: '本人' },
    { text: '家人', value: '家人' },
    { text: '朋友', value: '朋友' }
  ],
  onConfirm ({ selectedOptions }) {
    gx.value = selectedOptions[0]?.text
    gxobj.showgx = false
  }
})
const isnull = obj => {
  for (const k in obj) {
    if (!obj[k]) {
      return false
    }
  }
  return true
}
const onSubmit = () => {
  if (!isnull(form)) {
    showNotify({ type: 'primary', message: '请完善信息' })
  } else {
    console.log(form)
    proxy.$axios.post('findRegist', form).then(d => {
      if (d.code === 1) {
        router.go(-1)
      }
    })
  }
}

</script>

<style lang="stylus" scoped>
.rej
  width 100%
  height 100vh
  background-color #f5f5f5
  .bd
    margin 0
    border-bottom 1px solid #ddd
    padding-bottom  0.2rem
    border-radius 0
</style>
