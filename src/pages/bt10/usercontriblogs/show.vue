<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="usercontriblogs.id" type="line"></uni-section>
      <uni-section title="用户ID(sys_user.user_id)" :sub-title="usercontriblogs.userId" type="line"></uni-section>
      <uni-section title="类型：充值/购买/退款/奖励等" :sub-title="usercontriblogs.actionType" type="line"></uni-section>
      <uni-section title="本次变动金额" :sub-title="usercontriblogs.amount" type="line"></uni-section>
      <uni-section title="变动前贡献点余额" :sub-title="usercontriblogs.balanceBefore" type="line"></uni-section>
      <uni-section title="变动后贡献点余额" :sub-title="usercontriblogs.balanceAfter" type="line"></uni-section>
      <uni-section title="关联业务类型" :sub-title="usercontriblogs.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="usercontriblogs.relatedId" type="line"></uni-section>
      <uni-section title="支付单号" :sub-title="usercontriblogs.paymentNo" type="line"></uni-section>
      <uni-section title="状态" :sub-title="usercontriblogs.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUsercontriblogs } from "@/api/bt10/usercontriblogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usercontriblogs = ref({
  id: null,
  userId: null,
  actionType: null,
  amount: null,
  balanceBefore: null,
  balanceAfter: null,
  relatedType: null,
  relatedId: null,
  paymentNo: null,
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
  getUsercontriblogs(params.id).then(res=>{
    usercontriblogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
