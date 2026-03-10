<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID(sys_user.user_id)</uni-th>
        <uni-th>行为类型：签到/发内容/邀请等</uni-th>
        <uni-th>本次变动积分(正获得负消耗)</uni-th>
        <uni-th>变动前积分余额</uni-th>
        <uni-th>变动后积分余额</uni-th>
        <uni-th>关联业务类型如EVENT/CONTENT</uni-th>
        <uni-th>关联业务主键</uni-th>
        <uni-th>该笔积分过期时间</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in userpointlogsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.actionType }}</uni-td>
        <uni-td>{{ item.points }}</uni-td>
        <uni-td>{{ item.balanceBefore }}</uni-td>
        <uni-td>{{ item.balanceAfter }}</uni-td>
        <uni-td>{{ item.relatedType }}</uni-td>
        <uni-td>{{ item.relatedId }}</uni-td>
        <uni-td>{{ item.expiredTime }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUserpointlogs} from "@/api/bt10/userpointlogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户积分收支流水表格数据
const userpointlogsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        actionType: null,
        points: null,
        balanceBefore: null,
        balanceAfter: null,
        relatedType: null,
        relatedId: null,
        expiredTime: null,
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
/** 查询用户积分收支流水列表 */
function  getList() {
      listUserpointlogs(queryParams.value).then(response => {
        userpointlogsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/userpointlogs/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/userpointlogs/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/userpointlogs/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
