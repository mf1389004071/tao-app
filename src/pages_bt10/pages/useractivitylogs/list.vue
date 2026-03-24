<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>发生时间</uni-th>
        <uni-th>IP 地址</uni-th>
        <uni-th>终端设备信息</uni-th>
        <uni-th>事件类型：LOGIN/LOGOUT/SIGNIN/LIKE/COMMENT/SHARE/REGISTER_EVENT等</uni-th>
        <uni-th>事件来源业务类型：EVENT/CONTENT/USER等</uni-th>
        <uni-th>事件来源业务ID</uni-th>
        <uni-th>事件标签列表(JSON)</uni-th>
        <uni-th>本次积分变化(可为空，无变更为NULL)</uni-th>
        <uni-th>变更前积分余额</uni-th>
        <uni-th>变更后积分余额</uni-th>
        <uni-th>本次贡献点变化</uni-th>
        <uni-th>变更前贡献点余额</uni-th>
        <uni-th>变更后贡献点余额</uni-th>
        <uni-th>额外上下文(如停留时长、入口渠道等)</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in useractivitylogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.occurredTime }}</uni-td>
        <uni-td>{{ item.ipAddress }}</uni-td>
        <uni-td>{{ item.device }}</uni-td>
        <uni-td>{{ item.eventType }}</uni-td>
        <uni-td>{{ item.eventSourceType }}</uni-td>
        <uni-td>{{ item.eventSourceId }}</uni-td>
        <uni-td>{{ item.eventTags }}</uni-td>
        <uni-td>{{ item.pointChange }}</uni-td>
        <uni-td>{{ item.pointBalanceBefore }}</uni-td>
        <uni-td>{{ item.pointBalanceAfter }}</uni-td>
        <uni-td>{{ item.contribChange }}</uni-td>
        <uni-td>{{ item.contribBalanceBefore }}</uni-td>
        <uni-td>{{ item.contribBalanceAfter }}</uni-td>
        <uni-td>{{ item.extra }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUseractivitylogs} from "@/api/bt10/useractivitylogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户行为轨迹日志表格数据
const useractivitylogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        occurredTime: null,
        ipAddress: null,
        device: null,
        eventType: null,
        eventSourceType: null,
        eventSourceId: null,
        eventTags: null,
        pointChange: null,
        pointBalanceBefore: null,
        pointBalanceAfter: null,
        contribChange: null,
        contribBalanceBefore: null,
        contribBalanceAfter: null,
        extra: null,
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
/** 查询用户行为轨迹日志列表 */
function  getList() {
      listUseractivitylogs(queryParams.value).then(response => {
        useractivitylogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/useractivitylogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/useractivitylogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/useractivitylogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
