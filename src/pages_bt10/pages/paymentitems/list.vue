<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>支付订单ID</uni-th>
        <uni-th>明细类型：PRODUCT/SERVICE/COUPON/IDENTITY等</uni-th>
        <uni-th>明细名称(商品/服务/身份等)</uni-th>
        <uni-th>原价(单价)</uni-th>
        <uni-th>实际计价金额(单价，可为0表示赠送)</uni-th>
        <uni-th>数量</uni-th>
        <uni-th>是否赠品</uni-th>
        <uni-th>是否可转让</uni-th>
        <uni-th>是否可帮买(代他人购买)</uni-th>
        <uni-th>使用状态：PENDING/USED/EXPIRED/CANCELLED</uni-th>
        <uni-th>发放方式：AUTO/MANUAL/COUPON等</uni-th>
        <uni-th>关联业务类型：EVENT/COURSE/IDENTITY/POINT_PRODUCT等</uni-th>
        <uni-th>关联业务ID</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in paymentitemsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.paymentId }}</uni-td>
        <uni-td>{{ item.itemType }}</uni-td>
        <uni-td>{{ item.itemName }}</uni-td>
        <uni-td>{{ item.originalAmount }}</uni-td>
        <uni-td>{{ item.amount }}</uni-td>
        <uni-td>{{ item.quantity }}</uni-td>
        <uni-td>{{ item.isGift }}</uni-td>
        <uni-td>{{ item.isTransferable }}</uni-td>
        <uni-td>{{ item.canBuyForOthers }}</uni-td>
        <uni-td>{{ item.usageStatus }}</uni-td>
        <uni-td>{{ item.grantMethod }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listPaymentitems} from "@/api/bt10/paymentitems";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 统一支付订单明细表表格数据
const paymentitemsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        paymentId: null,
        itemType: null,
        itemName: null,
        originalAmount: null,
        amount: null,
        quantity: null,
        isGift: null,
        isTransferable: null,
        canBuyForOthers: null,
        usageStatus: null,
        grantMethod: null,
        relatedType: null,
        relatedId: null,
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
/** 查询统一支付订单明细表列表 */
function  getList() {
      listPaymentitems(queryParams.value).then(response => {
        paymentitemsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/paymentitems/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/paymentitems/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/paymentitems/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
