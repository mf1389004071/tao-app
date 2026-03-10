<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>被邀请人用户ID(sys_user.user_id)</uni-th>
        <uni-th>邀请人用户ID</uni-th>
        <uni-th>使用的邀请码</uni-th>
        <uni-th>被邀请时间</uni-th>
        <uni-th>状态：待处理/已接受/已发奖</uni-th>
        <uni-th>邀请人是否已领取奖励</uni-th>
        <uni-th>邀请奖励积分</uni-th>
        <uni-th>邀请奖励贡献点</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in userinviteList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.inviterId }}</uni-td>
        <uni-td>{{ item.inviteCode }}</uni-td>
        <uni-td>{{ item.inviteTime }}</uni-td>
        <uni-td>{{ item.rewardStatus }}</uni-td>
        <uni-td>{{ item.rewardClaimed }}</uni-td>
        <uni-td>{{ item.rewardPoints }}</uni-td>
        <uni-td>{{ item.rewardContrib }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUserinvite} from "@/api/bt10/userinvite";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 邀请关系与奖励记录表格数据
const userinviteList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        inviterId: null,
        inviteCode: null,
        inviteTime: null,
        rewardStatus: null,
        rewardClaimed: null,
        rewardPoints: null,
        rewardContrib: null,
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
/** 查询邀请关系与奖励记录列表 */
function  getList() {
      listUserinvite(queryParams.value).then(response => {
        userinviteList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/userinvite/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/userinvite/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/userinvite/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
