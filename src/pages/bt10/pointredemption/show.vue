<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="pointredemption.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="pointredemption.userId" type="line"></uni-section>
      <uni-section title="兑换商品ID" :sub-title="pointredemption.productId" type="line"></uni-section>
      <uni-section title="消耗积分" :sub-title="pointredemption.pointsUsed" type="line"></uni-section>
      <uni-section title="状态：待发放/已核销/已取消/已过期" :sub-title="pointredemption.bizStatus" type="line"></uni-section>
      <uni-section title="兑换码" :sub-title="pointredemption.redemptionCode" type="line"></uni-section>
      <uni-section title="使用/核销时间" :sub-title="pointredemption.usedTime" type="line"></uni-section>
      <uni-section title="过期时间" :sub-title="pointredemption.expiredTime" type="line"></uni-section>
      <uni-section title="状态" :sub-title="pointredemption.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getPointredemption } from "@/api/bt10/pointredemption";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const pointredemption = ref({
  id: null,
  userId: null,
  productId: null,
  pointsUsed: null,
  bizStatus: null,
  redemptionCode: null,
  usedTime: null,
  expiredTime: null,
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
  getPointredemption(params.id).then(res=>{
    pointredemption.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
