<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>接收用户ID</uni-th>
        <uni-th>标题</uni-th>
        <uni-th>正文</uni-th>
        <uni-th>类型：系统/互动/订阅等</uni-th>
        <uni-th>关联业务类型</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>是否已读</uni-th>
        <uni-th>阅读时间</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in notificationsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.title }}</uni-td>
        <uni-td>{{ item.content }}</uni-td>
        <uni-td>{{ item.notificationType }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.isRead }}</uni-td>
        <uni-td>{{ item.readTime }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listNotifications} from "@/api/bt10/notifications";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户站内通知表格数据
const notificationsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        title: null,
        content: null,
        notificationType: null,
        relatedType: null,
        relatedId: null,
        isRead: null,
        readTime: null,
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
/** 查询用户站内通知列表 */
function  getList() {
      listNotifications(queryParams.value).then(response => {
        notificationsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/notifications/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/notifications/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/notifications/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
