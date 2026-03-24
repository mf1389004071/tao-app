<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>关联活动ID</uni-th>
        <uni-th>关联场次ID</uni-th>
        <uni-th>原始音视频文件ID</uni-th>
        <uni-th>转写JSON(时间戳与说话人)</uni-th>
        <uni-th>完整文本</uni-th>
        <uni-th>AI摘要</uni-th>
        <uni-th>关键点</uni-th>
        <uni-th>行动清单</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in aimeetingtranscriptsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.eventId }}</uni-td>
        <uni-td>{{ item.sessionId }}</uni-td>
        <uni-td>{{ item.fileId }}</uni-td>
        <uni-td>{{ item.transcriptJson }}</uni-td>
        <uni-td>{{ item.fullText }}</uni-td>
        <uni-td>{{ item.summary }}</uni-td>
        <uni-td>{{ item.keyPoints }}</uni-td>
        <uni-td>{{ item.actionItems }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listAimeetingtranscripts} from "@/api/bt10/aimeetingtranscripts";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 音视频转写与AI摘要表格数据
const aimeetingtranscriptsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        eventId: null,
        sessionId: null,
        fileId: null,
        transcriptJson: null,
        fullText: null,
        summary: null,
        keyPoints: null,
        actionItems: null,
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
/** 查询音视频转写与AI摘要列表 */
function  getList() {
      listAimeetingtranscripts(queryParams.value).then(response => {
        aimeetingtranscriptsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/aimeetingtranscripts/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/aimeetingtranscripts/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/aimeetingtranscripts/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
