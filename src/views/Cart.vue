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
  <div class="cart-box">
    <s-header :name="'购物车'" :noback="true"></s-header>
    <div class="cart-body">
      <van-checkbox-group @change="groupChange" v-model="result" ref="checkboxGroup">
        <van-swipe-cell :right-width="50" v-for="item in cartinfo" :key="item.cartId">
          <div class="good-item">
            <van-checkbox :name="item.cartId" />
            <div class="good-img"><img :src="imgRootUrl+item.productSPic" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.productName }}</span>
                <span>x{{ item.num }}</span>
              </div>
              <div class="good-btn">
                <div class="price">¥{{ item.productPrice }}</div>
                <van-stepper
                  integer
                  :min="1"
                  :max="30"
                  :model-value="item.num"
                  :name="item.cartId"
                  async-change
                  @change="onChange"
                />
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteProduct(item)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="cartinfo.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      @submit="onSubmit"
    >
      <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!cartinfo.length">
      <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button round color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
    </div>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import navBar from '@/components/NavBar'
import sHeader from '@/components/SimpleHeader'
import { getLocal } from '../common/js/utils'
import { getCartList, updateCart, deleteCart} from '@/service/cart'

export default {
  components: {
    navBar,
    sHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      checked: false,
      cartinfo: [],
      imgRootUrl : 'http://localhost:8081',
      all: false,
      result: [],
      checkAll: true
    })

    onMounted(async () => {
      Toast.loading({ message: '加载中...', forbidClick: true });
      state.user = JSON.parse(getLocal('userinfo'))
      const { data } = await getCartList({params:{"userId":state.user.userId}})
      state.cartinfo = data.list
      state.result = data.map(item => item.cartId)
      Toast.clear()
    })

    const total = computed(() => {
      let sum = 0
      let _cartinfo = state.cartinfo.filter(item => state.result.includes(item.cartId))
      _cartinfo.forEach(item => {
        sum += item.num * item.productPrice
      })
      return sum
    })

    const goBack = () => {
      router.go(-1)
    }

    const goTo = () => {
      router.push({ path: '/home' })
    }

    const onChange = async (value, detail) => {
      if (value > 30) {
        Toast.fail('超出单个商品的最大购买数量')
        return
      }
      if (value < 1) {
        Toast.fail('商品不得小于1')
        return
      }
      if (state.cartinfo.filter(item => item.cartId == detail.name)[0].num == value) return
      Toast.loading({ message: '修改中...', forbidClick: true });
      const params = {
        cartId: detail.name,
        num: value
      }
      await updateCart(params)
      state.cartinfo.forEach(item => {
        if (item.cartId == detail.name) {
          item.num = value
        }
      })
      Toast.clear();
    }

    const onSubmit = async () => {
      if (state.result.length == 0) {
        Toast.fail('请选择商品进行结算')
        return
      }
      const params = JSON.stringify(state.result)
      router.push({ path: '/create-order', query: { cartItemIds: params } })
    }

    const deleteProduct = (item) => {
      deleteCart({params:{"cartId":item.cartId}})
    }

    const groupChange = (result) => {
      console.log(1)
      if (result.length == state.cartinfo.length) {
        console.log(2)
        state.checkAll = true
      } else {
        console.log(3)
        state.checkAll = false
      }
      state.result = result
    }
    
    const allCheck = () => {
      if (!state.checkAll) {
        state.result = state.cartinfo.map(item => item.cartId)
      } else {
        state.result = []
      }
    }
    
    return {
      ...toRefs(state),
      total,
      goBack,
      goTo,
      onChange,
      onSubmit,
      deleteProduct,
      groupChange,
      allCheck
    }
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .cart-box {
    .cart-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
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
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 50px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>
