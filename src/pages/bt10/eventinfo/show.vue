<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventinfo.id" type="line"></uni-section>
      <uni-section title="活动标题" :sub-title="eventinfo.title" type="line"></uni-section>
      <uni-section title="参与方式：线上/线下/混合" :sub-title="eventinfo.joinType" type="line"></uni-section>
      <uni-section title="活动分类" :sub-title="eventinfo.category" type="line"></uni-section>
      <uni-section title="开始时间" :sub-title="eventinfo.startTime" type="line"></uni-section>
      <uni-section title="结束时间" :sub-title="eventinfo.endTime" type="line"></uni-section>
      <uni-section title="报名截止时间" :sub-title="eventinfo.joinDeadline" type="line"></uni-section>
      <uni-section title="最大参与人数" :sub-title="eventinfo.maxParticipants" type="line"></uni-section>
      <uni-section title="已报名人数" :sub-title="eventinfo.registeredCount" type="line"></uni-section>
      <uni-section title="已签到人数" :sub-title="eventinfo.checkedInCount" type="line"></uni-section>
      <uni-section title="乐观锁版本号" :sub-title="eventinfo.version" type="line"></uni-section>
      <uni-section title="地点简述" :sub-title="eventinfo.location" type="line"></uni-section>
      <uni-section title="会议/直播链接" :sub-title="eventinfo.meetingUrl" type="line"></uni-section>
      <uni-section title="详细地址" :sub-title="eventinfo.address" type="line"></uni-section>
      <uni-section title="城市" :sub-title="eventinfo.city" type="line"></uni-section>
      <uni-section title="封面图" :sub-title="eventinfo.coverImageUrl" type="line"></uni-section>
      <uni-section title="列表图" :sub-title="eventinfo.listImageUrl" type="line"></uni-section>
      <uni-section title="详情图" :sub-title="eventinfo.detailImageUrl" type="line"></uni-section>
      <uni-section title="海报图" :sub-title="eventinfo.posterImageUrl" type="line"></uni-section>
      <uni-section title="状态：草稿/已发布/报名中/已满/进行中/已结束/已取消" :sub-title="eventinfo.bizStatus" type="line"></uni-section>
      <uni-section title="是否公开可见" :sub-title="eventinfo.isPublic" type="line"></uni-section>
      <uni-section title="参与奖励积分" :sub-title="eventinfo.basePointsReward" type="line"></uni-section>
      <uni-section title="RRule周期规则" :sub-title="eventinfo.recurrenceRule" type="line"></uni-section>
      <uni-section title="是否周期活动" :sub-title="eventinfo.isRecurring" type="line"></uni-section>
      <uni-section title="父活动ID(周期活动)" :sub-title="eventinfo.parentEventId" type="line"></uni-section>
      <uni-section title="活动价格" :sub-title="eventinfo.eventPrice" type="line"></uni-section>
      <uni-section title="活动类型" :sub-title="eventinfo.eventType" type="line"></uni-section>
      <uni-section title="目标学员画像" :sub-title="eventinfo.targetAudience" type="line"></uni-section>
      <uni-section title="学习目标" :sub-title="eventinfo.learningObjectives" type="line"></uni-section>
      <uni-section title="活动结构" :sub-title="eventinfo.eventStructure" type="line"></uni-section>
      <uni-section title="活动内容大纲" :sub-title="eventinfo.curriculum" type="line"></uni-section>
      <uni-section title="转化策略" :sub-title="eventinfo.conversionStrategy" type="line"></uni-section>
      <uni-section title="跟进计划" :sub-title="eventinfo.followUpPlan" type="line"></uni-section>
      <uni-section title="风险管理" :sub-title="eventinfo.riskManagement" type="line"></uni-section>
      <uni-section title="活动标签" :sub-title="eventinfo.eventTags" type="line"></uni-section>
      <uni-section title="主办方" :sub-title="eventinfo.organizer" type="line"></uni-section>
      <uni-section title="联系方式" :sub-title="eventinfo.contact" type="line"></uni-section>
      <uni-section title="负责人ID" :sub-title="eventinfo.pmUserId" type="line"></uni-section>
      <uni-section title="状态" :sub-title="eventinfo.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventinfo } from "@/api/bt10/eventinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventinfo = ref({
  id: null,
  title: null,
  joinType: null,
  category: null,
  startTime: null,
  endTime: null,
  joinDeadline: null,
  maxParticipants: null,
  registeredCount: null,
  checkedInCount: null,
  version: null,
  location: null,
  meetingUrl: null,
  address: null,
  city: null,
  coverImageUrl: null,
  listImageUrl: null,
  detailImageUrl: null,
  posterImageUrl: null,
  bizStatus: null,
  isPublic: [],
  basePointsReward: null,
  recurrenceRule: null,
  isRecurring: [],
  parentEventId: null,
  eventPrice: null,
  eventType: null,
  targetAudience: null,
  learningObjectives: null,
  eventStructure: null,
  curriculum: null,
  conversionStrategy: null,
  followUpPlan: null,
  riskManagement: null,
  eventTags: null,
  organizer: null,
  contact: null,
  pmUserId: null,
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
  deleteId: null,
  deleteTime: null,
  status: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getEventinfo(params.id).then(res=>{
    eventinfo.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
