<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="paymentitems.id" type="line"></uni-section>
      <uni-section title="支付订单ID" :sub-title="paymentitems.paymentId" type="line"></uni-section>
      <uni-section title="明细类型：PRODUCT/SERVICE/COUPON/IDENTITY等" :sub-title="paymentitems.itemType" type="line"></uni-section>
      <uni-section title="明细名称(商品/服务/身份等)" :sub-title="paymentitems.itemName" type="line"></uni-section>
      <uni-section title="原价(单价)" :sub-title="paymentitems.originalAmount" type="line"></uni-section>
      <uni-section title="实际计价金额(单价，可为0表示赠送)" :sub-title="paymentitems.amount" type="line"></uni-section>
      <uni-section title="数量" :sub-title="paymentitems.quantity" type="line"></uni-section>
      <uni-section title="是否赠品" :sub-title="paymentitems.isGift" type="line"></uni-section>
      <uni-section title="是否可转让" :sub-title="paymentitems.isTransferable" type="line"></uni-section>
      <uni-section title="是否可帮买(代他人购买)" :sub-title="paymentitems.canBuyForOthers" type="line"></uni-section>
      <uni-section title="使用状态：PENDING/USED/EXPIRED/CANCELLED" :sub-title="paymentitems.usageStatus" type="line"></uni-section>
      <uni-section title="发放方式：AUTO/MANUAL/COUPON等" :sub-title="paymentitems.grantMethod" type="line"></uni-section>
      <uni-section title="关联业务类型：EVENT/COURSE/IDENTITY/POINT_PRODUCT等" :sub-title="paymentitems.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="paymentitems.relatedId" type="line"></uni-section>
      <uni-section title="状态" :sub-title="paymentitems.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getPaymentitems } from "@/api/bt10/paymentitems";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const paymentitems = ref({
  id: null,
  paymentId: null,
  itemType: null,
  itemName: null,
  originalAmount: null,
  amount: null,
  quantity: null,
  isGift: [],
  isTransferable: [],
  canBuyForOthers: [],
  usageStatus: null,
  grantMethod: null,
  relatedType: null,
  relatedId: null,
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
  getPaymentitems(params.id).then(res=>{
    paymentitems.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
