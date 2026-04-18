<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="社群名称" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入社群名称" />
        </uni-forms-item>
        <uni-forms-item label="创建者(合伙人)用户ID" prop="ownerId">
          <uni-easyinput v-model="form.ownerId" placeholder="请输入创建者(合伙人)用户ID" />
        </uni-forms-item>
        <uni-forms-item label="最大成员数" prop="maxMembers">
          <uni-easyinput v-model="form.maxMembers" placeholder="请输入最大成员数" />
        </uni-forms-item>
        <uni-forms-item label="当前成员数" prop="memberCount">
          <uni-easyinput v-model="form.memberCount" placeholder="请输入当前成员数" />
        </uni-forms-item>
        <uni-forms-item label="封面图" prop="coverImageUrl">
          <uni-easyinput v-model="form.coverImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="所在城市" prop="city">
          <uni-easyinput v-model="cityText" placeholder="请选择省/市/区" disabled @click="openCitySelect" />
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
import { getCommunityinfo, delCommunityinfo, addCommunityinfo, updateCommunityinfo } from "@/api/bt10/communityinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";
import citySelect from "@/components/u-city-select/u-city-select.vue";

// 表单参数
const communityinfo = ref({
        id: null,
        name: null,
        ownerId: null,
        isPublic: [],
        maxMembers: null,
        memberCount: null,
        coverImageUrl: null,
        city: null,
        bizStatus: null,
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
const form = communityinfo;
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
  communityinfo.value.city = codeList.length ? codeList.join(",") : null;
  cityText.value = codeList.length ? `${e.province.label}-${e.city.label}-${e.area.label}` : "";
}

onShow(params=>{
  if(params.id){
      getCommunityinfo(params.id).then(res=>{
        communityinfo.value = res.data
        const cityCodes = parseCityCode(communityinfo.value.city);
        cityText.value = formatCityTextByCode(cityCodes);
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delCommunityinfo(id).then(()=>{
    navigateTo("/pages_bt10/pages/communityinfo/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddCommunityinfo() {
  addCommunityinfo(communityinfo.value).then(()=>{
    navigateTo("/pages_bt10/pages/communityinfo/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
