<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>任务类型：转写/摘要/向量化/对话等</uni-th>
        <uni-th>状态：待处理/处理中/完成/失败/已取消</uni-th>
        <uni-th>优先级1-10</uni-th>
        <uni-th>关联业务类型</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>任务配置</uni-th>
        <uni-th>任务结果</uni-th>
        <uni-th>进度0-100</uni-th>
        <uni-th>失败原因</uni-th>
        <uni-th>费用</uni-th>
        <uni-th>消耗token数</uni-th>
        <uni-th>使用模型</uni-th>
        <uni-th>开始时间</uni-th>
        <uni-th>完成时间</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in aitasksList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.taskType }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.priority }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.config }}</uni-td>
        <uni-td>{{ item.result }}</uni-td>
        <uni-td>{{ item.progressPercentage }}</uni-td>
        <uni-td>{{ item.errorMessage }}</uni-td>
        <uni-td>{{ item.costAmount }}</uni-td>
        <uni-td>{{ item.tokensUsed }}</uni-td>
        <uni-td>{{ item.modelUsed }}</uni-td>
        <uni-td>{{ item.startTime }}</uni-td>
        <uni-td>{{ item.completeTime }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listAitasks} from "@/api/bt10/aitasks";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// AI异步任务表格数据
const aitasksList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        taskType: null,
        bizStatus: null,
        priority: null,
        relatedType: null,
        relatedId: null,
        config: null,
        result: null,
        progressPercentage: null,
        errorMessage: null,
        costAmount: null,
        tokensUsed: null,
        modelUsed: null,
        startTime: null,
        completeTime: null,
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
/** 查询AI异步任务列表 */
function  getList() {
      listAitasks(queryParams.value).then(response => {
        aitasksList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/aitasks/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/aitasks/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/aitasks/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
