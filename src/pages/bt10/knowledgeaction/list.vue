<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>知识内容ID</uni-th>
        <uni-th>类型：点赞/反对/收藏/分享等</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in knowledgeactionList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.contentId }}</uni-td>
        <uni-td>{{ item.actionType }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listKnowledgeaction} from "@/api/bt10/knowledgeaction";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户对知识内容的行为记录表格数据
const knowledgeactionList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        contentId: null,
        actionType: null,
        userId: null,
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
/** 查询用户对知识内容的行为记录列表 */
function  getList() {
      listKnowledgeaction(queryParams.value).then(response => {
        knowledgeactionList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/knowledgeaction/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/knowledgeaction/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/knowledgeaction/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
