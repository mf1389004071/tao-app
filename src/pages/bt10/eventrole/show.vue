<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventrole.id" type="line"></uni-section>
      <uni-section title="活动ID" :sub-title="eventrole.eventId" type="line"></uni-section>
      <uni-section title="角色名：天使/主持人/PM/助教/签到/主讲等" :sub-title="eventrole.roleName" type="line"></uni-section>
      <uni-section title="角色说明" :sub-title="eventrole.roleDescription" type="line"></uni-section>
      <uni-section title="该角色最大人数" :sub-title="eventrole.maxParticipants" type="line"></uni-section>
      <uni-section title="当前已分配人数" :sub-title="eventrole.currentParticipants" type="line"></uni-section>
      <uni-section title="角色权限配置" :sub-title="eventrole.permissions" type="line"></uni-section>
      <uni-section title="担任该角色奖励积分" :sub-title="eventrole.pointsReward" type="line"></uni-section>
      <uni-section title="担任该角色奖励贡献点" :sub-title="eventrole.contribReward" type="line"></uni-section>
      <uni-section title="职责说明" :sub-title="eventrole.responsibilities" type="line"></uni-section>
      <uni-section title="任职要求" :sub-title="eventrole.requirements" type="line"></uni-section>
      <uni-section title="排序" :sub-title="eventrole.orderNum" type="line"></uni-section>
      <uni-section title="状态" :sub-title="eventrole.status" type="line"></uni-section>
      <uni-section title="备注" :sub-title="eventrole.remark" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventrole } from "@/api/bt10/eventrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventrole = ref({
  id: null,
  eventId: null,
  roleName: null,
  roleDescription: null,
  maxParticipants: null,
  currentParticipants: null,
  permissions: null,
  pointsReward: null,
  contribReward: null,
  responsibilities: null,
  requirements: null,
  orderNum: null,
  status: null,
  createId: null,
  updateId: null,
  createTime: null,
  updateTime: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getEventrole(params.id).then(res=>{
    eventrole.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
