<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="pointredemption.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="pointredemption.userId" type="line"></uni-section>
      <uni-section title="兑换商品ID" :sub-title="pointredemption.productId" type="line"></uni-section>
      <uni-section title="消耗积分" :sub-title="pointredemption.pointsUsed" type="line"></uni-section>
      <uni-section title="状态：待发放/已完成/已取消/已过期" :sub-title="pointredemption.bizStatus" type="line"></uni-section>
      <uni-section title="兑换码" :sub-title="pointredemption.redemptionCode" type="line"></uni-section>
      <uni-section title="使用/核销时间" :sub-title="pointredemption.usedTime" type="line"></uni-section>
      <uni-section title="过期时间" :sub-title="pointredemption.expiredTime" type="line"></uni-section>
      <uni-section title="扩展文本1" :sub-title="pointredemption.text1" type="line"></uni-section>
      <uni-section title="扩展文本2" :sub-title="pointredemption.text2" type="line"></uni-section>
      <uni-section title="扩展文本3" :sub-title="pointredemption.text3" type="line"></uni-section>
      <uni-section title="扩展JSON" :sub-title="pointredemption.jsonData" type="line"></uni-section>
      <uni-section title="备注" :sub-title="pointredemption.remark" type="line"></uni-section>
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
  createId: null,
  updateId: null,
  createTime: null,
  updateTime: null,
  delFlag: null,
  text1: null,
  text2: null,
  text3: null,
  jsonData: null,
  remark: null,
  status: null
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
