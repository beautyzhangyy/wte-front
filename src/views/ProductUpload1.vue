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
    <div class="productUpload-box">
      <s-header :name="'菜品上传'"></s-header>
      <div v-if="type == 'productUpload'" class="productUpload-body productUpload">
        <van-form @submit="onSubmit">
          <van-field
            v-model="productname1"
            name="productname"
            label="菜名"
            placeholder="菜名"
            :rules="[{ required: true, message: '请填写菜名' }]"
          />
          <van-field
            v-model="productprice1"
            name="productprice1"
            label="价格"
            placeholder="价格"
            :rules="[{ required: true, message: '请填写价格' }]"
          />
          <van-field
            v-model="productintro1"
            name="productintro1"
            label="介绍"
            placeholder="介绍"
            :rules="[{ required: true, message: '请填写介绍' }]"
          />
          <van-field
            v-model="productstatus1"
            name="productstatus1"
            label="状态"
            placeholder="状态"
            :rules="[{ required: true, message: '请填写状态' }]"
          />
          <van-field
            v-model="productinventory1"
            name="productinventory1"
            label="库存"
            placeholder="库存"
            :rules="[{ required: true, message: '请填写库存' }]"
          />
        </van-form>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { productUpload, uploadProductSPic } from '@/service/seller'
  import { setLocal } from '@/common/js/utils'
  import { Toast } from 'vant'
  import { getLocal, genImgURL } from '../common/js/utils'

  export default {
    setup() {
      const router = productRouter()
      const state = reactive({
        productname1: '',
        productprice1: '',
        productintro1: '',
        productstatus1: '',
        productinventory1:'',
        type: 'productUpload',
        imgCode: '',
      })
  
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
        width: 120px;
        height: 120px;
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