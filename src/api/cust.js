/**
 * C 端（10倍好智慧成长）业务接口
 * 与后端 tao-end 的 /bt10/xxx 路由对应，PC 示例：/dev-api/bt10/eventrole/list
 * 请求时 baseUrl 需配置为后端地址（如 http://192.168.1.7:8081/dev-api）
 */
import { getAction, postAction, postActionGuarded } from '@/utils/request'

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

/** C端：知识内容浏览 +1 */
export function addKnowledgeView(data) {
  return postAction(P('/cust/knowledge/view'), data)
}

/** C端：知识内容分享 +1 */
export function addKnowledgeShare(data) {
  return postAction(P('/cust/knowledge/share'), data)
}

/** C端：点赞/收藏 toggle */
export function toggleKnowledgeAction(data) {
  const contentId = String(data?.contentId || '').trim()
  const actionType = String(data?.actionType || '').trim().toUpperCase()
  const lockKey = `bt10:knowledge:toggle:${contentId}:${actionType}`
  return postActionGuarded(P('/cust/knowledge/action/toggle'), data, { lockKey, mode: 'inflight' })
}

/** C端：当前用户对内容的点赞/收藏状态 */
export function getKnowledgeActionStatus(params) {
  return getAction(P('/cust/knowledge/action/status'), params)
}

/** C端：评论列表 */
export function listKnowledgeComments(params) {
  return getAction(P('/cust/knowledge/comment/list'), params)
}

/** C端：单条评论（互动回复页） */
export function getKnowledgeComment(id) {
  return getAction(P(`/cust/knowledge/comment/${id}`))
}

/** C端：新增评论/回复 */
export function addKnowledgeComment(data) {
  return postAction(P('/cust/knowledge/comment/add'), data)
}

/** 私信：确保与目标用户的会话 */
export function ensureMessageThread(data) {
  return postAction(P('/cust/message/thread/ensure'), data)
}

/** 私信：会话列表 */
export function listMessageThreads(params) {
  return getAction(P('/cust/message/thread/list'), params)
}

/** 私信：消息列表 */
export function listDmMessages(params) {
  return getAction(P('/cust/message/list'), params)
}

/** 私信：发送 */
export function sendDmMessage(data) {
  return postAction(P('/cust/message/send'), data)
}

/** 私信：标记已读 */
export function markDmRead(data) {
  return postAction(P('/cust/message/read'), data)
}

/** 用户公开主页 */
export function getUserPublic(userId) {
  return getAction(P('/cust/user/public'), { userId: String(userId) })
}

/** C端：标签列表（无需后台 tags:list 权限） */
export function listCustTags(params) {
  return getAction(P('/cust/tags/list'), params)
}

/** 用户主页：赞/藏 toggle */
export function toggleUserSocial(data) {
  const userId = String(data?.targetUserId || data?.userId || '').trim()
  const actionType = String(data?.actionType || '').trim().toUpperCase()
  const lockKey = `bt10:user:social:toggle:${userId}:${actionType}`
  return postActionGuarded(P('/cust/user/social/toggle'), data, { lockKey, mode: 'inflight' })
}

/** 用户主页：分享计数 */
export function shareUserProfile(data) {
  return postAction(P('/cust/user/social/share'), data)
}
