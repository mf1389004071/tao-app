<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="communityinfo.id" type="line"></uni-section>
      <uni-section title="社群名称" :sub-title="communityinfo.name" type="line"></uni-section>
      <uni-section title="创建者(合伙人)用户ID" :sub-title="communityinfo.ownerId" type="line"></uni-section>
      <uni-section title="是否公开可见" :sub-title="communityinfo.isPublic" type="line"></uni-section>
      <uni-section title="最大成员数" :sub-title="communityinfo.maxMembers" type="line"></uni-section>
      <uni-section title="当前成员数" :sub-title="communityinfo.memberCount" type="line"></uni-section>
      <uni-section title="封面图" :sub-title="communityinfo.coverImageUrl" type="line"></uni-section>
      <uni-section title="所在城市" :sub-title="communityinfo.city" type="line"></uni-section>
      <uni-section title="状态：正常/已归档/已解散" :sub-title="communityinfo.bizStatus" type="line"></uni-section>
      <uni-section title="状态" :sub-title="communityinfo.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getCommunityinfo } from "@/api/bt10/communityinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const communityinfo = ref({
  id: null,
  name: null,
  ownerId: null,
  isPublic: [],
  maxMembers: null,
  memberCount: null,
  coverImageUrl: null,
  city: null,
  bizStatus: null,
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
  getCommunityinfo(params.id).then(res=>{
    communityinfo.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
