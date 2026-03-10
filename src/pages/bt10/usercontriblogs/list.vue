<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID(sys_user.user_id)</uni-th>
        <uni-th>类型：充值/购买/退款/奖励等</uni-th>
        <uni-th>本次变动金额</uni-th>
        <uni-th>变动前贡献点余额</uni-th>
        <uni-th>变动后贡献点余额</uni-th>
        <uni-th>说明</uni-th>
        <uni-th>关联业务类型</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>支付单号</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in usercontriblogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.actionType }}</uni-td>
        <uni-td>{{ item.amount }}</uni-td>
        <uni-td>{{ item.balanceBefore }}</uni-td>
        <uni-td>{{ item.balanceAfter }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.paymentNo }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUsercontriblogs} from "@/api/bt10/usercontriblogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户贡献点收支流水表格数据
const usercontriblogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        actionType: null,
        amount: null,
        balanceBefore: null,
        balanceAfter: null,
        relatedType: null,
        relatedId: null,
        paymentNo: null,
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
/** 查询用户贡献点收支流水列表 */
function  getList() {
      listUsercontriblogs(queryParams.value).then(response => {
        usercontriblogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/usercontriblogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/usercontriblogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/usercontriblogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
