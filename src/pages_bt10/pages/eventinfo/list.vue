<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>活动标题</uni-th>
        <uni-th>参与方式：线上/线下/混合</uni-th>
        <uni-th>活动分类</uni-th>
        <uni-th>开始时间</uni-th>
        <uni-th>结束时间</uni-th>
        <uni-th>报名截止时间</uni-th>
        <uni-th>最大参与人数</uni-th>
        <uni-th>已报名人数</uni-th>
        <uni-th>已签到人数</uni-th>
        <uni-th>乐观锁版本号</uni-th>
        <uni-th>地点简述</uni-th>
        <uni-th>会议/直播链接</uni-th>
        <uni-th>详细地址</uni-th>
        <uni-th>城市</uni-th>
        <uni-th>封面图</uni-th>
        <uni-th>列表图</uni-th>
        <uni-th>详情图</uni-th>
        <uni-th>海报图</uni-th>
        <uni-th>状态：草稿/已发布/报名中/已满/进行中/已结束/已取消</uni-th>
        <uni-th>是否公开可见</uni-th>
        <uni-th>参与奖励积分</uni-th>
        <uni-th>RRule周期规则</uni-th>
        <uni-th>是否周期活动</uni-th>
        <uni-th>父活动ID(周期活动)</uni-th>
        <uni-th>活动价格</uni-th>
        <uni-th>活动类型</uni-th>
        <uni-th>目标学员画像</uni-th>
        <uni-th>学习目标</uni-th>
        <uni-th>活动结构</uni-th>
        <uni-th>活动内容大纲</uni-th>
        <uni-th>转化策略</uni-th>
        <uni-th>跟进计划</uni-th>
        <uni-th>风险管理</uni-th>
        <uni-th>活动标签</uni-th>
        <uni-th>主办方</uni-th>
        <uni-th>联系方式</uni-th>
        <uni-th>负责人ID</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in eventinfoList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.title }}</uni-td>
        <uni-td>{{ item.joinType }}</uni-td>
        <uni-td>{{ item.category }}</uni-td>
        <uni-td>{{ item.startTime }}</uni-td>
        <uni-td>{{ item.endTime }}</uni-td>
        <uni-td>{{ item.joinDeadline }}</uni-td>
        <uni-td>{{ item.maxParticipants }}</uni-td>
        <uni-td>{{ item.registeredCount }}</uni-td>
        <uni-td>{{ item.checkedInCount }}</uni-td>
        <uni-td>{{ item.version }}</uni-td>
        <uni-td>{{ item.location }}</uni-td>
        <uni-td>{{ item.meetingUrl }}</uni-td>
        <uni-td>{{ item.address }}</uni-td>
        <uni-td>{{ item.city }}</uni-td>
        <uni-td>{{ item.coverImageUrl }}</uni-td>
        <uni-td>{{ item.listImageUrl }}</uni-td>
        <uni-td>{{ item.detailImageUrl }}</uni-td>
        <uni-td>{{ item.posterImageUrl }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.isPublic }}</uni-td>
        <uni-td>{{ item.basePointsReward }}</uni-td>
        <uni-td>{{ item.recurrenceRule }}</uni-td>
        <uni-td>{{ item.isRecurring }}</uni-td>
        <uni-td>{{ item.parentEventId }}</uni-td>
        <uni-td>{{ item.eventPrice }}</uni-td>
        <uni-td>{{ item.eventType }}</uni-td>
        <uni-td>{{ item.targetAudience }}</uni-td>
        <uni-td>{{ item.learningObjectives }}</uni-td>
        <uni-td>{{ item.eventStructure }}</uni-td>
        <uni-td>{{ item.curriculum }}</uni-td>
        <uni-td>{{ item.conversionStrategy }}</uni-td>
        <uni-td>{{ item.followUpPlan }}</uni-td>
        <uni-td>{{ item.riskManagement }}</uni-td>
        <uni-td>{{ item.eventTags }}</uni-td>
        <uni-td>{{ item.organizer }}</uni-td>
        <uni-td>{{ item.contact }}</uni-td>
        <uni-td>{{ item.pmUserId }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listEventinfo} from "@/api/bt10/eventinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 活动或线下课程主表表格数据
const eventinfoList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        title: null,
        joinType: null,
        category: null,
        startTime: null,
        endTime: null,
        joinDeadline: null,
        maxParticipants: null,
        registeredCount: null,
        checkedInCount: null,
        version: null,
        location: null,
        meetingUrl: null,
        address: null,
        city: null,
        coverImageUrl: null,
        listImageUrl: null,
        detailImageUrl: null,
        posterImageUrl: null,
        bizStatus: null,
        isPublic: null,
        basePointsReward: null,
        recurrenceRule: null,
        isRecurring: null,
        parentEventId: null,
        eventPrice: null,
        eventType: null,
        targetAudience: null,
        learningObjectives: null,
        eventStructure: null,
        curriculum: null,
        conversionStrategy: null,
        followUpPlan: null,
        riskManagement: null,
        eventTags: null,
        organizer: null,
        contact: null,
        pmUserId: null,
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
/** 查询活动或线下课程主表列表 */
function  getList() {
      listEventinfo(queryParams.value).then(response => {
        eventinfoList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/eventinfo/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/eventinfo/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/eventinfo/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
