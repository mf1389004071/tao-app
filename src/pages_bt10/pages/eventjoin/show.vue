<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventjoin.id" type="line"></uni-section>
      <uni-section title="活动ID" :sub-title="eventjoin.eventId" type="line"></uni-section>
      <uni-section title="报名用户ID" :sub-title="eventjoin.userId" type="line"></uni-section>
      <uni-section title="状态：已确认/已取消/已签到/缺席" :sub-title="eventjoin.bizStatus" type="line"></uni-section>
      <uni-section title="报名表单填写数据" :sub-title="eventjoin.joinForm" type="line"></uni-section>
      <uni-section title="支付状态：待付/已付/已退/失败/已取消" :sub-title="eventjoin.paymentStatus" type="line"></uni-section>
      <uni-section title="支付金额" :sub-title="eventjoin.paymentAmount" type="line"></uni-section>
      <uni-section title="支付方式：贡献点/积分/混合/现金等" :sub-title="eventjoin.paymentMethod" type="line"></uni-section>
      <uni-section title="支付单号" :sub-title="eventjoin.paymentNo" type="line"></uni-section>
      <uni-section title="签到时间" :sub-title="eventjoin.checkedInTime" type="line"></uni-section>
      <uni-section title="签到方式：二维码/定位/手动" :sub-title="eventjoin.checkInMethod" type="line"></uni-section>
      <uni-section title="签到位置信息" :sub-title="eventjoin.checkInLocation" type="line"></uni-section>
      <uni-section title="转化状态：无/有意向/已转化" :sub-title="eventjoin.conversionStatus" type="line"></uni-section>
      <uni-section title="转化产品ID" :sub-title="eventjoin.conversionProductId" type="line"></uni-section>
      <uni-section title="转化金额" :sub-title="eventjoin.conversionAmount" type="line"></uni-section>
      <uni-section title="转化备注" :sub-title="eventjoin.conversionNotes" type="line"></uni-section>
      <uni-section title="状态" :sub-title="eventjoin.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventjoin } from "@/api/bt10/eventjoin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventjoin = ref({
  id: null,
  eventId: null,
  userId: null,
  bizStatus: null,
  joinForm: null,
  paymentStatus: null,
  paymentAmount: null,
  paymentMethod: null,
  paymentNo: null,
  checkedInTime: null,
  checkInMethod: null,
  checkInLocation: null,
  conversionStatus: null,
  conversionProductId: null,
  conversionAmount: null,
  conversionNotes: null,
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
  getEventjoin(params.id).then(res=>{
    eventjoin.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
