import type { ResponseData } from '@/types/request'

type AnyResponse = ResponseData<any>

function ok(partial: Partial<AnyResponse>): AnyResponse {
  const rows = (partial.rows != null ? partial.rows : []) as any[]
  return {
    code: partial.code != null ? partial.code : 200,
    msg: partial.msg != null ? partial.msg : 'success',
    data: partial.data !== undefined ? partial.data : null,
    imgUrl: partial.imgUrl != null ? partial.imgUrl : '',
    total: partial.total != null ? partial.total : rows.length,
    rows
  }
}

// -------- 演示数据（参考 better10/front-wechat） --------

const notices = [
  {
    id: 1,
    title: '紧急通知：五一期间“把自己产品化”线下站席位变动',
    isUrgent: true
  }
]

const events = [
  {
    id: 1,
    title: '把自己产品化 · 深圳站',
    city: '深圳 · 南山',
    startTime: '2024-05-20',
    eventPrice: 2999,
    coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    bizStatus: 'OPEN',
    curriculum: [
      '产品化思维底层逻辑',
      '个人商业画布拆解',
      '流量与信任的转换',
      '实战方案演练'
    ],
    learningObjectives: '线下闭门分享、终身校友会、1对1方案诊断'
  },
  {
    id: 2,
    title: '线下工作坊 · 上海站',
    city: '上海',
    startTime: '2024-06-01',
    eventPrice: 1999,
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    bizStatus: 'OPEN',
    curriculum: ['认知重构工作坊', '案例拆解与演练'],
    learningObjectives: '小班深度工作坊'
  }
]

const knowledgeList = [
  {
    id: 1,
    title: '蛋壳理论：从内打破是生命',
    subtitle: '探讨个体成长的内生动力',
    contentType: 'WIKI',
    tags: '蛋壳理论,自我成长,方法论',
    bizStatus: 'PUBLISHED',
    publishTime: '2024-03-10T10:00:00Z',
    viewCount: 1200,
    likeCount: 24,
    aiSummary: '从“蛋壳”的隐喻切入，讲清楚内在驱动力的重要性。'
  },
  {
    id: 2,
    title: '七圣境：顶级高手的人生推演沙盘',
    subtitle: '通过七个维度重构你的认知系统',
    contentType: 'WIKI',
    tags: '七圣境,认知跃迁,系统思考',
    bizStatus: 'PUBLISHED',
    publishTime: '2024-03-12T12:00:00Z',
    viewCount: 980,
    likeCount: 32,
    aiSummary: '用“圣境”比喻人生阶段，帮助你看清下一跳台阶。'
  },
  {
    id: 3,
    title: '关于蛋壳理论的3点思考',
    subtitle: '从内打破是生命，从外打破是食物',
    contentType: 'ARTICLE',
    tags: '蛋壳理论,实修心得',
    bizStatus: 'PUBLISHED',
    publishTime: '2024-03-18T09:30:00Z',
    viewCount: 1500,
    likeCount: 40,
    aiSummary: '结合生活与实修案例，对蛋壳理论做了三点拆解。'
  }
]

const userInviteList = [
  {
    id: 1,
    userName: '联创伙伴_1号',
    inviteTime: '2024-04 加入',
    contrib: '已贡献 3 份 Wiki',
    rewardPoints: 100
  },
  {
    id: 2,
    userName: '联创伙伴_2号',
    inviteTime: '2024-04 加入',
    contrib: '已贡献 1 份 Wiki',
    rewardPoints: 100
  }
]

const userPointLogs = [
  { id: 1, actionType: '发布优质实修心得', points: 10, createTime: '今天 10:20', type: 'earn' },
  { id: 2, actionType: '受邀好友完成注册', points: 50, createTime: '昨天', type: 'earn' },
  { id: 3, actionType: '兑换线下课优惠券', points: -200, createTime: '3天前', type: 'spend' }
]

const userProfile = {
  id: 1,
  name: '李慕白',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  badges: ['创始联创人', 'V3 高手'],
  level: 'Lv.3 高手',
  currentLevel: 'Level 3',
  nextLevel: 'Level 4',
  progress: 75,
  stats: {
    contribution: 1200,
    ongoing: 12,
    practiceDays: 84
  }
}

// -------- 入口函数：根据 URL 返回对应 mock --------

export function handleBt10Mock(
  url: string,
  method: string,
  _data?: any,
  _params?: any
): AnyResponse {
  const pureUrl = url.split('?')[0]
  const upperMethod = method.toUpperCase()

  // 公告列表
  if (pureUrl === '/bt10/notices/list' && upperMethod === 'GET') {
    return ok({ rows: notices })
  }

  // 公告详情
  if (pureUrl.startsWith('/bt10/notices/') && upperMethod === 'GET') {
    const idStr = pureUrl.replace('/bt10/notices/', '')
    const id = Number(idStr)
    const item = notices.find(n => n.id === id) || notices[0]
    return ok({ data: item })
  }

  // 活动列表
  if (pureUrl === '/bt10/eventinfo/list' && upperMethod === 'GET') {
    return ok({ rows: events })
  }

  // 活动详情
  if (pureUrl.startsWith('/bt10/eventinfo/') && upperMethod === 'GET') {
    const idStr = pureUrl.replace('/bt10/eventinfo/', '')
    const id = Number(idStr)
    const item = events.find(e => e.id === id) || events[0]
    return ok({ data: item })
  }

  // 知识内容列表
  if (pureUrl === '/bt10/knowledgecontent/list' && upperMethod === 'GET') {
    return ok({ rows: knowledgeList })
  }

  // 知识内容详情
  if (pureUrl.startsWith('/bt10/knowledgecontent/') && upperMethod === 'GET') {
    const idStr = pureUrl.replace('/bt10/knowledgecontent/', '')
    const id = Number(idStr)
    const item = knowledgeList.find(k => k.id === id) || knowledgeList[0]
    return ok({ data: item })
  }

  // 用户邀请列表
  if (pureUrl === '/bt10/userinvite/list' && upperMethod === 'GET') {
    return ok({ rows: userInviteList })
  }

  // 用户积分流水列表
  if (pureUrl === '/bt10/userpointlogs/list' && upperMethod === 'GET') {
    return ok({ rows: userPointLogs })
  }

  // 用户画像
  if (pureUrl === '/bt10/userprofiles/get' && upperMethod === 'GET') {
    return ok({ data: userProfile })
  }

  // 默认兜底：返回空数据，避免前端报错
  return ok({ data: null, rows: [] })
}

