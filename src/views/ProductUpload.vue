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
      <div class="product-info">
        <div class="uploader_box">
          <img id="logimg" :src=imgURL />
          <input
            type="file"
            id="upload_input"
            accept="image/*"
            multiple="multiple"
            @change="change($event)"
          />
        </div>
        <!--
        <div class="uploadImg">
          <van-uploader multiple :max-count="1" :deletable="false" :preview-full-image="false" :max-size="2 * 1024 * 1024" accept="image/*"
          @oversize="onOversize" :before-read="beforeRead" @after-read="afterRead" >
            <img src="https://s.yezgea02.com/1604040746310/aaaddd.png"/>
           <van-button type="primary"></van-button>
        </van-uploader>
        </div>
        -->
      </div>
      <div class="input-item">
        <van-field v-model="productName" label="菜名" />
        <van-field v-model="productPrice" type='password' label="价格" />
        <van-field v-model="productIntro" label="介绍" />
        <van-field v-model="productStatus" label="状态" />
        <van-field v-model="productInventory" label="库存" />
      </div>
      <van-button round class="save-btn" color="#1baeae" type="primary" @click="save" block>保存</van-button>
      <van-button round class="save-btn" color="#1baeae" type="primary" @click="handleLogout" block>返回</van-button>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { productUpload, uploadProductSPic} from '@/service/seller'
  import { setLocal } from '@/common/js/utils'
  import { Toast} from 'vant'
  import { getLocal, genImgURL } from '../common/js/utils'
  export default {
    components: {
      sHeader
    },
    setup() {
      const state = reactive({
        product:'',
        productName: '',
        productPrice: '',
        productIntro:'',
        productStatus:'',
        productInventory:'',
        imgURL: ''
      })
  
      onMounted(() => {
        state.product = JSON.parse(getLocal('productinfo'))
        state.productName = state.product.productName
        state.productPrice = state.product.productPrice
        state.productIntro = state.product.productIntro
        state.productStatus = state.product.productStatus
        state.productInventory = state.product.productInventory
        state.imgURL = state.product.productSPic ? genImgURL(state.product.productSPic) : "https://s.yezgea02.com/1604040746310/aaaddd.png"
      })
  
      const save = async () => {
        const params = {
            productName: state.product.productName,
            productPrice: state.product.productPrice,
            productIntro: state.product.productIntro,
            productStatus: state.product.productStatus,
            productInventory: state.product.productInventory,
        }
        const res = await EditSellerInfo(params)
        if(res.resultCode == 200) {
            state.productName = state.product.productName
            state.productPrice = state.product.productPrice
            state.productIntro = state.product.productIntro
            state.productStatus = state.product.productStatus
            state.productInventory = state.product.productInventory
          setLocal('productinfo',JSON.stringify(state.product))
          Toast.success('保存成功')
        }
      }
  
      const handleLogout = () => {
        setLocal('productinfo', '')
        window.location.href = '/sellerSetting'
      }
  
      // 上传菜品图
      const change = async (e) => {
        let file = e.target.files
        let length = e.target.files.length
        if (length > 1 || length == 0) {
          Toast.fail("只能上传一张图片")
          return
        }
  
        Toast.loading({
          message: '上传中...',
          forbidClick: true
        });
        // 创建一个空对象实例
        let formData = new FormData();
        // 调用append()方法添加数据
        for (let i = 0; i < length; i++) {
          formData.append("file", file[i]);
        }
        formData.append("productName", state.product.productName)
        formData.append("sellerId", state.seller.sellerId)
        const res = await uploadProductSPic(formData)
  
        if(res.resultCode == 200) {
          // 更新localStorage
          state.product.productSPic = res.data
          setLocal('productinfo',JSON.stringify(state.product))
  
          // 渲染图片
          state.imgURL = genImgURL(state.product.productSPic)
        }else {
          Toast.fail("上传图片失败")
        }
        Toast.clear()
      }
      return {
        ...toRefs(state),
        save,
        handleLogout,
        change
      }
    }
  
  }
  </script>
  
  <style lang="less" scoped>
    @import '../common/style/mixin';
    .seting-box {
      .save-btn {
        width: 80%;
        margin: 20px auto ;
      }
    }
  
    .seller-info {
        width: 94%;
        margin: 10px;
        height: 155px;
        background: linear-gradient(90deg, @primary, #51c7c7);
        box-shadow: 0 2px 5px #269090;
        border-radius: 6px;
        .uploader_box {
          width: 50%;
          height: 125px;
          left: 25%;
          top: 15px;
          overflow: hidden;
          position: relative;
          border-radius: 50%;
          #logimg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          #upload_input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            opacity: 0;
          }
        }
      }
    
  </style>
  