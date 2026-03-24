<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="被邀请人用户ID(sys_user.user_id)" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入被邀请人用户ID(sys_user.user_id)" />
        </uni-forms-item>
        <uni-forms-item label="邀请人用户ID" prop="inviterId">
          <uni-easyinput v-model="form.inviterId" placeholder="请输入邀请人用户ID" />
        </uni-forms-item>
        <uni-forms-item label="使用的邀请码" prop="inviteCode">
          <uni-easyinput v-model="form.inviteCode" placeholder="请输入使用的邀请码" />
        </uni-forms-item>
        <uni-forms-item label="被邀请时间" prop="inviteTime">
          <uni-datetime-picker type="datetime" v-model="form.inviteTime"/>
        </uni-forms-item>
        <uni-forms-item label="邀请奖励积分" prop="rewardPoints">
          <uni-easyinput v-model="form.rewardPoints" placeholder="请输入邀请奖励积分" />
        </uni-forms-item>
        <uni-forms-item label="邀请奖励贡献点" prop="rewardContrib">
          <uni-easyinput v-model="form.rewardContrib" placeholder="请输入邀请奖励贡献点" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUserinvite, delUserinvite, addUserinvite, updateUserinvite } from "@/api/bt10/userinvite";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userinvite = ref({
        id: null,
        userId: null,
        inviterId: null,
        inviteCode: null,
        inviteTime: null,
        rewardStatus: null,
        rewardClaimed: [],
        rewardPoints: null,
        rewardContrib: null,
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
      getUserinvite(params.id).then(res=>{
        userinvite.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUserinvite(id).then(()=>{
    navigateTo("/pages_bt10/pages/userinvite/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUserinvite() {
  addUserinvite(userinvite.value).then(()=>{
    navigateTo("/pages_bt10/pages/userinvite/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
