<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入活动ID" />
        </uni-forms-item>
        <uni-forms-item label="角色名：天使/主持人/PM/助教/签到/主讲等" prop="roleName">
          <uni-easyinput v-model="form.roleName" placeholder="请输入角色名：天使/主持人/PM/助教/签到/主讲等" />
        </uni-forms-item>
        <uni-forms-item label="角色说明" prop="roleDescription">
          <uni-easyinput v-model="form.roleDescription" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="该角色最大人数" prop="maxParticipants">
          <uni-easyinput v-model="form.maxParticipants" placeholder="请输入该角色最大人数" />
        </uni-forms-item>
        <uni-forms-item label="当前已分配人数" prop="currentParticipants">
          <uni-easyinput v-model="form.currentParticipants" placeholder="请输入当前已分配人数" />
        </uni-forms-item>
        <uni-forms-item label="担任该角色奖励积分" prop="pointsReward">
          <uni-easyinput v-model="form.pointsReward" placeholder="请输入担任该角色奖励积分" />
        </uni-forms-item>
        <uni-forms-item label="担任该角色奖励贡献点" prop="contribReward">
          <uni-easyinput v-model="form.contribReward" placeholder="请输入担任该角色奖励贡献点" />
        </uni-forms-item>
        <uni-forms-item label="职责说明" prop="responsibilities">
          <uni-easyinput v-model="form.responsibilities" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="任职要求" prop="requirements">
          <uni-easyinput v-model="form.requirements" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventrole, delEventrole, addEventrole, updateEventrole } from "@/api/bt10/eventrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventrole = ref({
        id: null,
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
        createId: null,
        updateId: null,
        createTime: null,
        updateTime: null,
        delFlag: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getEventrole(params.id).then(res=>{
        eventrole.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventrole(id).then(()=>{
    navigateTo("/pages/bt10/eventrole/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventrole() {
  addEventrole(eventrole.value).then(()=>{
    navigateTo("/pages/bt10/eventrole/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
