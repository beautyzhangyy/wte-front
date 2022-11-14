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
    <s-header :name="'生成订单'" @callback="deleteLocal"></s-header>
    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img"><img :src="imgRootUrl+item.productSPic" alt=""></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.productName }}</span>
            <span>x{{ item.num }}</span>
          </div>
          <div class="good-btn">
            <div class="price">¥{{ item.productPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span>¥{{ total }}</span>
      </div>
      <van-button @click="handleCreateOrder" class="pay-btn" color="#1baeae" type="primary" block>生成订单</van-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed } from 'vue'
import sHeader from '@/components/SimpleHeader'
import { getCartInfo, deleteCart } from '@/service/cart'
import { createOrder } from '@/service/order'
import { updateInventory } from '@/service/product'
import { setLocal, getLocal } from '@/common/js/utils'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: {
    sHeader
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      cartList: [],
      address: {},
      imgRootUrl : 'http://localhost:8081',
      cartIds: [],
      _cartIds:""
    })
    
    onMounted(async () => {
      Toast.loading({ message: '加载中...', forbidClick: true });
      const { cartIds } = route.query
      state._cartIds = cartIds ? JSON.parse(cartIds) : JSON.parse(getLocal('cartIds'))
      console.log('cartIds', cartIds)
      setLocal('cartIds', JSON.stringify(state._cartIds))
      const { data: list } = await getCartInfo({ "cartIds": state._cartIds.join(',') })
      state.cartList = list
      Toast.clear()
    })

    const handleCreateOrder = async () => {
      await createOrder({cartIds: state._cartIds.join(',')})
      state.cartList.forEach(item => {
        updateInventory({params:{"productId":item.productId,"num":item.num}})
        deleteCart({params:{"cartId":item.cartId}})
      })
      router.push({ path: '/order' })
    }

    const deleteLocal = () => {
    }

    const total = computed(() => {
      let sum = 0
      state.cartList.forEach(item => {
        sum += item.num * item.productPrice
      })
      return sum
    })

    return {
      ...toRefs(state),
      deleteLocal,
      handleCreateOrder,
      close,
      total
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .create-order {
    background: #f9f9f9;
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
        width: 90%;
        margin: 0 auto;
      }
    }
  }
</style>
