import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = '/jwwz/wx' // 测试

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 允许跨域携带cookie信息
// axios.defaults.withCredentials = true;
// 设置超时
axios.defaults.timeout = 15000

// 添加请求拦截器
// axios.interceptors.request.use(
//   config => {
//     // 在发送请求之前做些什么
//     config.headers.Authorization = window.localStorage.getItem('token')
//     return config
//   },
//   // 对请求错误做些什么
//   error => Promise.reject(error)
// )

// 添加响应拦截器
// axios.interceptors.response.use(
//   response => {
//     // 对响应数据做点什么
//     if (
//       response.data.status === 1 &&
//       response.data.message === '身份认证失败'
//     ) {
//       router.push({ path: '/login' })
//     }
//     return response
//   },
//   // 对响应错误做点什么
//   error => Promise.reject(error)
// )

export default {
  /**
   * @param {String} url
   * @param {Object} data
   * @returns Promise
   */
  post (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: qs.stringify(data)
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  upload (url, formData) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        data: formData
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: data
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
