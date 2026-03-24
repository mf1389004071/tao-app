<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID(sys_user.user_id)</uni-th>
        <uni-th>原阶段</uni-th>
        <uni-th>新阶段</uni-th>
        <uni-th>触发方式：自动/手动/任务完成等</uni-th>
        <uni-th>触发上下文数据</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in usergrowthList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.stageFrom }}</uni-td>
        <uni-td>{{ item.stageTo }}</uni-td>
        <uni-td>{{ item.triggerType }}</uni-td>
        <uni-td>{{ item.triggerData }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUsergrowth} from "@/api/bt10/usergrowth";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户成长阶段变更历史表格数据
const usergrowthList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        stageFrom: null,
        stageTo: null,
        triggerType: null,
        triggerData: null,
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
/** 查询用户成长阶段变更历史列表 */
function  getList() {
      listUsergrowth(queryParams.value).then(response => {
        usergrowthList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/usergrowth/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/usergrowth/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/usergrowth/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
