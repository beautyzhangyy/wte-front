<template>
    <div class="seting-box">
      <s-header :name="'菜品管理'"></s-header>
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
      </div>
      <div class="input-item">
        <van-field v-model="productName" label="菜名" />
        <van-field v-model="productPrice"  label="价格" />
        <van-field v-model="productIntro" label="介绍" />
        <van-field v-model="productInventory" label="库存" />
      </div>
      <div>
        <label><input class="check-box" v-model="productStatus" type="radio" value="1" >上架</label>
        <label><input class="check-box" v-model="productStatus" type="radio" value="0">下架</label>
      </div>
      <van-button r ound class="save-btn" color="#1baeae" type="primary" @click="save" block>保存</van-button>
    </div>
  </template>
  
  
<script>
import { reactive, onMounted, toRefs } from 'vue'
import sHeader from '@/components/SimpleHeader'
import { useRoute } from 'vue-router'
import { productUpdate, uploadProductSPic,getProductInfo} from '@/service/product'
import { Toast} from 'vant'
import {  genImgURL } from '../common/js/utils'
export default {
  components: {
    sHeader
  },
  setup() {
    const route = useRoute()

    const state = reactive({
      product:'',
      productName: '',
      productPrice: '',
      productIntro:'',
      productInventory:'',
      productStatus:'',
      imgURL: '',
    })

    onMounted(async () => {
      const { id } = route.params
      const { data } = await getProductInfo({params:{
        "productId":id
      }})
      state.product = data
      state.productName = state.product.productName
      state.productPrice = state.product.productPrice
      state.productIntro = state.product.productIntro
      state.productInventory = state.product.productInventory
      state.productStatus = state.product.productStatus
      state.imgURL = genImgURL(state.product.productSPic)
    })

    const save = async () => {
      const params = {
          productId: state.product.productId,
          productName:state.productName,
          productPrice:state.productPrice,
          productIntro:state.productIntro,
          productInventory: state.productInventory,
          productStatus: state.productStatus
      }
      const res = await productUpdate(params)
      if(res.resultCode == 200) {
          state.product.productName = state.productName
          state.product.productPrice = state.productPrice
          state.product.productIntro = state.productIntro
          state.product.productInventory = state.productInventory
          state.product.productStatus = state.productStatus
        Toast.success('保存成功')
      }
    }

    // 上传店铺图片
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
      let formData1 = new FormData();
      // 调用append()方法添加数据
      for (let i = 0; i < length; i++) {
        formData1.append("file", file[i]);
      }
      formData1.append("productName", state.product.productName)
      formData1.append("sellerId",state.product.sellerId)
      const res = await uploadProductSPic(formData1)

      if(res.resultCode == 200) {
        // 更新localStorage
        state.product.productSPic = res.data

        // 渲染图片
        state.imgURL = genImgURL(state.product.productSPic)
      }else {
        Toast.fail("上传头像失败")
      }
      Toast.clear()
    }

    return {
      ...toRefs(state),
      save,
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
            opacity: 0;
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
  