<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="活动标题" prop="title">
          <uni-easyinput v-model="form.title" placeholder="请输入活动标题" />
        </uni-forms-item>
        <uni-forms-item label="活动分类" prop="category">
          <uni-easyinput v-model="form.category" placeholder="请输入活动分类" />
        </uni-forms-item>
        <uni-forms-item label="开始时间" prop="startTime">
          <uni-datetime-picker type="datetime" v-model="form.startTime"/>
        </uni-forms-item>
        <uni-forms-item label="结束时间" prop="endTime">
          <uni-datetime-picker type="datetime" v-model="form.endTime"/>
        </uni-forms-item>
        <uni-forms-item label="报名截止时间" prop="joinDeadline">
          <uni-datetime-picker type="datetime" v-model="form.joinDeadline"/>
        </uni-forms-item>
        <uni-forms-item label="最大参与人数" prop="maxParticipants">
          <uni-easyinput v-model="form.maxParticipants" placeholder="请输入最大参与人数" />
        </uni-forms-item>
        <uni-forms-item label="已报名人数" prop="registeredCount">
          <uni-easyinput v-model="form.registeredCount" placeholder="请输入已报名人数" />
        </uni-forms-item>
        <uni-forms-item label="已签到人数" prop="checkedInCount">
          <uni-easyinput v-model="form.checkedInCount" placeholder="请输入已签到人数" />
        </uni-forms-item>
        <uni-forms-item label="乐观锁版本号" prop="version">
          <uni-easyinput v-model="form.version" placeholder="请输入乐观锁版本号" />
        </uni-forms-item>
        <uni-forms-item label="地点简述" prop="location">
          <uni-easyinput v-model="form.location" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="会议/直播链接" prop="meetingUrl">
          <uni-easyinput v-model="form.meetingUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="详细地址" prop="address">
          <uni-easyinput v-model="form.address" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="城市" prop="city">
          <uni-easyinput v-model="cityText" placeholder="请选择省/市/区" disabled @click="openCitySelect" />
        </uni-forms-item>
        <uni-forms-item label="封面图" prop="coverImageUrl">
          <uni-easyinput v-model="form.coverImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="列表图" prop="listImageUrl">
          <uni-easyinput v-model="form.listImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="详情图" prop="detailImageUrl">
          <uni-easyinput v-model="form.detailImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="海报图" prop="posterImageUrl">
          <uni-easyinput v-model="form.posterImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="参与奖励积分" prop="basePointsReward">
          <uni-easyinput v-model="form.basePointsReward" placeholder="请输入参与奖励积分" />
        </uni-forms-item>
        <uni-forms-item label="RRule周期规则" prop="recurrenceRule">
          <uni-easyinput v-model="form.recurrenceRule" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="父活动ID(周期活动)" prop="parentEventId">
          <uni-easyinput v-model="form.parentEventId" placeholder="请输入父活动ID(周期活动)" />
        </uni-forms-item>
        <uni-forms-item label="活动价格" prop="eventPrice">
          <uni-easyinput v-model="form.eventPrice" placeholder="请输入活动价格" />
        </uni-forms-item>
        <uni-forms-item label="目标学员画像" prop="targetAudience">
          <uni-easyinput v-model="form.targetAudience" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="学习目标" prop="learningObjectives">
          <uni-easyinput v-model="form.learningObjectives" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="转化策略" prop="conversionStrategy">
          <uni-easyinput v-model="form.conversionStrategy" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="跟进计划" prop="followUpPlan">
          <uni-easyinput v-model="form.followUpPlan" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="风险管理" prop="riskManagement">
          <uni-easyinput v-model="form.riskManagement" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="活动标签" prop="eventTags">
          <uni-easyinput v-model="form.eventTags" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="主办方" prop="organizer">
          <uni-easyinput v-model="form.organizer" placeholder="请输入主办方" />
        </uni-forms-item>
        <uni-forms-item label="联系方式" prop="contact">
          <uni-easyinput v-model="form.contact" placeholder="请输入联系方式" />
        </uni-forms-item>
        <uni-forms-item label="负责人ID" prop="pmUserId">
          <uni-easyinput v-model="form.pmUserId" placeholder="请输入负责人ID" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
      <city-select
        v-model="citySelectVisible"
        :areaCode="parseCityCode(form.city)"
        @city-change="handleCityChange"
      />
  </view>
</template>

<script setup>
import { getEventinfo, delEventinfo, addEventinfo, updateEventinfo } from "@/api/bt10/eventinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";
import citySelect from "@/pages_template/components/u-city-select/u-city-select.vue";

// 表单参数
const eventinfo = ref({
        id: null,
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
        isPublic: [],
        basePointsReward: null,
        recurrenceRule: null,
        isRecurring: [],
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
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
        createId: null,
        createBy: null,
        createTime: null,
        updateId: null,
        updateBy: null,
        updateTime: null,
        deleteId: null,
        deleteTime: null,
        status: null,
        delFlag: null,
        remark: null
      })
const form = eventinfo;
const rules = ref({});
const citySelectVisible = ref(false);
const cityText = ref("");

function parseCityCode(city) {
  const parts = String(city || "").split(",").map(s => String(s).trim()).filter(Boolean);
  return parts.length === 3 ? parts : [];
}

function formatCityTextByCode(codes) {
  if (!Array.isArray(codes) || codes.length !== 3) return "";
  return `${codes[0]}-${codes[1]}-${codes[2]}`;
}

function openCitySelect() {
  citySelectVisible.value = true;
}

function handleCityChange(e) {
  const provinceCode = e?.province?.value ? String(e.province.value) : "";
  const cityCode = e?.city?.value ? String(e.city.value) : "";
  const areaCode = e?.area?.value ? String(e.area.value) : "";
  const codeList = [provinceCode, cityCode, areaCode].filter(Boolean);
  eventinfo.value.city = codeList.length ? codeList.join(",") : null;
  cityText.value = codeList.length ? `${e.province.label}-${e.city.label}-${e.area.label}` : "";
}

onShow(params=>{
  if(params.id){
      getEventinfo(params.id).then(res=>{
        eventinfo.value = res.data
        const cityCodes = parseCityCode(eventinfo.value.city);
        cityText.value = formatCityTextByCode(cityCodes);
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventinfo(id).then(()=>{
    navigateTo("/pages_bt10/pages/eventinfo/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventinfo() {
  addEventinfo(eventinfo.value).then(()=>{
    navigateTo("/pages_bt10/pages/eventinfo/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
