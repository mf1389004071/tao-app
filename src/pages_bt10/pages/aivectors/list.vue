<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
        <uni-th>${comment}</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in aivectorsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.contentChunk }}</uni-td>
        <uni-td>{{ item.embedding }}</uni-td>
        <uni-td>{{ item.metadata }}</uni-td>
        <uni-td>{{ item.sourceType }}</uni-td>
        <uni-td>{{ item.sourceId }}</uni-td>
        <uni-td>{{ item.createdAt }}</uni-td>
        <uni-td>{{ item.updatedAt }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listAivectors} from "@/api/bt10/aivectors";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// AI向量表格数据
const aivectorsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        contentChunk: null,
        embedding: null,
        metadata: null,
        sourceType: null,
        sourceId: null,
        createdAt: null,
        updatedAt: null
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询AI向量列表 */
function  getList() {
      listAivectors(queryParams.value).then(response => {
        aivectorsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/aivectors/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/aivectors/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/aivectors/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
