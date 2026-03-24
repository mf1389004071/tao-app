<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>所属活动ID</uni-th>
        <uni-th>场次日期</uni-th>
        <uni-th>场次开始时间</uni-th>
        <uni-th>场次结束时间</uni-th>
        <uni-th>状态：已排期/进行中/已结束/已取消</uni-th>
        <uni-th>本场签到人数</uni-th>
        <uni-th>AI生成场次总结</uni-th>
        <uni-th>本场会议链接</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventsessionList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.eventId }}</uni-td>
        <uni-td>{{ item.sessionDate }}</uni-td>
        <uni-td>{{ item.startTime }}</uni-td>
        <uni-td>{{ item.endTime }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.checkInCount }}</uni-td>
        <uni-td>{{ item.summaryText }}</uni-td>
        <uni-td>{{ item.meetingUrl }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventsession} from "@/api/bt10/eventsession";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 周期活动的单场次表格数据
const eventsessionList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        eventId: null,
        sessionDate: null,
        startTime: null,
        endTime: null,
        bizStatus: null,
        checkInCount: null,
        summaryText: null,
        meetingUrl: null,
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
/** 查询周期活动的单场次列表 */
function  getList() {
      listEventsession(queryParams.value).then(response => {
        eventsessionList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/eventsession/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/eventsession/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/eventsession/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
