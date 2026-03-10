<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="useridentities.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="useridentities.userId" type="line"></uni-section>
      <uni-section title="身份编码" :sub-title="useridentities.identityCode" type="line"></uni-section>
      <uni-section title="是否当前主身份" :sub-title="useridentities.isPrimary" type="line"></uni-section>
      <uni-section title="状态：ACTIVE/EXPIRED/REVOKED" :sub-title="useridentities.bizStatus" type="line"></uni-section>
      <uni-section title="获得时间" :sub-title="useridentities.acquiredTime" type="line"></uni-section>
      <uni-section title="到期时间(可为空)" :sub-title="useridentities.expiredTime" type="line"></uni-section>
      <uni-section title="来源类型：PAYMENT/EVENT/MANUAL等" :sub-title="useridentities.sourceType" type="line"></uni-section>
      <uni-section title="来源业务ID(如支付订单ID)" :sub-title="useridentities.sourceId" type="line"></uni-section>
      <uni-section title="备注" :sub-title="useridentities.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="useridentities.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUseridentities } from "@/api/bt10/useridentities";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const useridentities = ref({
  id: null,
  userId: null,
  identityCode: null,
  isPrimary: [],
  bizStatus: null,
  acquiredTime: null,
  expiredTime: null,
  sourceType: null,
  sourceId: null,
  createTime: null,
  updateTime: null,
  remark: null,
  delFlag: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getUseridentities(params.id).then(res=>{
    useridentities.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
