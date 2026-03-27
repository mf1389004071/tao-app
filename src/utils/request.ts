import config from '@/config'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { toast, showConfirm, tansParams } from '@/utils/common'
import { RequestConfig, ResponseData } from '@/types/request'
import useUserStore from '@/store/modules/user'

let timeout = 10000
const baseUrl = config.baseUrl
const requestLocks = new Map<string, Promise<any>>()
const requestThrottleTs = new Map<string, number>()

const request = <T>(config: RequestConfig): Promise<ResponseData<T>> => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
    uni.request({
      method: config.method || 'GET',
      timeout: config.timeout || timeout,
      url: (config.baseUrl || baseUrl) + config.url,
      data: config.data,
      header: config.header,
      dataType: 'json'
    }).then(response => {
      /* let [error, res] = response
       if (error) {
         toast('后端接口连接异常')
         reject('后端接口连接异常')
         return
       } */
      const res = response
      const data: ResponseData<T> = res.data as ResponseData<T>
      const code = data.code || 200
      // @ts-ignore
      const msg: string = errorCode[code] || data.msg || errorCode['default']
      if (code === 401) {
        showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
          if (res.confirm) {
            useUserStore().logOut().then(res => {
              uni.reLaunch({ url: '/pages_mine/pages/login/index' })
            })
          }
        })
        reject('无效的会话，或者会话已过期，请重新登录。')
      } else if (code === 500) {
        toast(msg)
        reject('500')
      } else if (code !== 200) {
        toast(msg)
        reject(code)
      }
      resolve(data)
    })
      .catch(error => {
        let { message } = error
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

function withRequestLock<T>(lockKey: string, action: () => Promise<T>): Promise<T> {
  const key = String(lockKey || '').trim()
  if (!key) {
    return action()
  }
  const running = requestLocks.get(key) as Promise<T> | undefined
  if (running) {
    return running
  }
  const p = action().finally(() => {
    requestLocks.delete(key)
  })
  requestLocks.set(key, p)
  return p
}

type RequestGuardMode = 'inflight' | 'throttle'
interface RequestGuardOptions {
  lockKey?: string
  mode?: RequestGuardMode
  throttleMs?: number
}

function withRequestGuard<T>(options: RequestGuardOptions, action: () => Promise<T>): Promise<T> {
  const key = String(options?.lockKey || '').trim()
  if (!key) return action()
  const mode = options?.mode || 'inflight'
  if (mode === 'throttle') {
    const now = Date.now()
    const waitMs = Number(options?.throttleMs || 800)
    const lastTs = requestThrottleTs.get(key) || 0
    if (now - lastTs < waitMs) {
      return Promise.reject(new Error('REQUEST_THROTTLED'))
    }
    requestThrottleTs.set(key, now)
    return action()
  }
  return withRequestLock(key, action)
}

export function postAction(url: string, data?: any, isToken: boolean = true) {
  return request({ data, url, method: 'POST', headers: { isToken }, })
}
export function postActionLocked(url: string, data: any, lockKey: string, isToken: boolean = true) {
  return withRequestLock(lockKey, () => request({ data, url, method: 'POST', headers: { isToken }, }))
}
export function postActionGuarded(url: string, data: any, options: RequestGuardOptions, isToken: boolean = true) {
  return withRequestGuard(options, () => request({ data, url, method: 'POST', headers: { isToken }, }))
}
export function getAction(url: string, params?: any, isToken: boolean = true) {
  return request({ params, url, method: 'GET', headers: { isToken }, })
}
export function putAction(url: string, data?: any, isToken: boolean = true) {
  return request({ data, url, method: 'PUT', headers: { isToken }, })
}
export function deleteAction(url: string, data?: any, isToken: boolean = true) {
  return request({ data, url, method: 'DELETE', headers: { isToken }, })
}

export default request
