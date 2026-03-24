<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="userpointlogs.id" type="line"></uni-section>
      <uni-section title="用户ID(sys_user.user_id)" :sub-title="userpointlogs.userId" type="line"></uni-section>
      <uni-section title="行为类型：签到/发内容/邀请等" :sub-title="userpointlogs.actionType" type="line"></uni-section>
      <uni-section title="本次变动积分(正获得负消耗)" :sub-title="userpointlogs.points" type="line"></uni-section>
      <uni-section title="变动前积分余额" :sub-title="userpointlogs.balanceBefore" type="line"></uni-section>
      <uni-section title="变动后积分余额" :sub-title="userpointlogs.balanceAfter" type="line"></uni-section>
      <uni-section title="关联业务类型如EVENT/CONTENT" :sub-title="userpointlogs.relatedType" type="line"></uni-section>
      <uni-section title="关联业务主键" :sub-title="userpointlogs.relatedId" type="line"></uni-section>
      <uni-section title="该笔积分过期时间" :sub-title="userpointlogs.expiredTime" type="line"></uni-section>
      <uni-section title="状态" :sub-title="userpointlogs.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUserpointlogs } from "@/api/bt10/userpointlogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userpointlogs = ref({
  id: null,
  userId: null,
  actionType: null,
  points: null,
  balanceBefore: null,
  balanceAfter: null,
  relatedType: null,
  relatedId: null,
  expiredTime: null,
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
  getUserpointlogs(params.id).then(res=>{
    userpointlogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
