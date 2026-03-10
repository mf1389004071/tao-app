<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventjoinerrole.id" type="line"></uni-section>
      <uni-section title="报名记录ID" :sub-title="eventjoinerrole.joinId" type="line"></uni-section>
      <uni-section title="活动角色ID" :sub-title="eventjoinerrole.roleId" type="line"></uni-section>
      <uni-section title="分配时间" :sub-title="eventjoinerrole.assignedTime" type="line"></uni-section>
      <uni-section title="确认时间" :sub-title="eventjoinerrole.confirmedTime" type="line"></uni-section>
      <uni-section title="状态：已分配/已确认/已拒绝" :sub-title="eventjoinerrole.bizStatus" type="line"></uni-section>
      <uni-section title="备注" :sub-title="eventjoinerrole.remark" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventjoinerrole } from "@/api/bt10/eventjoinerrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventjoinerrole = ref({
  id: null,
  joinId: null,
  roleId: null,
  assignedTime: null,
  confirmedTime: null,
  bizStatus: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getEventjoinerrole(params.id).then(res=>{
    eventjoinerrole.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
