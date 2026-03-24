<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>类型：获得/消耗/过期/调整等</uni-th>
        <uni-th>积分变动量</uni-th>
        <uni-th>变动前余额</uni-th>
        <uni-th>变动后余额</uni-th>
        <uni-th>原因说明</uni-th>
        <uni-th>关联业务类型</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>操作人ID</uni-th>
        <uni-th>操作人类型</uni-th>
        <uni-th>变更时间</uni-th>
        <uni-th>扩展信息</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in pointchangelogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.changeType }}</uni-td>
        <uni-td>{{ item.pointsChange }}</uni-td>
        <uni-td>{{ item.balanceBefore }}</uni-td>
        <uni-td>{{ item.balanceAfter }}</uni-td>
        <uni-td>{{ item.changeReason }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.operatorId }}</uni-td>
        <uni-td>{{ item.operatorType }}</uni-td>
        <uni-td>{{ item.changedTime }}</uni-td>
        <uni-td>{{ item.metadata }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listPointchangelogs} from "@/api/bt10/pointchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 积分商城商品表格数据
const pointchangelogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        changeType: null,
        pointsChange: null,
        balanceBefore: null,
        balanceAfter: null,
        changeReason: null,
        relatedType: null,
        relatedId: null,
        operatorId: null,
        operatorType: null,
        changedTime: null,
        metadata: null,
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
/** 查询积分变动审计列表 */
function  getList() {
      listPointchangelogs(queryParams.value).then(response => {
        pointchangelogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/pointchangelogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/pointchangelogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/pointchangelogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
