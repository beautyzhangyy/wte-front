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
        <div id="app">
          <div class="tabWrap">
          <!-- 这个结构是tab导航，并给其绑定对应的点击事件，在点击事件的回调中
          去控制对应内容的显示隐藏和样式的修改即：tab的切换-->
          <div class="tabNav">
            <div class="navOne" @click="tabOne">上架</div>
            <div class="navTwo" @click="tabTwo">下架</div>
          </div>
          </div>
        </div>
      </div>
      <van-button round class="save-btn" color="#1baeae" type="primary" @click="save" block>保存</van-button>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted, toRefs } from 'vue'
  import sHeader from '@/components/SimpleHeader'
  import { productUpdate, uploadProductSPic} from '@/service/product'
  import { setLocal } from '@/common/js/utils'
  import { Toast} from 'vant'
  import { getLocal, genImgURL } from '../common/js/utils'
  export default {
    name: "app",
    data() {
      return {
      showTabOne: true, // 二选一tab切换
      showTabTwo: false, // 二选一tab切换
      };
    },
    methods: {
      // 二选一tab栏切换
      tabOne() {
      /*
        点击tab1的时候，让tab1显示，tab2隐藏，即showTabOne为true，showTabTwo为false
        同时修改tab1的样式使其"高亮",注意不要忘了修改tab2的样式，使其"不高亮"。
        点击tab2的时候，也是同理。
      */
      this.showTabOne = true;
      this.showTabTwo = false;
      this.producctStatus="1"
      },
      // 二选一tab栏切换
      tabTwo() {
      this.showTabTwo = true;
      this.showTabOne = false;
      this.producctStatus="0"
      },
    },

    components: {
      sHeader
    },
    setup() {
      const state = reactive({
        product:'',
        productName: '',
        productPrice: '',
        productIntro:'',
        productInventory:'',
        producctStatus:'',
        imgURL: '',
      })
  
      onMounted(() => {
        state.product = JSON.parse(getLocal('productinfo'))
        state.productName = state.product.productName
        state.productPrice = state.product.productPrice
        state.productIntro = state.product.productIntro
        state.productInventory = state.product.productInventory
        state.imgURL = state.product.productSPic
      })
  
      const save = async () => {
        const params = {
            productId: state.product.productId,
            productName:state.productName,
            productPrice:state.productPrice,
            productIntro:state.productIntro,
            productInventory:state.productInventory
        }
        const res = await productUpdate(params)
        if(res.resultCode == 200) {
            state.product.productName = state.productName
            state.product.productPrice = state.productPrice
            state.product.productIntro = state.productIntro
            state.product.productInventory = state.productInventory
          setLocal('productinfo',JSON.stringify(state.product))
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
        formData1.append("sellerId",state.seller.sellerId)
        const res = await uploadProductSPic(formData1)
  
        if(res.resultCode == 200) {
          // 更新localStorage
          state.seller.storePic = res.data
          setLocal('productinfo',JSON.stringify(state.product))
  
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
    .tabNav {
 width: 126px;
 height: 30px;
 border-radius: 2px;
 background-color: #e3e3e3;
 display: flex;
 align-items: center;
 justify-content: space-evenly;
 .navOne {
  width: 60px;
  height: 26px;
  border-radius: 2px;
  background-color: #fff;
  color: #3985ec;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
 }
 .navTwo {
  width: 60px;
  height: 26px;
  color: #80868d;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
 }
}
.tabContent {
 margin-top: 8px;
 .navOneBox {
  background-color: #bfa;
 }
 .navTwoBox {
  background-color: #baf;
 }
}
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