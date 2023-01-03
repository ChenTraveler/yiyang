import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style/reset.css'
import './assets/style/border.css'
import './assets/style/font/iconfont.css'
import axios from './plugins/axios'
import {
  Button,
  Picker,
  Form,
  Field,
  CellGroup,
  Notify,
  Rate,
  Loading,
  RadioGroup,
  Radio,
  Uploader,
  Checkbox,
  CheckboxGroup,
  Toast,
  Dialog,
  Collapse,
  CollapseItem,
  Icon,
  DropdownMenu,
  DropdownItem,
  Empty,
  Sidebar,
  SidebarItem,
  Popup,
  ImagePreview
} from 'vant'
import 'vant/es/notify/style'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'

const app = createApp(App)

app.use(router)

// 应用vant组件
app
  .use(Button)
  .use(Picker)
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Notify)
  .use(Rate)
  .use(Loading)
  .use(Radio)
  .use(RadioGroup)
  .use(Uploader)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Toast)
  .use(Icon)
  .use(Dialog)
  .use(Collapse)
  .use(CollapseItem)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Empty)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Popup)
  .use(ImagePreview)

// 全局挂载axios
app.config.globalProperties.$axios = axios

app.mount('#app')
