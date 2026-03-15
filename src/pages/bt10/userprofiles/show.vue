<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="用户ID(主键且外键)" :sub-title="userprofiles.userId" type="line"></uni-section>
      <uni-section title="真实姓名" :sub-title="userprofiles.realName" type="line"></uni-section>
      <uni-section title="当前积分余额" :sub-title="userprofiles.points" type="line"></uni-section>
      <uni-section title="历史累计获得积分" :sub-title="userprofiles.totalPoints" type="line"></uni-section>
      <uni-section title="贡献点余额(1:1人民币)" :sub-title="userprofiles.contributionPoints" type="line"></uni-section>
      <uni-section title="历史累计贡献点" :sub-title="userprofiles.totalContributionPoints" type="line"></uni-section>
      <uni-section title="成长阶段：入门/学员/高手/导师" :sub-title="userprofiles.growthStage" type="line"></uni-section>
      <uni-section title="加入/注册日期" :sub-title="userprofiles.joinDate" type="line"></uni-section>
      <uni-section title="最后活跃时间" :sub-title="userprofiles.lastActiveAt" type="line"></uni-section>
      <uni-section title="微信开放平台 unionid" :sub-title="userprofiles.wechatUnionid" type="line"></uni-section>
      <uni-section title="微信开放平台 openid" :sub-title="userprofiles.wechatOpenid" type="line"></uni-section>
      <uni-section title="小程序 openid" :sub-title="userprofiles.miniappOpenid" type="line"></uni-section>
      <uni-section title="企业微信用户ID" :sub-title="userprofiles.wxWorkUserid" type="line"></uni-section>
      <uni-section title="Facebook用户ID" :sub-title="userprofiles.facebookUserid" type="line"></uni-section>
      <uni-section title="Google用户ID" :sub-title="userprofiles.googleUserid" type="line"></uni-section>
      <uni-section title="Apple用户ID" :sub-title="userprofiles.appleUserid" type="line"></uni-section>
      <uni-section title="Outlook用户ID" :sub-title="userprofiles.outlookUserid" type="line"></uni-section>
      <uni-section title="小鹅通用户ID(同步)" :sub-title="userprofiles.xiaoeUserId" type="line"></uni-section>
      <uni-section title="小鹅通原始数据快照" :sub-title="userprofiles.xiaoeData" type="line"></uni-section>
      <uni-section title="邀请人用户ID(sys_user.user_id)" :sub-title="userprofiles.inviterId" type="line"></uni-section>
      <uni-section title="本人邀请码，用于邀请好友" :sub-title="userprofiles.invitationCode" type="line"></uni-section>
      <uni-section title="业务角色：创始人/联创/合伙人/高手/城市主理人/会员" :sub-title="userprofiles.bizRole" type="line"></uni-section>
      <uni-section title="最美照片URL" :sub-title="userprofiles.bestPhotoUrl" type="line"></uni-section>
      <uni-section title="微信头像URL(同步用)" :sub-title="userprofiles.avatarWechatUrl" type="line"></uni-section>
      <uni-section title="宣传用头像URL" :sub-title="userprofiles.avatarPromoUrl" type="line"></uni-section>
      <uni-section title="个人宣传图URL" :sub-title="userprofiles.promoImageUrl" type="line"></uni-section>
      <uni-section title="心树图URL(商业定位成果)" :sub-title="userprofiles.heartTreeUrl" type="line"></uni-section>
      <uni-section title="心钥图URL(商业定位成果)" :sub-title="userprofiles.heartKeyUrl" type="line"></uni-section>
      <uni-section title="商业定位文案(探索本质)" :sub-title="userprofiles.businessPositioning" type="line"></uni-section>
      <uni-section title="天赋解读与能力总结" :sub-title="userprofiles.talentSummary" type="line"></uni-section>
      <uni-section title="可交流时段描述" :sub-title="userprofiles.availableTimeSlots" type="line"></uni-section>
      <uni-section title="可约状态：可约/已约/不约" :sub-title="userprofiles.appointmentStatus" type="line"></uni-section>
      <uni-section title="额外画像信息(JSON)，如家庭成员/挑战列表等" :sub-title="userprofiles.extraProfile" type="line"></uni-section>
      <uni-section title="状态" :sub-title="userprofiles.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUserprofiles } from "@/api/bt10/userprofiles";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userprofiles = ref({
  userId: null,
  realName: null,
  points: null,
  totalPoints: null,
  contributionPoints: null,
  totalContributionPoints: null,
  growthStage: null,
  joinDate: null,
  lastActiveAt: null,
  wechatUnionid: null,
  wechatOpenid: null,
  miniappOpenid: null,
  wxWorkUserid: null,
  facebookUserid: null,
  googleUserid: null,
  appleUserid: null,
  outlookUserid: null,
  xiaoeUserId: null,
  xiaoeData: null,
  inviterId: null,
  invitationCode: null,
  bizRole: null,
  bestPhotoUrl: null,
  avatarWechatUrl: null,
  avatarPromoUrl: null,
  promoImageUrl: null,
  heartTreeUrl: null,
  heartKeyUrl: null,
  businessPositioning: null,
  talentSummary: null,
  availableTimeSlots: null,
  appointmentStatus: null,
  extraProfile: null,
  text1: null,
  text2: null,
  text3: null,
  jsonData: null,
  createId: null,
  createBy: null,
  createTime: null,
  updateId: null,
  updateBy: null,
  updateTime: null,
  status: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getUserprofiles(params.userId).then(res=>{
    userprofiles.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
