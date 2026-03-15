<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="真实姓名" prop="realName">
          <uni-easyinput v-model="form.realName" placeholder="请输入真实姓名" />
        </uni-forms-item>
        <uni-forms-item label="当前积分余额" prop="points">
          <uni-easyinput v-model="form.points" placeholder="请输入当前积分余额" />
        </uni-forms-item>
        <uni-forms-item label="历史累计获得积分" prop="totalPoints">
          <uni-easyinput v-model="form.totalPoints" placeholder="请输入历史累计获得积分" />
        </uni-forms-item>
        <uni-forms-item label="贡献点余额(1:1人民币)" prop="contributionPoints">
          <uni-easyinput v-model="form.contributionPoints" placeholder="请输入贡献点余额(1:1人民币)" />
        </uni-forms-item>
        <uni-forms-item label="历史累计贡献点" prop="totalContributionPoints">
          <uni-easyinput v-model="form.totalContributionPoints" placeholder="请输入历史累计贡献点" />
        </uni-forms-item>
        <uni-forms-item label="成长阶段：入门/学员/高手/导师" prop="growthStage">
          <uni-easyinput v-model="form.growthStage" placeholder="请输入成长阶段：入门/学员/高手/导师" />
        </uni-forms-item>
        <uni-forms-item label="加入/注册日期" prop="joinDate">
          <uni-datetime-picker type="datetime" v-model="form.joinDate"/>
        </uni-forms-item>
        <uni-forms-item label="最后活跃时间" prop="lastActiveAt">
          <uni-datetime-picker type="datetime" v-model="form.lastActiveAt"/>
        </uni-forms-item>
        <uni-forms-item label="微信开放平台 unionid" prop="wechatUnionid">
          <uni-easyinput v-model="form.wechatUnionid" placeholder="请输入微信开放平台 unionid" />
        </uni-forms-item>
        <uni-forms-item label="微信开放平台 openid" prop="wechatOpenid">
          <uni-easyinput v-model="form.wechatOpenid" placeholder="请输入微信开放平台 openid" />
        </uni-forms-item>
        <uni-forms-item label="小程序 openid" prop="miniappOpenid">
          <uni-easyinput v-model="form.miniappOpenid" placeholder="请输入小程序 openid" />
        </uni-forms-item>
        <uni-forms-item label="企业微信用户ID" prop="wxWorkUserid">
          <uni-easyinput v-model="form.wxWorkUserid" placeholder="请输入企业微信用户ID" />
        </uni-forms-item>
        <uni-forms-item label="Facebook用户ID" prop="facebookUserid">
          <uni-easyinput v-model="form.facebookUserid" placeholder="请输入Facebook用户ID" />
        </uni-forms-item>
        <uni-forms-item label="Google用户ID" prop="googleUserid">
          <uni-easyinput v-model="form.googleUserid" placeholder="请输入Google用户ID" />
        </uni-forms-item>
        <uni-forms-item label="Apple用户ID" prop="appleUserid">
          <uni-easyinput v-model="form.appleUserid" placeholder="请输入Apple用户ID" />
        </uni-forms-item>
        <uni-forms-item label="Outlook用户ID" prop="outlookUserid">
          <uni-easyinput v-model="form.outlookUserid" placeholder="请输入Outlook用户ID" />
        </uni-forms-item>
        <uni-forms-item label="小鹅通用户ID(同步)" prop="xiaoeUserId">
          <uni-easyinput v-model="form.xiaoeUserId" placeholder="请输入小鹅通用户ID(同步)" />
        </uni-forms-item>
        <uni-forms-item label="邀请人用户ID(sys_user.user_id)" prop="inviterId">
          <uni-easyinput v-model="form.inviterId" placeholder="请输入邀请人用户ID(sys_user.user_id)" />
        </uni-forms-item>
        <uni-forms-item label="本人邀请码，用于邀请好友" prop="invitationCode">
          <uni-easyinput v-model="form.invitationCode" placeholder="请输入本人邀请码，用于邀请好友" />
        </uni-forms-item>
        <uni-forms-item label="业务角色：创始人/联创/合伙人/高手/城市主理人/会员" prop="bizRole">
          <uni-easyinput v-model="form.bizRole" placeholder="请输入业务角色：创始人/联创/合伙人/高手/城市主理人/会员" />
        </uni-forms-item>
        <uni-forms-item label="最美照片URL" prop="bestPhotoUrl">
          <uni-easyinput v-model="form.bestPhotoUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="微信头像URL(同步用)" prop="avatarWechatUrl">
          <uni-easyinput v-model="form.avatarWechatUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="宣传用头像URL" prop="avatarPromoUrl">
          <uni-easyinput v-model="form.avatarPromoUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="个人宣传图URL" prop="promoImageUrl">
          <uni-easyinput v-model="form.promoImageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="心树图URL(商业定位成果)" prop="heartTreeUrl">
          <uni-easyinput v-model="form.heartTreeUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="心钥图URL(商业定位成果)" prop="heartKeyUrl">
          <uni-easyinput v-model="form.heartKeyUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="商业定位文案(探索本质)" prop="businessPositioning">
          <uni-easyinput v-model="form.businessPositioning" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="天赋解读与能力总结" prop="talentSummary">
          <uni-easyinput v-model="form.talentSummary" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="可交流时段描述" prop="availableTimeSlots">
          <uni-easyinput v-model="form.availableTimeSlots" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="额外画像信息(JSON)，如家庭成员/挑战列表等" prop="extraProfile">
          <!-- <file-upload v-model="form.extraProfile"/> -->
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUserprofiles, delUserprofiles, addUserprofiles, updateUserprofiles } from "@/api/bt10/userprofiles";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userprofiles = ref({
        userId: null,
        realName: null,
        points: null,
        totalPoints: null,
        contributionPoints: null,
        totalContributionPoints: null,
        growthStage: null,
        joinDate: null,
        lastActiveAt: null,
        wechatUnionid: null,
        wechatOpenid: null,
        miniappOpenid: null,
        wxWorkUserid: null,
        facebookUserid: null,
        googleUserid: null,
        appleUserid: null,
        outlookUserid: null,
        xiaoeUserId: null,
        xiaoeData: null,
        inviterId: null,
        invitationCode: null,
        bizRole: null,
        bestPhotoUrl: null,
        avatarWechatUrl: null,
        avatarPromoUrl: null,
        promoImageUrl: null,
        heartTreeUrl: null,
        heartKeyUrl: null,
        businessPositioning: null,
        talentSummary: null,
        availableTimeSlots: null,
        appointmentStatus: null,
        extraProfile: null,
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
        status: null,
        delFlag: null,
        remark: null
      })
onShow(params=>{
  if(params.userId){
      getUserprofiles(params.userId).then(res=>{
        userprofiles.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(userId) {
  delUserprofiles(userId).then(()=>{
    navigateTo("/pages/bt10/userprofiles/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUserprofiles() {
  addUserprofiles(userprofiles.value).then(()=>{
    navigateTo("/pages/bt10/userprofiles/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
