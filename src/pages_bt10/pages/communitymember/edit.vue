<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="社群ID" prop="communityId">
          <uni-easyinput v-model="form.communityId" placeholder="请输入社群ID" />
        </uni-forms-item>
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="角色：群主/管理员/成员" prop="role">
          <uni-easyinput v-model="form.role" placeholder="请输入角色：群主/管理员/成员" />
        </uni-forms-item>
        <uni-forms-item label="加入时间" prop="joinedTime">
          <uni-datetime-picker type="datetime" v-model="form.joinedTime"/>
        </uni-forms-item>
        <uni-forms-item label="离开时间" prop="leftTime">
          <uni-datetime-picker type="datetime" v-model="form.leftTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getCommunitymember, delCommunitymember, addCommunitymember, updateCommunitymember } from "@/api/bt10/communitymember";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const communitymember = ref({
        id: null,
        communityId: null,
        userId: null,
        role: null,
        bizStatus: null,
        joinedTime: null,
        leftTime: null,
        createId: null,
        createBy: null,
        createTime: null,
        updateId: null,
        updateBy: null,
        updateTime: null,
        status: null,
        delFlag: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getCommunitymember(params.id).then(res=>{
        communitymember.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delCommunitymember(id).then(()=>{
    navigateTo("/pages_bt10/pages/communitymember/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddCommunitymember() {
  addCommunitymember(communitymember.value).then(()=>{
    navigateTo("/pages_bt10/pages/communitymember/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
