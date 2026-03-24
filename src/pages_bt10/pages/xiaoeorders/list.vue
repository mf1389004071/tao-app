<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>小鹅通订单号</uni-th>
        <uni-th>关联本平台用户ID</uni-th>
        <uni-th>小鹅通订单状态</uni-th>
        <uni-th>实际支付金额</uni-th>
        <uni-th>商品名称</uni-th>
        <uni-th>商品类型</uni-th>
        <uni-th>SPU类型</uni-th>
        <uni-th>支付状态</uni-th>
        <uni-th>支付方式</uni-th>
        <uni-th>第三方交易号</uni-th>
        <uni-th>小鹅通侧创建时间</uni-th>
        <uni-th>学员信息快照</uni-th>
        <uni-th>发票信息</uni-th>
        <uni-th>同步状态：待同步/已同步/失败</uni-th>
        <uni-th>最近同步时间</uni-th>
        <uni-th>本地订单号</uni-th>
        <uni-th>处理状态</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in xiaoeordersList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.xiaoeOrderNo }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.orderState }}</uni-td>
        <uni-td>{{ item.actualFee }}</uni-td>
        <uni-td>{{ item.goodsName }}</uni-td>
        <uni-td>{{ item.goodsType }}</uni-td>
        <uni-td>{{ item.spuType }}</uni-td>
        <uni-td>{{ item.payState }}</uni-td>
        <uni-td>{{ item.payType }}</uni-td>
        <uni-td>{{ item.tradeNo }}</uni-td>
        <uni-td>{{ item.xiaoeCreateTime }}</uni-td>
        <uni-td>{{ item.studentInfo }}</uni-td>
        <uni-td>{{ item.invoiceInfo }}</uni-td>
        <uni-td>{{ item.syncStatus }}</uni-td>
        <uni-td>{{ item.lastSyncTime }}</uni-td>
        <uni-td>{{ item.orderNo }}</uni-td>
        <uni-td>{{ item.processStatus }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listXiaoeorders} from "@/api/bt10/xiaoeorders";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 小鹅通订单同步表表格数据
const xiaoeordersList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        xiaoeOrderNo: null,
        userId: null,
        orderState: null,
        actualFee: null,
        goodsName: null,
        goodsType: null,
        spuType: null,
        payState: null,
        payType: null,
        tradeNo: null,
        xiaoeCreateTime: null,
        studentInfo: null,
        invoiceInfo: null,
        syncStatus: null,
        lastSyncTime: null,
        orderNo: null,
        processStatus: null,
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
/** 查询小鹅通订单同步表列表 */
function  getList() {
      listXiaoeorders(queryParams.value).then(response => {
        xiaoeordersList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/xiaoeorders/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/xiaoeorders/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/xiaoeorders/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
