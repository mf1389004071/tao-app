/**
 * C 端（10倍好智慧成长）业务接口
 * 与后端 tao-end 的 /bt10/xxx 路由对应，PC 示例：/dev-api/bt10/eventrole/list
 * 请求时 baseUrl 需配置为后端地址（如 http://192.168.1.7:8081/dev-api）
 */
import { getAction, postAction } from '@/utils/request'

const P = (path) => `/bt10${path}`

/** 公告列表 */
export function listNotices(params) {
  return getAction(P('/notices/list'), params)
}

/** 公告详情 */
export function getNotice(id) {
  return getAction(P(`/notices/${id}`))
}

/** 活动列表 */
export function listEventinfo(params) {
  return getAction(P('/eventinfo/list'), params)
}

/** 活动详情 */
export function getEventinfo(id) {
  return getAction(P(`/eventinfo/${id}`))
}

/** 活动报名记录列表 */
export function listEventjoin(params) {
  return getAction(P('/eventjoin/list'), params)
}

/** 新增活动报名记录 */
export function addEventjoin(data) {
  return postAction(P('/eventjoin'), data)
}

/** 知识内容列表 */
export function listKnowledgecontent(params) {
  return getAction(P('/knowledgecontent/list'), params)
}

/** 知识内容详情 */
export function getKnowledgecontent(id) {
  return getAction(P(`/knowledgecontent/${id}`))
}

/** 用户积分流水列表 */
export function listUserpointlogs(params) {
  return getAction(P('/userpointlogs/list'), params)
}

/** 用户邀请列表（当前用户作为邀请人） */
export function listUserinvite(params) {
  return getAction(P('/userinvite/list'), params)
}

/** 用户画像/概况（若后端提供） */
export function getUserprofile(userId) {
  if (userId == null || userId === '') return Promise.resolve({ code: 200, data: null })
  return getAction(P(`/userprofiles/${String(userId)}`))
}

/** 站内通知列表 */
export function listNotifications(params) {
  return getAction(P('/notifications/list'), params)
}

/** 站内通知详情 */
export function getNotification(id) {
  return getAction(P(`/notifications/${id}`))
}

/** 发布知识内容（实修/心得） */
export function addKnowledgecontent(data) {
  return postAction(P('/knowledgecontent'), data)
}
