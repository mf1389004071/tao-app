<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="社群名称" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入社群名称" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
          <uni-easyinput v-model="form.city" placeholder="请输入所在城市" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本1" prop="text1">
          <uni-easyinput v-model="form.text1" placeholder="请输入扩展文本1" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本2" prop="text2">
          <uni-easyinput v-model="form.text2" placeholder="请输入扩展文本2" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本3" prop="text3">
          <uni-easyinput v-model="form.text3" placeholder="请输入扩展文本3" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getCommunityinfo, delCommunityinfo, addCommunityinfo, updateCommunityinfo } from "@/api/bt10/communityinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const communityinfo = ref({
        id: null,
        name: null,
        remark: null,
        ownerId: null,
        isPublic: [],
        maxMembers: null,
        memberCount: null,
        coverImageUrl: null,
        city: null,
        bizStatus: null,
        createId: null,
        updateId: null,
        deleteId: null,
        createTime: null,
        updateTime: null,
        deleteTime: null,
        delFlag: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getCommunityinfo(params.id).then(res=>{
        communityinfo.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delCommunityinfo(id).then(()=>{
    navigateTo("/pages/bt10/communityinfo/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddCommunityinfo() {
  addCommunityinfo(communityinfo.value).then(()=>{
    navigateTo("/pages/bt10/communityinfo/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
