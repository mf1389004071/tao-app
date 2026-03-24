<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="xiaoeorders.id" type="line"></uni-section>
      <uni-section title="小鹅通订单号" :sub-title="xiaoeorders.xiaoeOrderNo" type="line"></uni-section>
      <uni-section title="关联本平台用户ID" :sub-title="xiaoeorders.userId" type="line"></uni-section>
      <uni-section title="小鹅通订单状态" :sub-title="xiaoeorders.orderState" type="line"></uni-section>
      <uni-section title="实际支付金额" :sub-title="xiaoeorders.actualFee" type="line"></uni-section>
      <uni-section title="商品名称" :sub-title="xiaoeorders.goodsName" type="line"></uni-section>
      <uni-section title="商品类型" :sub-title="xiaoeorders.goodsType" type="line"></uni-section>
      <uni-section title="SPU类型" :sub-title="xiaoeorders.spuType" type="line"></uni-section>
      <uni-section title="支付状态" :sub-title="xiaoeorders.payState" type="line"></uni-section>
      <uni-section title="支付方式" :sub-title="xiaoeorders.payType" type="line"></uni-section>
      <uni-section title="第三方交易号" :sub-title="xiaoeorders.tradeNo" type="line"></uni-section>
      <uni-section title="小鹅通侧创建时间" :sub-title="xiaoeorders.xiaoeCreateTime" type="line"></uni-section>
      <uni-section title="学员信息快照" :sub-title="xiaoeorders.studentInfo" type="line"></uni-section>
      <uni-section title="发票信息" :sub-title="xiaoeorders.invoiceInfo" type="line"></uni-section>
      <uni-section title="同步状态：待同步/已同步/失败" :sub-title="xiaoeorders.syncStatus" type="line"></uni-section>
      <uni-section title="最近同步时间" :sub-title="xiaoeorders.lastSyncTime" type="line"></uni-section>
      <uni-section title="本地订单号" :sub-title="xiaoeorders.orderNo" type="line"></uni-section>
      <uni-section title="处理状态" :sub-title="xiaoeorders.processStatus" type="line"></uni-section>
      <uni-section title="状态" :sub-title="xiaoeorders.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getXiaoeorders } from "@/api/bt10/xiaoeorders";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const xiaoeorders = ref({
  id: null,
  xiaoeOrderNo: null,
  userId: null,
  orderState: null,
  actualFee: null,
  goodsName: null,
  goodsType: null,
  spuType: null,
  payState: null,
  payType: null,
  tradeNo: null,
  xiaoeCreateTime: null,
  studentInfo: null,
  invoiceInfo: null,
  syncStatus: null,
  lastSyncTime: null,
  orderNo: null,
  processStatus: null,
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
  getXiaoeorders(params.id).then(res=>{
    xiaoeorders.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
