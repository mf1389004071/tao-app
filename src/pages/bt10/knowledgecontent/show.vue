<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="knowledgecontent.id" type="line"></uni-section>
      <uni-section title="标题" :sub-title="knowledgecontent.title" type="line"></uni-section>
      <uni-section title="副标题" :sub-title="knowledgecontent.subtitle" type="line"></uni-section>
      <uni-section title="正文内容" :sub-title="knowledgecontent.content" type="line"></uni-section>
      <uni-section title="类型：文章/工具/案例/Wiki等" :sub-title="knowledgecontent.contentType" type="line"></uni-section>
      <uni-section title="所属分类ID" :sub-title="knowledgecontent.categoryId" type="line"></uni-section>
      <uni-section title="作者用户ID" :sub-title="knowledgecontent.authorId" type="line"></uni-section>
      <uni-section title="创始人/发起人ID" :sub-title="knowledgecontent.founderId" type="line"></uni-section>
      <uni-section title="重点贡献人(逗号分隔)" :sub-title="knowledgecontent.keyContributors" type="line"></uni-section>
      <uni-section title="内容负责人ID" :sub-title="knowledgecontent.managerId" type="line"></uni-section>
      <uni-section title="宣传语" :sub-title="knowledgecontent.promotionalText" type="line"></uni-section>
      <uni-section title="核心价值观描述" :sub-title="knowledgecontent.coreValues" type="line"></uni-section>
      <uni-section title="标签(逗号分隔)" :sub-title="knowledgecontent.tags" type="line"></uni-section>
      <uni-section title="状态：草稿/审核中/已发布/归档/已删" :sub-title="knowledgecontent.bizStatus" type="line"></uni-section>
      <uni-section title="发布时间" :sub-title="knowledgecontent.publishTime" type="line"></uni-section>
      <uni-section title="浏览次数" :sub-title="knowledgecontent.viewCount" type="line"></uni-section>
      <uni-section title="点赞数" :sub-title="knowledgecontent.likeCount" type="line"></uni-section>
      <uni-section title="评论数" :sub-title="knowledgecontent.commentCount" type="line"></uni-section>
      <uni-section title="分享数" :sub-title="knowledgecontent.shareCount" type="line"></uni-section>
      <uni-section title="收藏数" :sub-title="knowledgecontent.collectCount" type="line"></uni-section>
      <uni-section title="SEO标题" :sub-title="knowledgecontent.seoTitle" type="line"></uni-section>
      <uni-section title="SEO描述" :sub-title="knowledgecontent.seoDescription" type="line"></uni-section>
      <uni-section title="SEO关键词" :sub-title="knowledgecontent.seoKeywords" type="line"></uni-section>
      <uni-section title="来源" :sub-title="knowledgecontent.sourceFrom" type="line"></uni-section>
      <uni-section title="难度等级" :sub-title="knowledgecontent.difficultyLevel" type="line"></uni-section>
      <uni-section title="AI生成摘要" :sub-title="knowledgecontent.aiSummary" type="line"></uni-section>
      <uni-section title="扩展文本1" :sub-title="knowledgecontent.text1" type="line"></uni-section>
      <uni-section title="扩展文本2" :sub-title="knowledgecontent.text2" type="line"></uni-section>
      <uni-section title="扩展文本3" :sub-title="knowledgecontent.text3" type="line"></uni-section>
      <uni-section title="扩展JSON" :sub-title="knowledgecontent.jsonData" type="line"></uni-section>
      <uni-section title="备注" :sub-title="knowledgecontent.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="knowledgecontent.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getKnowledgecontent } from "@/api/bt10/knowledgecontent";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecontent = ref({
  id: null,
  title: null,
  subtitle: null,
  content: null,
  contentType: null,
  categoryId: null,
  authorId: null,
  founderId: null,
  keyContributors: null,
  managerId: null,
  promotionalText: null,
  coreValues: null,
  tags: null,
  bizStatus: null,
  publishTime: null,
  viewCount: null,
  likeCount: null,
  commentCount: null,
  shareCount: null,
  collectCount: null,
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  sourceFrom: null,
  difficultyLevel: null,
  aiSummary: null,
  createId: null,
  updateId: null,
  deleteId: null,
  createTime: null,
  updateTime: null,
  deleteTime: null,
  delFlag: null,
  text1: null,
  text2: null,
  text3: null,
  jsonData: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getKnowledgecontent(params.id).then(res=>{
    knowledgecontent.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
