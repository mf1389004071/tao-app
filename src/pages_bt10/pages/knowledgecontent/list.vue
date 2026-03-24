<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>标题</uni-th>
        <uni-th>副标题</uni-th>
        <uni-th>正文内容</uni-th>
        <uni-th>类型：文章/工具/案例/Wiki等</uni-th>
        <uni-th>所属分类ID</uni-th>
        <uni-th>作者用户ID</uni-th>
        <uni-th>创始人/发起人ID</uni-th>
        <uni-th>重点贡献人(逗号分隔)</uni-th>
        <uni-th>内容负责人ID</uni-th>
        <uni-th>宣传语</uni-th>
        <uni-th>核心价值观描述</uni-th>
        <uni-th>标签(逗号分隔)</uni-th>
        <uni-th>状态：草稿/审核中/已发布/归档/已删</uni-th>
        <uni-th>发布时间</uni-th>
        <uni-th>浏览次数</uni-th>
        <uni-th>点赞数</uni-th>
        <uni-th>评论数</uni-th>
        <uni-th>分享数</uni-th>
        <uni-th>收藏数</uni-th>
        <uni-th>SEO标题</uni-th>
        <uni-th>SEO描述</uni-th>
        <uni-th>SEO关键词</uni-th>
        <uni-th>来源</uni-th>
        <uni-th>难度等级</uni-th>
        <uni-th>AI生成摘要</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in knowledgecontentList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.title }}</uni-td>
        <uni-td>{{ item.subtitle }}</uni-td>
        <uni-td>{{ item.content }}</uni-td>
        <uni-td>{{ item.contentType }}</uni-td>
        <uni-td>{{ item.categoryId }}</uni-td>
        <uni-td>{{ item.authorId }}</uni-td>
        <uni-td>{{ item.founderId }}</uni-td>
        <uni-td>{{ item.keyContributors }}</uni-td>
        <uni-td>{{ item.managerId }}</uni-td>
        <uni-td>{{ item.promotionalText }}</uni-td>
        <uni-td>{{ item.coreValues }}</uni-td>
        <uni-td>{{ item.tags }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.publishTime }}</uni-td>
        <uni-td>{{ item.viewCount }}</uni-td>
        <uni-td>{{ item.likeCount }}</uni-td>
        <uni-td>{{ item.commentCount }}</uni-td>
        <uni-td>{{ item.shareCount }}</uni-td>
        <uni-td>{{ item.collectCount }}</uni-td>
        <uni-td>{{ item.seoTitle }}</uni-td>
        <uni-td>{{ item.seoDescription }}</uni-td>
        <uni-td>{{ item.seoKeywords }}</uni-td>
        <uni-td>{{ item.sourceFrom }}</uni-td>
        <uni-td>{{ item.difficultyLevel }}</uni-td>
        <uni-td>{{ item.aiSummary }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listKnowledgecontent} from "@/api/bt10/knowledgecontent";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 知识库内容表格数据
const knowledgecontentList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
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
        status: null,
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询知识库内容列表 */
function  getList() {
      listKnowledgecontent(queryParams.value).then(response => {
        knowledgecontentList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/knowledgecontent/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/knowledgecontent/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/knowledgecontent/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
