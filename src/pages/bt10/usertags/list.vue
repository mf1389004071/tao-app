<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>标签ID</uni-th>
        <uni-th>权重(0-1或0-100，越大代表相关性越高)</uni-th>
        <uni-th>来源：SYSTEM/SELF/COACH等</uni-th>
        <uni-th>备注/说明</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in usertagsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.tagId }}</uni-td>
        <uni-td>{{ item.weight }}</uni-td>
        <uni-td>{{ item.source }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUsertags} from "@/api/bt10/usertags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户与多维标签关联表表格数据
const usertagsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        tagId: null,
        weight: null,
        source: null,
        status: null
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询用户与多维标签关联表列表 */
function  getList() {
      listUsertags(queryParams.value).then(response => {
        usertagsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/usertags/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/usertags/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/usertags/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
