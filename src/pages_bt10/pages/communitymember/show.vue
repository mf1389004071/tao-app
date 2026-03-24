<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="communitymember.id" type="line"></uni-section>
      <uni-section title="社群ID" :sub-title="communitymember.communityId" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="communitymember.userId" type="line"></uni-section>
      <uni-section title="角色：群主/管理员/成员" :sub-title="communitymember.role" type="line"></uni-section>
      <uni-section title="状态：在群/已退出/被移出" :sub-title="communitymember.bizStatus" type="line"></uni-section>
      <uni-section title="加入时间" :sub-title="communitymember.joinedTime" type="line"></uni-section>
      <uni-section title="离开时间" :sub-title="communitymember.leftTime" type="line"></uni-section>
      <uni-section title="状态" :sub-title="communitymember.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getCommunitymember } from "@/api/bt10/communitymember";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const communitymember = ref({
  id: null,
  communityId: null,
  userId: null,
  role: null,
  bizStatus: null,
  joinedTime: null,
  leftTime: null,
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
  getCommunitymember(params.id).then(res=>{
    communitymember.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
