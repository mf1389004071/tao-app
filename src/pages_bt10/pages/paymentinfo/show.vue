<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="paymentinfo.id" type="line"></uni-section>
      <uni-section title="业务订单号" :sub-title="paymentinfo.orderNo" type="line"></uni-section>
      <uni-section title="下单用户ID" :sub-title="paymentinfo.userId" type="line"></uni-section>
      <uni-section title="订单类型：活动/商品/充值等" :sub-title="paymentinfo.orderType" type="line"></uni-section>
      <uni-section title="关联业务类型" :sub-title="paymentinfo.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="paymentinfo.relatedId" type="line"></uni-section>
      <uni-section title="订单总金额" :sub-title="paymentinfo.totalAmount" type="line"></uni-section>
      <uni-section title="贡献点支付额" :sub-title="paymentinfo.contribAmount" type="line"></uni-section>
      <uni-section title="积分支付额" :sub-title="paymentinfo.pointsAmount" type="line"></uni-section>
      <uni-section title="现金支付额" :sub-title="paymentinfo.cashAmount" type="line"></uni-section>
      <uni-section title="支付状态：待付/已付/已退/失败/已取消" :sub-title="paymentinfo.paymentStatus" type="line"></uni-section>
      <uni-section title="支付方式：微信/支付宝/贡献点/积分等" :sub-title="paymentinfo.paymentMethod" type="line"></uni-section>
      <uni-section title="第三方支付单号" :sub-title="paymentinfo.paymentNo" type="line"></uni-section>
      <uni-section title="支付成功时间" :sub-title="paymentinfo.paidTime" type="line"></uni-section>
      <uni-section title="退款金额" :sub-title="paymentinfo.refundAmount" type="line"></uni-section>
      <uni-section title="退款原因" :sub-title="paymentinfo.refundReason" type="line"></uni-section>
      <uni-section title="退款时间" :sub-title="paymentinfo.refundedTime" type="line"></uni-section>
      <uni-section title="状态" :sub-title="paymentinfo.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getPaymentinfo } from "@/api/bt10/paymentinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const paymentinfo = ref({
  id: null,
  orderNo: null,
  userId: null,
  orderType: null,
  relatedType: null,
  relatedId: null,
  totalAmount: null,
  contribAmount: null,
  pointsAmount: null,
  cashAmount: null,
  paymentStatus: null,
  paymentMethod: null,
  paymentNo: null,
  paidTime: null,
  refundAmount: null,
  refundReason: null,
  refundedTime: null,
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
  getPaymentinfo(params.id).then(res=>{
    paymentinfo.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
