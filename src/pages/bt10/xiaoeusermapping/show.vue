<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="xiaoeusermapping.id" type="line"></uni-section>
      <uni-section title="本平台用户ID" :sub-title="xiaoeusermapping.userId" type="line"></uni-section>
      <uni-section title="小鹅通用户ID" :sub-title="xiaoeusermapping.xiaoeUserId" type="line"></uni-section>
      <uni-section title="映射方式：自动/手动" :sub-title="xiaoeusermapping.mappingType" type="line"></uni-section>
      <uni-section title="匹配置信度0-1" :sub-title="xiaoeusermapping.confidenceScore" type="line"></uni-section>
      <uni-section title="建立映射时间" :sub-title="xiaoeusermapping.mappedTime" type="line"></uni-section>
      <uni-section title="最后更新时间" :sub-title="xiaoeusermapping.lastUpdateTime" type="line"></uni-section>
      <uni-section title="备注" :sub-title="xiaoeusermapping.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="xiaoeusermapping.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getXiaoeusermapping } from "@/api/bt10/xiaoeusermapping";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const xiaoeusermapping = ref({
  id: null,
  userId: null,
  xiaoeUserId: null,
  mappingType: null,
  confidenceScore: null,
  mappedTime: null,
  lastUpdateTime: null,
  createTime: null,
  updateTime: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getXiaoeusermapping(params.id).then(res=>{
    xiaoeusermapping.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
