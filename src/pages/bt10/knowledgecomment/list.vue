<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>知识内容ID</uni-th>
        <uni-th>评论人ID</uni-th>
        <uni-th>父评论ID(回复)</uni-th>
        <uni-th>评论正文</uni-th>
        <uni-th>点赞数</uni-th>
        <uni-th>是否置顶</uni-th>
        <uni-th>状态：已发布/隐藏</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in knowledgecommentList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.contentId }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.parentId }}</uni-td>
        <uni-td>{{ item.content }}</uni-td>
        <uni-td>{{ item.likeCount }}</uni-td>
        <uni-td>{{ item.isPinned }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listKnowledgecomment} from "@/api/bt10/knowledgecomment";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 知识内容评论与回复表格数据
const knowledgecommentList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        contentId: null,
        userId: null,
        parentId: null,
        content: null,
        likeCount: null,
        isPinned: null,
        bizStatus: null,
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
/** 查询知识内容评论与回复列表 */
function  getList() {
      listKnowledgecomment(queryParams.value).then(response => {
        knowledgecommentList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/knowledgecomment/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/knowledgecomment/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/knowledgecomment/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
