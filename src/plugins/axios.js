import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = '/jwwz/wx' // 测试

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 设置超时
axios.defaults.timeout = 15000

// http 响应拦截器
// axios.interceptors.response.use(
//   response => response,
//   error => {
//   // 超时处理
//     const config = error.config
//     if (!config || !config.retry) return Promise.reject(error)
//     // 设置用于跟踪重试次数的变量
//     config.__retryCount = config.__retryCount || 0

//     // 检查我们是否已将重试总数最大化
//     if (config.__retryCount >= config.retry) {
//     // 错误拒绝
//       return Promise.reject(error)
//     }

//     // 增加重试次数
//     config.__retryCount += 1

//     // 创造新的承诺来处理指数退避
//     const backoff = new Promise(function (resolve) {
//       setTimeout(function () {
//         resolve()
//       }, config.retryDelay || 1)
//     })

//     // 返回承诺，其中将撤回axios以重试请求
//     return backoff.then(function () {
//       return axios(config)
//     })
//   // return Promise.reject(error)
//   })

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
