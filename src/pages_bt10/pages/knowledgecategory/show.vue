<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="knowledgecategory.id" type="line"></uni-section>
      <uni-section title="分类名称" :sub-title="knowledgecategory.name" type="line"></uni-section>
      <uni-section title="URL/唯一标识" :sub-title="knowledgecategory.slug" type="line"></uni-section>
      <uni-section title="父分类ID" :sub-title="knowledgecategory.parentId" type="line"></uni-section>
      <uni-section title="排序" :sub-title="knowledgecategory.orderNum" type="line"></uni-section>
      <uni-section title="图标" :sub-title="knowledgecategory.icon" type="line"></uni-section>
      <uni-section title="主题色" :sub-title="knowledgecategory.color" type="line"></uni-section>
      <uni-section title="可见权限等级1-5" :sub-title="knowledgecategory.permissionLevel" type="line"></uni-section>
      <uni-section title="状态" :sub-title="knowledgecategory.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getKnowledgecategory } from "@/api/bt10/knowledgecategory";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecategory = ref({
  id: null,
  name: null,
  slug: null,
  parentId: null,
  orderNum: null,
  icon: null,
  color: null,
  permissionLevel: null,
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
  getKnowledgecategory(params.id).then(res=>{
    knowledgecategory.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
