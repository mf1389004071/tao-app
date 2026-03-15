<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>报名记录ID</uni-th>
        <uni-th>场次ID(周期活动时用)</uni-th>
        <uni-th>签到时间</uni-th>
        <uni-th>签到方式：二维码/定位/手动</uni-th>
        <uni-th>签到位置</uni-th>
        <uni-th>操作人ID(手动签到时)</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventcheckinList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.joinId }}</uni-td>
        <uni-td>{{ item.sessionId }}</uni-td>
        <uni-td>{{ item.checkInTime }}</uni-td>
        <uni-td>{{ item.checkInMethod }}</uni-td>
        <uni-td>{{ item.checkInLocation }}</uni-td>
        <uni-td>{{ item.operatorId }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventcheckin} from "@/api/bt10/eventcheckin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 单次签到记录表格数据
const eventcheckinList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        joinId: null,
        sessionId: null,
        checkInTime: null,
        checkInMethod: null,
        checkInLocation: null,
        operatorId: null,
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
/** 查询单次签到记录列表 */
function  getList() {
      listEventcheckin(queryParams.value).then(response => {
        eventcheckinList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/eventcheckin/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/eventcheckin/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/eventcheckin/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
