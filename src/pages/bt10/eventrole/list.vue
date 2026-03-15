<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>活动ID</uni-th>
        <uni-th>角色名：天使/主持人/PM/助教/签到/主讲等</uni-th>
        <uni-th>角色说明</uni-th>
        <uni-th>该角色最大人数</uni-th>
        <uni-th>当前已分配人数</uni-th>
        <uni-th>角色权限配置</uni-th>
        <uni-th>担任该角色奖励积分</uni-th>
        <uni-th>担任该角色奖励贡献点</uni-th>
        <uni-th>职责说明</uni-th>
        <uni-th>任职要求</uni-th>
        <uni-th>排序</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventroleList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.eventId }}</uni-td>
        <uni-td>{{ item.roleName }}</uni-td>
        <uni-td>{{ item.roleDescription }}</uni-td>
        <uni-td>{{ item.maxParticipants }}</uni-td>
        <uni-td>{{ item.currentParticipants }}</uni-td>
        <uni-td>{{ item.permissions }}</uni-td>
        <uni-td>{{ item.pointsReward }}</uni-td>
        <uni-td>{{ item.contribReward }}</uni-td>
        <uni-td>{{ item.responsibilities }}</uni-td>
        <uni-td>{{ item.requirements }}</uni-td>
        <uni-td>{{ item.orderNum }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventrole} from "@/api/bt10/eventrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 活动所需角色表格数据
const eventroleList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        eventId: null,
        roleName: null,
        roleDescription: null,
        maxParticipants: null,
        currentParticipants: null,
        permissions: null,
        pointsReward: null,
        contribReward: null,
        responsibilities: null,
        requirements: null,
        orderNum: null,
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
/** 查询活动所需角色列表 */
function  getList() {
      listEventrole(queryParams.value).then(response => {
        eventroleList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/eventrole/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/eventrole/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/eventrole/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
