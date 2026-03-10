<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>业务订单号</uni-th>
        <uni-th>下单用户ID</uni-th>
        <uni-th>订单类型：活动/商品/充值等</uni-th>
        <uni-th>关联业务类型</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>订单总金额</uni-th>
        <uni-th>贡献点支付额</uni-th>
        <uni-th>积分支付额</uni-th>
        <uni-th>现金支付额</uni-th>
        <uni-th>支付状态：待付/已付/已退/失败/已取消</uni-th>
        <uni-th>支付方式：微信/支付宝/贡献点/积分等</uni-th>
        <uni-th>第三方支付单号</uni-th>
        <uni-th>支付成功时间</uni-th>
        <uni-th>退款金额</uni-th>
        <uni-th>退款原因</uni-th>
        <uni-th>退款时间</uni-th>
        <uni-th>扩展文本1</uni-th>
        <uni-th>扩展文本2</uni-th>
        <uni-th>扩展文本3</uni-th>
        <uni-th>扩展JSON</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in paymentinfoList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.orderNo }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.orderType }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.totalAmount }}</uni-td>
        <uni-td>{{ item.contribAmount }}</uni-td>
        <uni-td>{{ item.pointsAmount }}</uni-td>
        <uni-td>{{ item.cashAmount }}</uni-td>
        <uni-td>{{ item.paymentStatus }}</uni-td>
        <uni-td>{{ item.paymentMethod }}</uni-td>
        <uni-td>{{ item.paymentNo }}</uni-td>
        <uni-td>{{ item.paidTime }}</uni-td>
        <uni-td>{{ item.refundAmount }}</uni-td>
        <uni-td>{{ item.refundReason }}</uni-td>
        <uni-td>{{ item.refundedTime }}</uni-td>
        <uni-td>{{ item.text1 }}</uni-td>
        <uni-td>{{ item.text2 }}</uni-td>
        <uni-td>{{ item.text3 }}</uni-td>
        <uni-td>{{ item.jsonData }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listPaymentinfo} from "@/api/bt10/paymentinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 统一支付订单表格数据
const paymentinfoList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        userId: null,
        orderType: null,
        relatedType: null,
        relatedId: null,
        totalAmount: null,
        contribAmount: null,
        pointsAmount: null,
        cashAmount: null,
        paymentStatus: null,
        paymentMethod: null,
        paymentNo: null,
        paidTime: null,
        refundAmount: null,
        refundReason: null,
        refundedTime: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
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
/** 查询统一支付订单列表 */
function  getList() {
      listPaymentinfo(queryParams.value).then(response => {
        paymentinfoList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/paymentinfo/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/paymentinfo/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/paymentinfo/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
