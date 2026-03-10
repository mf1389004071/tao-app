<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="userinvite.id" type="line"></uni-section>
      <uni-section title="被邀请人用户ID(sys_user.user_id)" :sub-title="userinvite.userId" type="line"></uni-section>
      <uni-section title="邀请人用户ID" :sub-title="userinvite.inviterId" type="line"></uni-section>
      <uni-section title="使用的邀请码" :sub-title="userinvite.inviteCode" type="line"></uni-section>
      <uni-section title="被邀请时间" :sub-title="userinvite.inviteTime" type="line"></uni-section>
      <uni-section title="状态：待处理/已接受/已发奖" :sub-title="userinvite.rewardStatus" type="line"></uni-section>
      <uni-section title="邀请人是否已领取奖励" :sub-title="userinvite.rewardClaimed" type="line"></uni-section>
      <uni-section title="邀请奖励积分" :sub-title="userinvite.rewardPoints" type="line"></uni-section>
      <uni-section title="邀请奖励贡献点" :sub-title="userinvite.rewardContrib" type="line"></uni-section>
      <uni-section title="备注" :sub-title="userinvite.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="userinvite.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUserinvite } from "@/api/bt10/userinvite";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userinvite = ref({
  id: null,
  userId: null,
  inviterId: null,
  inviteCode: null,
  inviteTime: null,
  rewardStatus: null,
  rewardClaimed: [],
  rewardPoints: null,
  rewardContrib: null,
  remark: null,
  status: null,
  delFlag: null
})

onLoad(() => {
})
onShow(params => {
  getUserinvite(params.id).then(res=>{
    userinvite.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
