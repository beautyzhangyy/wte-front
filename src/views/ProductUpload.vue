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
          v-model="productName"
          label="菜名"
          :rules="[{ required: true, message: '请填写菜名' }]"
          />
          <van-field
          v-model="productPrice"
          label="价格"
          :rules="[{ required: true, message: '请填写价格' }]"
          />
          <van-field
          v-model="productIntro"
          label="介绍"
          :rules="[{ required: true, message: '请填写介绍' }]"
          />
          <van-field
          v-model="productInventory"
          label="库存"
          :rules="[{ required: true, message: '请填写库存' }]"
          />
          <div class="product-info">
            <div class="uploader_box">
              <input
                type="file"
                id="upload_input"
                accept="image/*"
                multiple="multiple"
                @change="change($event)"
              />
            </div>
          </div>
          <p></p>
          <div>
          <label><input class="check-box" v-model="productCategory" type="radio" value="food" >食品</label>
          <label><input class="check-box" v-model="productCategory" type="radio" value="drink">饮品</label>
          </div>
          <div style="margin: 16px;">
            <van-button round block color="#1baeae" native-type="submit">新增菜品</van-button>
          </div>
        </van-form>
      </div>
      </div>
 </template>

  
  <script>
  import { reactive,onMounted, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { productUpload, uploadProductSPic} from '@/service/product'
  import { Toast} from 'vant'
  import { getLocal } from '../common/js/utils'
  export default {
    data(){
        return{
          areShow:true
        }
      },
    setup() {
      const state = reactive({
        productName: '',
        productPrice: '',
        productIntro: '',
        productInventory:'',
        productCategory:'',
        imgFile: ''
      })

      onMounted(() => {
        state.seller = JSON.parse(getLocal('sellerinfo'))
      })

      const onSubmit = async () => {
        if(!state.imgFile) {
          Toast.fail("请选择商品图片")
          return
        }

        Toast.loading({
          message: '上传中...',
          forbidClick: true
        });

        const res = await productUpload({
            "productName": state.productName,
            "productPrice": state.productPrice,
            "productIntro":state.productIntro,
            "productCategory":state.productCategory,
            "productInventory":state.productInventory,
            "productStatus": 1, 
            "sellerId": state.seller.sellerId,
          })

        if(res.resultCode == 200) {
          let formData = new FormData();
          formData.append("file",state.imgFile)
          formData.append("productName",state.productName)
          formData.append("sellerId",state.seller.sellerId)

          const res = await uploadProductSPic(formData)

          if(res.resultCode == 200) {
            state.productName = ''
            state.productPrice = ''
            state.productIntro = ''
            state.productCategory = ''
            state.productInventory = ''
            state.imgFile = ''
            Toast.success("上传成功")
          }else {
            Toast.fail("上传商品图像失败")
          }
        }else {
          Toast.fail("上传商品信息失败")
        }
        Toast.clear()        
      }

      const change = async (e) => {
        let file = e.target.files
        let length = e.target.files.length
        if (length > 1 || length == 0) {
          Toast.fail("只能上传一张图片")
          return
        }
        state.imgFile = file[0]
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
        width: 100%;
        margin: 1px 1px;
        height: 35px;
        background: linear-gradient(90deg, @primary, #51c7c7);
        box-shadow: 0 2px 5px #269090;
        border-radius: 6px;
        .uploader_box {
          width: 100%;
          height: 30px;
          overflow: hidden;
          position: relative;
          #upload_input {
            position: absolute;
            top: 0;
            left: 10px;
            width: 100%;
            height: 100%;
            cursor: pointer;
            color: #fff;
            text-decoration: none;
            text-align: center;
            font:normal normal normal 14px/40px 'Microsoft YaHei';
            border-radius: 4px;
          }
        }
      }
      .check-box {
      -webkit-appearance: checkbox;
    }
    
  </style>
  