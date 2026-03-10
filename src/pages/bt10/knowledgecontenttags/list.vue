<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>知识内容ID</uni-th>
        <uni-th>标签ID</uni-th>
        <uni-th>排序</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in knowledgecontenttagsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.contentId }}</uni-td>
        <uni-td>{{ item.tagId }}</uni-td>
        <uni-td>{{ item.orderNum }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listKnowledgecontenttags} from "@/api/bt10/knowledgecontenttags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 知识内容与标签多对多关联表格数据
const knowledgecontenttagsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        contentId: null,
        tagId: null,
        orderNum: null,
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询知识内容与标签多对多关联列表 */
function  getList() {
      listKnowledgecontenttags(queryParams.value).then(response => {
        knowledgecontenttagsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/knowledgecontenttags/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/knowledgecontenttags/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/knowledgecontenttags/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
