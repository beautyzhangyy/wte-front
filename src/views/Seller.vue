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
  <div class="seller-box">
    <s-header :name="'我的'"></s-header>
    <van-skeleton title :avatar="true" :row="3" :loading="loading">
      <div class="seller-info">
        <div class="info">
          <img :src=imgURL />
          <div class="seller-desc">
            <span>店名：{{ seller.storeName }}</span>
            <span>电话号码：{{ seller.sellerPhoneNum }}</span>
            <span>营业时间：{{ seller.sellTime }}</span>
            <span>营业许可证：{{ seller.storeLicence }}</span>
            <span class="name">店铺地址：{{ seller.sellerAddress }}</span>
          </div>
        </div>
      </div>
    </van-skeleton>
   <ul class="seller-list">
    <!--
      <li class="van-hairline--bottom" @click="goTo('/order')">
      <span>订单管理</span>
      <van-icon name="arrow" />
      </li>
      -->
      <li class="van-hairline--bottom" @click="goTo('/sellerSetting')">
        <span>账号管理</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/product')">
        <span>菜品管理</span>
        <van-icon name="arrow" />
      </li>
    </ul>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import navBar from '@/components/NavBar'
import sHeader from '@/components/SimpleHeader'
import { useRouter } from 'vue-router'
import { getLocal, genImgURL } from '@/common/js/utils'

export default {
  components: {
    navBar,
    sHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      seller: {},
      imgURL: '',
      loading: true
    })

    onMounted(() => {
      state.seller = JSON.parse(getLocal('sellerinfo'))
      state.imgURL = state.seller.sellerHeadPic ? genImgURL(state.seller.sellerHeadPic) : "https://s.yezgea02.com/1604040746310/aaaddd.png"
      state.loading = false
    })

    const goBack = () => {
      router.go(-1)
    }

    const goTo = (r, query) => {
      router.push({ path: r, query: query || {} })
    }

    return {
      ...toRefs(state),
      goBack,
      goTo
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .seller-box {
    .seller-header {
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
      .seller-name {
        font-size: 14px;
      }
    }
    .seller-info {
      width: 94%;
      margin: 10px;
      height: 155px;
      background: linear-gradient(90deg, @primary, #51c7c7);
      box-shadow: 0 2px 5px #269090;
      border-radius: 6px;
      .info {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 30px 20px;
        .boxSizing();
        img {
          .wh(90px, 90px);
          border-radius: 50%;
          margin-top: 4px;
        }
        .seller-desc {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          line-height: 20px;
          font-size: 14px;
          color: #fff;
          span {
            color: #fff;
            font-size: 14px;
            padding: 2px 0;
          }
        }
        .account-setting {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 13px;
          color: #fff;
          .van-icon-setting-o {
            font-size: 16px;
            vertical-align: -3px;
            margin-right: 4px;
          }
        }
      }
    }
    .seller-list {
      padding: 0 20px;
      margin-top: 20px;
      li {
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .van-icon-arrow {
          margin-top: 13px;
        }
      }
    }
  }
</style>