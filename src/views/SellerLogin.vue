<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
    <div class="sellerLogin">
      <s-header :name="type == 'sellerLogin' ? '商家登录' : '商家注册'" :back="'/home'"></s-header>
      <img class="logo" src="https://img95.699pic.com/element/40132/8910.png_300.png!/fw/431/clip/0x300a0a0" alt="">
      <div v-if="type == 'sellerLogin'" class="sellerLogin-body sellerLogin">
        <van-form @submit="onSubmit">
          <van-field
            v-model="sellername"
            name="sellername"
            label="商家名"
            placeholder="商家名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="sellerpassword"
            type="password"
            name="sellerpassword"
            label="商家密码"
            placeholder="商家密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px;">
            <div class="link-sellerRegister" @click="toggle('sellerRegister')">立即注册</div>
            <van-button round block color="#1baeae" native-type="submit">登录</van-button>
          </div>
        </van-form>
      </div>
      <div v-else class="sellerLogin-body sellerRegister">
        <van-form @submit="onSubmit">
          <van-field
            v-model="sellername1"
            name="sellername1"
            label="商家账号"
            placeholder="商家账号"
            :rules="[{ required: true, message: '请填写商家账号' }]"
          />
          <van-field
            v-model="sellerpassword1"
            type="password"
            name="sellerpassword1"
            label="商家密码"
            placeholder="商家密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="storename1"
            name="storename1"
            label="店铺名"
            placeholder="店铺名"
            :rules="[{ required: true, message: '请填写店铺名' }]"
          />
          <van-field
            v-model="sellerphonenum1"
            name="sellerphonenum1"
            label="商家电话"
            placeholder="商家电话"
            :rules="[{ required: true, message: '请填写电话' }]"
          />
          <van-field
            v-model="selltime1"
            name="selltime1"
            label="营业时间"
            placeholder="营业时间"
            :rules="[{ required: true, message: '请填写营业时间' }]"
          />
          <van-field
            v-model="selleraddress1"
            name="selleraddress1"
            label="商家地址"
            placeholder="商家地址"
            :rules="[{ required: true, message: '请填写商家地址' }]"
          />
          <div style="margin: 16px;">
            <div class="link-sellerLogin" @click="toggle('sellerLogin')">已有登录账号</div>
            <van-button round block color="#1baeae" native-type="submit">注册</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { sellerLogin, sellerRegister } from '@/service/seller'
  import { setLocal } from '@/common/js/utils'
  import { Toast } from 'vant'
  import { useRouter } from 'vue-router'
  
  export default {
    setup() {
      const router = useRouter()
      const state = reactive({
        sellername: '',
        sellerpassword: '',
        sellername1: '',
        sellerpassword1: '',
        sellerphonenum1:'',
        storename1:'',
        selltime1:'',
        selleraddress1:'',
        type: 'sellerLogin',
        imgCode: '',
      })
  
      // 切换登录和注册两种模式
      const toggle = (v) => {
        state.type = v
      }
  
      // 提交登录或注册表单 异步async / 同步await
      const onSubmit = async (values) => {
        if (state.type == 'sellerLogin') {
          const { data } = await sellerLogin({
            "sellerName": values.sellername,
            "sellerPassword": values.sellerpassword
          })
          setLocal('sellerinfo',JSON.stringify(data))
          // 跳转至用户个人信息页面
          router.push({path:'/seller', replace:true})
        } else {
          await sellerRegister({
            "sellerName": values.sellername1,
            "sellerPassword": values.sellerpassword1,
            "storeName":values.storename1,
            "sellerPhoneNum":values.sellerphonenum1,
            "sellTime":values.selltime1,
            "sellerAddress":values.selleraddress1
          })
          Toast.success('商家注册成功')
          state.type = 'sellerLogin'
        }
      }
  
      return {
        ...toRefs(state),
        toggle,
        onSubmit
      }
    },
    components: {
      sHeader
    }
  }
  </script>
  
  <style lang="less">
    .sellerLogin {
      .logo {
        width: 180px;
        height: 180px;
        display: block;
        margin: 80px auto 20px;
      }
      .sellerLogin-body {
        padding: 0 20px;
      }
      .sellerLogin {
        .link-sellerRegister {
          font-size: 14px;
          margin-bottom: 20px;
          color: #1989fa;
          display: inline-block;
        }
      }
      .sellerRegister {
        .link-sellerLogin {
          font-size: 14px;
          margin-bottom: 20px;
          color: #1989fa;
          display: inline-block;
        }
      }
      .verify-bar-area {
        margin-top: 24px;
        .verify-left-bar {
          border-color: #1baeae;
        }
        .verify-move-block {
          background-color: #1baeae;
          color: #fff;
        }
      }
      .verify {
        >div {
          width: 100%;
        }
        display: flex;
        justify-content: center;
        .cerify-code-panel {
          margin-top: 16px;
        }
        .verify-code {
          width: 40%!important;
          float: left!important;
        }
        .verify-code-area {
          float: left!important;
          width: 54%!important;
          margin-left: 14px!important;
          .varify-input-code {
            width: 90px;
            height: 38px!important;
            border: 1px solid #e9e9e9;
            padding-left: 10px;
            font-size: 16px;
          }
          .verify-change-area {
            line-height: 44px;
          }
        }
      }
    }
  </style>