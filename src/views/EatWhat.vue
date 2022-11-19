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
  <div class="create-order">
    <!-- <s-header :name="'WTE'" @callback="deleteLocal"></s-header> -->
    <div class="address-wrap">
      <i class="nbicon nbfanhui" @click="goHome"></i>
      <!-- <div class="name" @click="goTo">
        <span>{{ address.userName }} </span>
        <span>{{ address.userPhone }}</span>
      </div> -->
      <!-- <van-icon class="arrow" name="arrow" /> -->
    </div>
    <div class="wte-body">
      <van-checkbox-group @change="groupChange" v-model="result" ref="checkboxGroup">
        <van-swipe-cell :right-width="50" v-for="item in productinfo" :key="item.productId">
          <div class="good-item">
            <div class="good-img"><img :src="imgRootUrl+item.productSPic" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>菜名: {{ item.productName }}</span>
                <span>介绍：{{ item.productIntro }}</span>
                <span>库存：{{ item.productInventory }}</span>
                卖家：{{ item.storeName }}
              </div>
              <div class="price">¥{{ item.productPrice }}</div>
              <div class="show1" @click="addToCart(item)">
              <img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">
            </div>
            </div>
          </div>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <!-- <div class="good">
      <div class="good-item" v-for="item in productinfo" :key="item.productId">
            <img :src="imgRootUrl+item.productSPic" alt="">
            <div class="good-desc">
              <span>菜名: {{ item.productName }}</span><p></p>
              <span>价格：{{ item.productPrice }}</span><p></p>
              <span>介绍：{{ item.productIntro }}</span><p></p>
              <span>库存：{{ item.productInventory }}</span><p></p>
              卖家：{{ item.storeName }}<p></p>
            </div>
          </div>
    </div> -->
    <div class="pay-wrap">
      <!-- <div class="price">
        <span>商品金额</span>
        <span>¥{{ total }}</span>
      </div> -->
      <van-button @click="handleCreateOrder" class="pay-btn" color="#1baeae" type="primary" block>WTE</van-button>
    </div>
    <van-popup
      closeable
      :close-on-click-overlay="false"
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '30%' }"
      @close="close"
    >
      <!-- <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="handlePayOrder()">支付</van-button>
      </div> -->
    </van-popup>
    <!-- <nav-bar></nav-bar> -->
  </div>
</template>

<script>
// import navBar from '@/components/NavBar'
import { RandomWTE} from '@/service/product'
import { reactive,onMounted, toRefs } from 'vue'
// import sHeader from '@/components/SimpleHeader'
import { useRouter } from 'vue-router'
import { getLocal } from '@/common/js/utils'
import { addCart } from '../service/cart'
import { Toast } from 'vant'
import { useStore  } from 'vuex'
export default {
  components: {
    // navBar
    // sHeader
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      productinfo: [],
      isLogin: false, // 是否已登录
      address: {},
      showPay: false,
      orderNo: '',
      imgRootUrl : 'http://localhost:8081',
    })
    
    onMounted(async () => {
      const userinfo = getLocal('userinfo')
      if (userinfo) {
        state.isLogin = true
        // 获取购物车数据.
        store.dispatch('updateCart')
      }
      const { data } = await RandomWTE()
      state.productinfo = data
    })

    const addToCart = (item) => {
      if(state.isLogin != true){
        router.push({ path: `/login` })
      }else{
        state.user = JSON.parse(getLocal('userinfo'))
        addCart({ "userId": state.user.userId, "productId": item.productId,"num":1 })
        Toast.success("添加成功")
      }
    }

    const goHome = () => {
      router.push({ path: 'home' })
    }

    const handleCreateOrder = async () => {
      location. reload()
    }

    return {
      ...toRefs(state),
      handleCreateOrder,
      addToCart,
      goHome
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .create-order {
    background: #f9f9f9;
    .address-wrap {
      margin-bottom: 20px;
      background: #fff;
      position: relative;
      font-size: 14px;
      padding: 20px;
      color: #222333;
      .name, .address {
        margin: 10px 0;
      }
      .arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
      }
      &::before {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
        background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
        background: repeating-linear-gradient(-45deg, #51c7c7 0, #51c7c7 20%, transparent 0, transparent 25%, #51c7c7 0, #51c7c7 45%, transparent 0, transparent 50%);
        background-size: 80px;
        content: '';
      }
    }
    .wte-body {
      margin: 16px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
          }
        }
        .show1 {
        color: @primary;
        line-height: 25px;
        .shopping {
          width: 50px;
          height: 50px;
          vertical-align: -3px;
        }
      }
      }
    }
  }
  .check-box {
      -webkit-appearance: checkbox;
    }
</style>