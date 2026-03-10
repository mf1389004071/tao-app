<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="datachangelogs.id" type="line"></uni-section>
      <uni-section title="被变更表名" :sub-title="datachangelogs.tableName" type="line"></uni-section>
      <uni-section title="被变更记录ID" :sub-title="datachangelogs.recordId" type="line"></uni-section>
      <uni-section title="变更类型：新增/更新/删除" :sub-title="datachangelogs.changeType" type="line"></uni-section>
      <uni-section title="变更字段(更新时)" :sub-title="datachangelogs.fieldName" type="line"></uni-section>
      <uni-section title="旧值" :sub-title="datachangelogs.oldValue" type="line"></uni-section>
      <uni-section title="新值" :sub-title="datachangelogs.newValue" type="line"></uni-section>
      <uni-section title="变更原因" :sub-title="datachangelogs.changeReason" type="line"></uni-section>
      <uni-section title="操作人用户ID" :sub-title="datachangelogs.operatorId" type="line"></uni-section>
      <uni-section title="操作人类型：用户/系统/管理员" :sub-title="datachangelogs.operatorType" type="line"></uni-section>
      <uni-section title="操作IP" :sub-title="datachangelogs.ipAddress" type="line"></uni-section>
      <uni-section title="UA" :sub-title="datachangelogs.userAgent" type="line"></uni-section>
      <uni-section title="变更时间" :sub-title="datachangelogs.changedTime" type="line"></uni-section>
      <uni-section title="扩展元数据" :sub-title="datachangelogs.metadata" type="line"></uni-section>
      <uni-section title="备注" :sub-title="datachangelogs.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="datachangelogs.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getDatachangelogs } from "@/api/bt10/datachangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const datachangelogs = ref({
  id: null,
  tableName: null,
  recordId: null,
  changeType: null,
  fieldName: null,
  oldValue: null,
  newValue: null,
  changeReason: null,
  operatorId: null,
  operatorType: null,
  ipAddress: null,
  userAgent: null,
  changedTime: null,
  metadata: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getDatachangelogs(params.id).then(res=>{
    datachangelogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
