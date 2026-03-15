<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>活动ID</uni-th>
        <uni-th>报名用户ID</uni-th>
        <uni-th>状态：已确认/已取消/已签到/缺席</uni-th>
        <uni-th>报名表单填写数据</uni-th>
        <uni-th>支付状态：待付/已付/已退/失败/已取消</uni-th>
        <uni-th>支付金额</uni-th>
        <uni-th>支付方式：贡献点/积分/混合/现金等</uni-th>
        <uni-th>支付单号</uni-th>
        <uni-th>签到时间</uni-th>
        <uni-th>签到方式：二维码/定位/手动</uni-th>
        <uni-th>签到位置信息</uni-th>
        <uni-th>转化状态：无/有意向/已转化</uni-th>
        <uni-th>转化产品ID</uni-th>
        <uni-th>转化金额</uni-th>
        <uni-th>转化备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventjoinList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.eventId }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.joinForm }}</uni-td>
        <uni-td>{{ item.paymentStatus }}</uni-td>
        <uni-td>{{ item.paymentAmount }}</uni-td>
        <uni-td>{{ item.paymentMethod }}</uni-td>
        <uni-td>{{ item.paymentNo }}</uni-td>
        <uni-td>{{ item.checkedInTime }}</uni-td>
        <uni-td>{{ item.checkInMethod }}</uni-td>
        <uni-td>{{ item.checkInLocation }}</uni-td>
        <uni-td>{{ item.conversionStatus }}</uni-td>
        <uni-td>{{ item.conversionProductId }}</uni-td>
        <uni-td>{{ item.conversionAmount }}</uni-td>
        <uni-td>{{ item.conversionNotes }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventjoin} from "@/api/bt10/eventjoin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户活动报名记录表格数据
const eventjoinList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        eventId: null,
        userId: null,
        bizStatus: null,
        joinForm: null,
        paymentStatus: null,
        paymentAmount: null,
        paymentMethod: null,
        paymentNo: null,
        checkedInTime: null,
        checkInMethod: null,
        checkInLocation: null,
        conversionStatus: null,
        conversionProductId: null,
        conversionAmount: null,
        conversionNotes: null,
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
/** 查询用户活动报名记录列表 */
function  getList() {
      listEventjoin(queryParams.value).then(response => {
        eventjoinList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/eventjoin/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/eventjoin/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/eventjoin/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
