<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>标题</uni-th>
        <uni-th>正文</uni-th>
        <uni-th>类型：system等</uni-th>
        <uni-th>是否紧急</uni-th>
        <uni-th>发布时间</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in noticesList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.title }}</uni-td>
        <uni-td>{{ item.content }}</uni-td>
        <uni-td>{{ item.type }}</uni-td>
        <uni-td>{{ item.isUrgent }}</uni-td>
        <uni-td>{{ item.publishTime }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listNotices} from "@/api/bt10/notices";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 系统级通知与公告表格数据
const noticesList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        title: null,
        content: null,
        type: null,
        isUrgent: null,
        publishTime: null,
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
/** 查询系统级通知与公告列表 */
function  getList() {
      listNotices(queryParams.value).then(response => {
        noticesList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/notices/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/notices/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/notices/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
