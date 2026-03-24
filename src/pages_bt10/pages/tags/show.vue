<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="tags.id" type="line"></uni-section>
      <uni-section title="标签类型：ABILITY/INTEREST/INDUSTRY/RESOURCE/NEED等" :sub-title="tags.tagType" type="line"></uni-section>
      <uni-section title="标签编码(同类型内唯一)" :sub-title="tags.code" type="line"></uni-section>
      <uni-section title="标签名称" :sub-title="tags.name" type="line"></uni-section>
      <uni-section title="父标签ID(可选)" :sub-title="tags.parentId" type="line"></uni-section>
      <uni-section title="排序" :sub-title="tags.orderNum" type="line"></uni-section>
      <uni-section title="状态" :sub-title="tags.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getTags } from "@/api/bt10/tags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const tags = ref({
  id: null,
  tagType: null,
  code: null,
  name: null,
  parentId: null,
  orderNum: null,
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
  getTags(params.id).then(res=>{
    tags.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
