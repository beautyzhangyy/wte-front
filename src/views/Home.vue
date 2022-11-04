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
      <van-skeleton title :row="1" :loading="loading"></van-skeleton>
      <header class="good-header">商品展示</header>
      <van-skeleton title :row="0" :loading="loading"></van-skeleton>
      <img class="good1" src="https://img95.699pic.com/element/40132/8910.png_300.png!/fw/431/clip/0x300a0a0" alt="">
      <p class="product1">菜名1<br/>价格1<br/>介绍1<br/>库存1</p>
      <router-link class="show1" tag="span" to="./login" v-if="!isLogin"><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">   </router-link>
      <router-link class="show1" tag="span" to="./cart" v-else><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt=""></router-link>
    
      <van-skeleton title :row="0" :loading="loading"></van-skeleton>
      <img class="good2" src="https://img95.699pic.com/element/40132/8910.png_300.png!/fw/431/clip/0x300a0a0" alt="">
      <p class="product2">菜名2<br/>价格2<br/>介绍2<br/>库存2</p>
      <router-link class="show2" tag="span" to="./login" v-if="!isLogin"><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">   </router-link>
      <router-link class="show2" tag="span" to="./cart" v-else><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt=""></router-link>
   
      <van-skeleton title :row="0" :loading="loading"></van-skeleton>
      <img class="good3" src="https://img95.699pic.com/element/40132/8910.png_300.png!/fw/431/clip/0x300a0a0" alt="">
      <p class="product3">菜名3<br/>价格3<br/>介绍3<br/>库存3</p>
      <router-link class="show3" tag="span" to="./login" v-if="!isLogin"><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">   </router-link>
      <router-link class="show3" tag="span" to="./cart" v-else><img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt=""></router-link>
 
    </div>

    
<!--
    <div class="good" :style="{ paddingBottom: '100px'}">
      <header class="good-header">最新推荐</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in recommends" :key="item.goodsId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
-->
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
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
      newGoodses: [],
      recommends: [],
      categoryList: [
        {
          name: '新蜂超市',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
          categoryId: 100001
        }, {
          name: '新蜂服饰',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
          categoryId: 100003
        }, {
          name: '全球购',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
          categoryId: 100002
        }, {
          name: '新蜂生鲜',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
          categoryId: 100004
        }, {
          name: '新蜂到家',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
          categoryId: 100005
        }, {
          name: '充值缴费',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
          categoryId: 100006
        }, {
          name: '9.9元拼',
          imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
          categoryId: 100007
        }, {
          name: '领劵',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
          categoryId: 100008
        }, {
          name: '省钱',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
          categoryId: 100009
        }, {
          name: '全部',
          imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
          categoryId: 100010
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
      const { data } = await getHome()
      state.swiperList = data.carousels
      state.newGoodses = data.newGoodses
      state.hots = data.hotGoodses
      state.recommends = data.recommendGoodses
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
      router.push({ path: `/product/${item.goodsId}` })
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
<!-- <style lang="scss" scoped>

  .good1{
      width: 10px;
        height: 10px;
        display: block;
        margin: 80px auto 20px;
    }


</style> -->
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
    padding-bottom: 13px;
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
    .good1 {
      width: 150px;
      height: 150px;
      vertical-align: top;
      margin-right:20px ;
    }
    .product1 {
      line-height: 250%;
      font-size: 12px;
      display: inline-block;
      margin-right:600px ;
    }
    // .product_price1 {
      
    //   margin-left:160px
    //   // display: inline-block;
    // // vertical-align: middle;
    // // padding: 20px 0;
    //       // vertical-align: -3px;
    //       // margin-right:200px ;
    // }
    // .product_intro1 {
    //   margin-left:743px
    // //   display: inline-block;
    // // vertical-align: middle;
    // // padding: 20px 0;
    //       // vertical-align: -3px;
    //       // margin-right:200px ;
    // }
    // .product_inventory1 {
    //   display: inline-block;
    // vertical-align: middle;
    // padding: 20px 0;
    // margin-right:650px ;
    // //       vertical-align: -3px;
    // //       margin-right:200px ;
    // }
    .show1 {
        color: @primary;
        line-height: 52px;
        .shopping {
          width: 100px;
          height: 100px;
          vertical-align: -3px;
        }
      }
    .good2 {
      width: 150px;
      height: 150px;
      vertical-align: top;
      margin-right:20px ;
    }
    .product2 {
      line-height: 250%;
      font-size: 12px;
      display: inline-block;
      margin-right:600px ;
    }
    .show2{
        color: @primary;
        line-height: 52px;
        .shopping {
          width: 100px;
          height: 100px;
          vertical-align: -3px;
        }
      }
    .good3 {
      width: 150px;
      height: 150px;
      vertical-align: top;
      margin-right:20px ;
    }
    .product3 {
      line-height: 250%;
      font-size: 12px;
      display: inline-block;
      margin-right:600px ;
    }
    .show3{
        color: @primary;
        line-height: 52px;
        .shopping {
          width: 100px;
          height: 100px;
          vertical-align: -3px;
        }
      }
  
    // good2{
    //   left: 0;
    //   width: 100px;
    //   height: 100px;
    //   display: block;
    //   margin: 80px auto 20px;
    // }
    // .good-box {
    //   display: flex;
    //   justify-content: flex-start;
    //   flex-wrap: wrap;

      
      
      // .good-item {
      //   box-sizing: border-box;
      //   width: 50%;
      //   border-bottom: 1PX solid #e9e9e9;
      //   padding: 10px 10px;
      //   img {
      //     display: block;
      //     width: 120px;
      //     margin: 0 auto;
      //   }
        
      //   .good-desc {
      //     text-align: center;
      //     font-size: 14px;
      //     padding: 10px 0;
      //     .title {
      //       color: #222333;
      //     }
      //     .price {
      //       color: @primary;
      //     }
      //   }
      //   &:nth-child(2n + 1) {
      //     border-right: 1PX solid #e9e9e9;
      //   }
      // }
    // }
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
</style>