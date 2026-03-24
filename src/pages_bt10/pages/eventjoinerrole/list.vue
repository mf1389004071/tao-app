<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>报名记录ID</uni-th>
        <uni-th>活动角色ID</uni-th>
        <uni-th>分配时间</uni-th>
        <uni-th>确认时间</uni-th>
        <uni-th>状态：已分配/已确认/已拒绝</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventjoinerroleList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.joinId }}</uni-td>
        <uni-td>{{ item.roleId }}</uni-td>
        <uni-td>{{ item.assignedTime }}</uni-td>
        <uni-td>{{ item.confirmedTime }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventjoinerrole} from "@/api/bt10/eventjoinerrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 报名记录与活动角色的分配关系表格数据
const eventjoinerroleList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        joinId: null,
        roleId: null,
        assignedTime: null,
        confirmedTime: null,
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
/** 查询报名记录与活动角色的分配关系列表 */
function  getList() {
      listEventjoinerrole(queryParams.value).then(response => {
        eventjoinerroleList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/eventjoinerrole/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/eventjoinerrole/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/eventjoinerrole/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
