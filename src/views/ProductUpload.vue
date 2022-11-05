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
    <div class="seting-box">
      <s-header :name="'菜品上传'"></s-header>
      <div type = 'productUpload' class="input-item">
        <van-form @submit="onSubmit">
          <van-field
          v-model="productname1"
          name="productname1"
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
          v-model="productinventory1"
          name="productinventory1"
          label="库存"
          placeholder="库存"
          :rules="[{ required: true, message: '请填写库存' }]"
          />
          <div style="margin: 16px;">
            <van-button round block color="#1baeae" native-type="submit">保存</van-button>
          </div>
        </van-form>
      </div>
        <div class="product-info" v-show="areShow">
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
        </div>
      </div>
 </template>
          <!-- <van-field v-model="productName" label="菜名" />
        <van-field v-model="productPrice" type='password' label="价格" />
        <van-field v-model="productPicture" label="缩略图" />
        <van-field v-model="productIntro" label="介绍" />
        <van-field v-model="productInventory" label="库存" />
        <van-field v-model="seller_id" label="所属买家ID" /> -->
        <!--
        <div class="uploadImg">
          <van-uploader multiple :max-count="1" :deletable="false" :preview-full-image="false" :max-size="2 * 1024 * 1024" accept="image/*"
          @oversize="onOversize" :before-read="beforeRead" @after-read="afterRead" >
            <img src="https://s.yezgea02.com/1604040746310/aaaddd.png"/>
           <van-button type="primary"></van-button>
        </van-uploader>
        </div>
        -->

  
  <script>
  // import { reactive,onMounted, toRefs } from 'vue'
  import { reactive,toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { productUpload,uploadProductSPic} from '@/service/product'
  import { setLocal } from '@/common/js/utils'  
  import { Toast} from 'vant'
  // import { getLocal, genImgURL } from '../common/js/utils'
  import {genImgURL } from '../common/js/utils'
  export default {
    data(){
        return{
          areShow:true
        }
      },
    setup() {
      const state = reactive({
        productname1: '',
        productprice1: '',
        productintro1: '',
        productinventory1:'',
        type:'productUpload',
        // sellerid1:'',
        imgURL: ''
      })

      // onMounted(() => {
      //   state.seller = JSON.parse(getLocal('sellerinfo'))
      //   state.sellerid1 = state.seller.sellerId
      // })

      const onSubmit = async (values) => {
        const { data } = await productUpload({
            "productName": values.productname1,
            "productPrice": values.productprice1,
            "productIntro":values.productintro1,
            "productInventory":values.productinventory1,
            "productStatus":"1",
            // "sellerId":values.sellerid1
          })
          Toast.success('菜品上传成功')
          setLocal('productinfo',JSON.stringify(data))
      }

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
        onSubmit,
        change,
      }
    },
    components: {
      sHeader
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
  
    .product-info {
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
  