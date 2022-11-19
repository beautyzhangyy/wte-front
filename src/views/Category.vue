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
    <!-- <div class="address-wrap"> -->
      <!-- <div class="name" @click="goTo">
        <span>{{ address.userName }} </span>
        <span>{{ address.userPhone }}</span>
      </div> -->
      <van-button @click="handleCreateOrder" class="pay-btn" color="#1baeae" type="primary" block>查询</van-button>
      <div>
        <label><input class="check-box" v-model="productCategory" type="radio" value="drink" >饮品</label>
        <label><input class="check-box" v-model="productCategory" type="radio" value="food">食品</label>
      </div>
      <!-- <van-icon class="arrow" name="arrow" /> -->
    </div>
    <nav-bar></nav-bar>
  <!-- </div> -->
</template>

<script>
import navBar from '@/components/NavBar'
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
// import sHeader from '@/components/SimpleHeader'
export default {
  components: {
    navBar
    // sHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      cartList: [],
      address: {},
      productCategory:'',
      showPay: false,
      orderNo: '',
      imgRootUrl : 'http://localhost:8081',
      cartItemIds: [],
      productStatus:'',
    })

    const handleCreateOrder = async () => {
      router.push({ path: `/categoryDetail/${state.productCategory}` })
    }

    return {
      ...toRefs(state),
      // goTo,
      handleCreateOrder,
      close
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
    .good {
      margin-bottom: 120px;
    }
    .good-item {
      padding: 10px;
      background: #fff;
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
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .pay-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      padding: 10px 0;
      padding-bottom: 50px;
      border-top: 1px solid #e9e9e9;
      >div {
        display: flex;
        justify-content: space-between;
        padding: 0 5%;
        margin: 10px 0;
        font-size: 14px;
        span:nth-child(2) {
          color: red;
          font-size: 18px;
        }
      }
      .pay-btn {
        position: fixed;
        bottom: 7px;
        right: 0;
        left: 0;
        width: 70%;
        margin: 0 auto;
      
      }
    }
  }
  .check-box {
    width: 100px;
    height: 50px;
      -webkit-appearance: checkbox;
    }
</style>