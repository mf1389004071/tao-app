<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="标题" prop="title">
          <uni-easyinput v-model="form.title" placeholder="请输入标题" />
        </uni-forms-item>
        <uni-forms-item label="副标题" prop="subtitle">
          <uni-easyinput v-model="form.subtitle" placeholder="请输入副标题" />
        </uni-forms-item>
        <uni-forms-item label="正文内容">
          <!-- <editor v-model="form.content" :min-height="192"/> -->
        </uni-forms-item>
        <uni-forms-item label="所属分类ID" prop="categoryId">
          <uni-easyinput v-model="form.categoryId" placeholder="请输入所属分类ID" />
        </uni-forms-item>
        <uni-forms-item label="作者用户ID" prop="authorId">
          <uni-easyinput v-model="form.authorId" placeholder="请输入作者用户ID" />
        </uni-forms-item>
        <uni-forms-item label="创始人/发起人ID" prop="founderId">
          <uni-easyinput v-model="form.founderId" placeholder="请输入创始人/发起人ID" />
        </uni-forms-item>
        <uni-forms-item label="重点贡献人(逗号分隔)" prop="keyContributors">
          <uni-easyinput v-model="form.keyContributors" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="内容负责人ID" prop="managerId">
          <uni-easyinput v-model="form.managerId" placeholder="请输入内容负责人ID" />
        </uni-forms-item>
        <uni-forms-item label="宣传语" prop="promotionalText">
          <uni-easyinput v-model="form.promotionalText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="核心价值观描述" prop="coreValues">
          <uni-easyinput v-model="form.coreValues" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="标签(逗号分隔)" prop="tags">
          <uni-easyinput v-model="form.tags" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="发布时间" prop="publishTime">
          <uni-datetime-picker type="datetime" v-model="form.publishTime"/>
        </uni-forms-item>
        <uni-forms-item label="浏览次数" prop="viewCount">
          <uni-easyinput v-model="form.viewCount" placeholder="请输入浏览次数" />
        </uni-forms-item>
        <uni-forms-item label="点赞数" prop="likeCount">
          <uni-easyinput v-model="form.likeCount" placeholder="请输入点赞数" />
        </uni-forms-item>
        <uni-forms-item label="评论数" prop="commentCount">
          <uni-easyinput v-model="form.commentCount" placeholder="请输入评论数" />
        </uni-forms-item>
        <uni-forms-item label="分享数" prop="shareCount">
          <uni-easyinput v-model="form.shareCount" placeholder="请输入分享数" />
        </uni-forms-item>
        <uni-forms-item label="收藏数" prop="collectCount">
          <uni-easyinput v-model="form.collectCount" placeholder="请输入收藏数" />
        </uni-forms-item>
        <uni-forms-item label="SEO标题" prop="seoTitle">
          <uni-easyinput v-model="form.seoTitle" placeholder="请输入SEO标题" />
        </uni-forms-item>
        <uni-forms-item label="SEO描述" prop="seoDescription">
          <uni-easyinput v-model="form.seoDescription" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="SEO关键词" prop="seoKeywords">
          <uni-easyinput v-model="form.seoKeywords" placeholder="请输入SEO关键词" />
        </uni-forms-item>
        <uni-forms-item label="来源" prop="sourceFrom">
          <uni-easyinput v-model="form.sourceFrom" placeholder="请输入来源" />
        </uni-forms-item>
        <uni-forms-item label="难度等级" prop="difficultyLevel">
          <uni-easyinput v-model="form.difficultyLevel" placeholder="请输入难度等级" />
        </uni-forms-item>
        <uni-forms-item label="AI生成摘要" prop="aiSummary">
          <uni-easyinput v-model="form.aiSummary" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getKnowledgecontent, delKnowledgecontent, addKnowledgecontent, updateKnowledgecontent } from "@/api/bt10/knowledgecontent";
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
onShow(params=>{
  if(params.id){
      getKnowledgecontent(params.id).then(res=>{
        knowledgecontent.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delKnowledgecontent(id).then(()=>{
    navigateTo("/pages/bt10/knowledgecontent/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddKnowledgecontent() {
  addKnowledgecontent(knowledgecontent.value).then(()=>{
    navigateTo("/pages/bt10/knowledgecontent/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
