<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>被变更表名</uni-th>
        <uni-th>被变更记录ID</uni-th>
        <uni-th>变更类型：新增/更新/删除</uni-th>
        <uni-th>变更字段(更新时)</uni-th>
        <uni-th>旧值</uni-th>
        <uni-th>新值</uni-th>
        <uni-th>变更原因</uni-th>
        <uni-th>操作人用户ID</uni-th>
        <uni-th>操作人类型：用户/系统/管理员</uni-th>
        <uni-th>操作IP</uni-th>
        <uni-th>UA</uni-th>
        <uni-th>变更时间</uni-th>
        <uni-th>扩展元数据</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in datachangelogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.tableName }}</uni-td>
        <uni-td>{{ item.recordId }}</uni-td>
        <uni-td>{{ item.changeType }}</uni-td>
        <uni-td>{{ item.fieldName }}</uni-td>
        <uni-td>{{ item.oldValue }}</uni-td>
        <uni-td>{{ item.newValue }}</uni-td>
        <uni-td>{{ item.changeReason }}</uni-td>
        <uni-td>{{ item.operatorId }}</uni-td>
        <uni-td>{{ item.operatorType }}</uni-td>
        <uni-td>{{ item.ipAddress }}</uni-td>
        <uni-td>{{ item.userAgent }}</uni-td>
        <uni-td>{{ item.changedTime }}</uni-td>
        <uni-td>{{ item.metadata }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listDatachangelogs} from "@/api/bt10/datachangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 通用业务数据变更审计表格数据
const datachangelogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        tableName: null,
        recordId: null,
        changeType: null,
        fieldName: null,
        oldValue: null,
        newValue: null,
        changeReason: null,
        operatorId: null,
        operatorType: null,
        ipAddress: null,
        userAgent: null,
        changedTime: null,
        metadata: null,
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询通用业务数据变更审计列表 */
function  getList() {
      listDatachangelogs(queryParams.value).then(response => {
        datachangelogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/datachangelogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/datachangelogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/datachangelogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
