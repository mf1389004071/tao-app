<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>活动ID</uni-th>
        <uni-th>变更字段名</uni-th>
        <uni-th>旧值</uni-th>
        <uni-th>新值</uni-th>
        <uni-th>变更原因</uni-th>
        <uni-th>操作人ID</uni-th>
        <uni-th>操作人类型</uni-th>
        <uni-th>变更时间</uni-th>
        <uni-th>扩展信息</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventchangelogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.eventId }}</uni-td>
        <uni-td>{{ item.changeField }}</uni-td>
        <uni-td>{{ item.oldValue }}</uni-td>
        <uni-td>{{ item.newValue }}</uni-td>
        <uni-td>{{ item.changeReason }}</uni-td>
        <uni-td>{{ item.operatorId }}</uni-td>
        <uni-td>{{ item.operatorType }}</uni-td>
        <uni-td>{{ item.changedTime }}</uni-td>
        <uni-td>{{ item.metadata }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventchangelogs} from "@/api/bt10/eventchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 活动关键信息变更记录表格数据
const eventchangelogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        eventId: null,
        changeField: null,
        oldValue: null,
        newValue: null,
        changeReason: null,
        operatorId: null,
        operatorType: null,
        changedTime: null,
        metadata: null,
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
/** 查询活动关键信息变更记录列表 */
function  getList() {
      listEventchangelogs(queryParams.value).then(response => {
        eventchangelogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/eventchangelogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/eventchangelogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/eventchangelogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
