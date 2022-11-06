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
  <div>
    <header class="home-header wrap" :class="{'active' : headerScroll}">
      <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
      <div class="header-search">
        <span class="app-name">WTE</span>
        <i class="iconfont icon-search"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=home">请输入关键字</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin">登录   </router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
      <router-link class="sellerLogin" tag="span" to="./sellerLogin" v-if="!isSellerLogin">我是卖家</router-link>
      <router-link class="sellerLogin" tag="span" to="./seller" v-else>
        卖家页面
      </router-link>
    </header>
    <nav-bar />
    <swiper :list="swiperList"></swiper>
    <div class="category-list">
      <div v-for="item in categoryList" v-bind:key="item.categoryId" @click="tips">
        <img :src="item.imgUrl">
        <span>{{item.name}}</span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">新品上架</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in productinfo" :key="item.productId">
            <img :src="imgRootUrl+item.productSPic" alt="">
            <div class="good-desc">
              <span>菜名{{ item.productName }}</span>
              <span>价格：{{ item.productPrice }}</span>
              <span>介绍：{{ item.productIntro }}</span>
              <span>库存：{{ item.productInventory }}</span>
            </div>
            <router-link class="show1" tag="span" to="./login" v-if="!isLogin"><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">   </router-link>
            <router-link class="show1" tag="span" to="./cart" v-else><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt=""></router-link>
          </div>
        </div>
      </van-skeleton>
    </div>
    </div>
</template>


<script>
import { reactive, onMounted, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
import { getLocal } from '@/common/js/utils'
import { getProductsAtLeast } from '@/service/product'
import { Toast } from 'vant'
import { useStore  } from 'vuex'
export default {
  name: 'home',
  components: {
    swiper,
    navBar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      swiperList: [], // 轮播图列表
      isLogin: false, // 是否已登录
      isSellerLogin: false, // 卖家的登录状态
      headerScroll: false, // 滚动透明判断
      hots: [],
      productinfo: [],
      recommends: [],
      imgRootUrl : 'http://localhost:8081',
      categoryList: [
        {
          name: '智能推荐',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
          categoryId: 100001
        }, {
          name: '随机推送',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
          categoryId: 100002
        },
        {
          name: '店铺列表',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
          categoryId: 100003
        }
      ],
      loading: true
    })
    onMounted(async () => {
      const sellerinfo = getLocal('sellerinfo')
      if (sellerinfo) {
        state.isSellerLogin = true
      }

      const userinfo = getLocal('userinfo')
      if (userinfo) {
        state.isLogin = true
        // 获取购物车数据.
        store.dispatch('updateCart')
      }
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      });
      const { data } = await getProductsAtLeast()
      state.productinfo = data.list
      state.loading = false
      Toast.clear()
    })

    nextTick(() => {
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
      })
    })

    const goToDetail = (item) => {
      router.push({ path: `/product/${item.productId}` })
    }

    const tips = () => {
      Toast('敬请期待');
    }

    return {
      ...toRefs(state),
      goToDetail,
      tips
    }
  },
}
</script>

<style lang="less" scoped >
  @import '../common/style/mixin';
    .home-header {
      position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      .nbmenu2 {
        color: @primary;
      }
      &.active {
        background: @primary;
        .nbmenu2 {
          color: #fff;
        }
        .login {
          color: #fff;
        }
        .sellerLogin {
          color: #fff;
        }
      }

      .header-search {
          display: flex;
          .wh(64%, 20px);
          line-height: 20px;
          margin: 10px 0;
          padding: 5px 0;
          color: #232326;
          background: rgba(255, 255, 255, .7);
          border-radius: 20px;
          .app-name {
              padding: 0 10px;
              color: @primary;
              font-size: 20px;
              font-weight: bold;
              border-right: 1px solid #666;
          }
          .icon-search {
              padding: 0 10px;
              font-size: 17px;
          }
          .search-title {
              font-size: 12px;
              color: #666;
              line-height: 21px;
          }
      }
      .icon-iconyonghu{
        color: #fff;
        font-size: 22px;
      }
      .login {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
      .sellerLogin {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
  }
  .category-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 30px;
    position: relative;
    top: 30px;
    div {
      display: flex;
      flex-direction: column;
      width: 20%;
      text-align: center;
      img {
        .wh(36px, 36px);
        margin: 13px auto 8px auto;
      }
    }
  }

 
  .good {
    .good-header {
      background: #f9f9f9;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @primary;
      font-size: 16px;
      font-weight: 500;
    }
    .good-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .good-item {
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1PX solid #e9e9e9;
        padding: 10px 10px;
        img {
          display: block;
          width: 120px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          font-size: 14px;
          padding: 10px 0;
          // .title {
          //   color: #222333;
          // }
          // .price {
          //   color: @primary;
          // }
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
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

  .floor-list {
      width: 100%;
      padding-bottom: 50px;
      .floor-head {
        width: 100%;
        height: 40px;
        background: #F6F6F6;
      }
      .floor-content {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        width: 100%;
        .boxSizing();
        .floor-category {
          width: 50%;
          padding: 10px;
          border-right: 1px solid #dcdcdc;
          border-bottom: 1px solid #dcdcdc;
          .boxSizing();
          &:nth-child(2n) {
            border-right: none;
          }
          p {
            font-size: 17px;
            color: #333;
            &:nth-child(2) {
              padding: 5px 0;
              font-size: 13px;
              color: @primary;
            }
          }
          .floor-products {
            .fj();
            width: 100%;
            img {
              .wh(65px, 65px);
            }
          }
          
      }
    }
  }
}
</style>