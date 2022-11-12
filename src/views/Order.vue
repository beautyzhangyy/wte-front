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
  <div class="order-box">
    <s-header :name="'我的订单'" :back="'/user'"></s-header>
    <van-tabs @click="onChangeTab" :color="'#1baeae'" :title-active-color="'#1baeae'" class="order-tab" v-model="status">
      <van-tab title="全部" name=''></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
        >
          <div v-for="item in orderinfo" :key="item.orderId" class="order-item-box" @click="goTo(item.orderNo)">
            <div class="order-item-header">
            </div>
            <van-card
              :key="item.orderId"
              :num="item.num"
              :price="item.productPrice"
              :title="item.productName"
              :thumb="imgRootUrl+item.productSPic"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import sHeader from '@/components/SimpleHeader'
import { getOrderProductsList } from '@/service/order'
import { useRouter } from 'vue-router';
import { getLocal } from '../common/js/utils'

export default {
  name: 'Order',
  components: {
    sHeader
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      status: '',
      loading: false,
      finished: false,
      refreshing: false,
      imgRootUrl : 'http://localhost:8081',
      orderinfo: [],
      page: 1,
      totalPage: 0
    })

    const loadData = async () => {
      state.user = JSON.parse(getLocal('userinfo'))
      const { data } = await getOrderProductsList({params:{"userId":state.user.userId}})
      state.orderinfo = data.list
      state.totalPage = data.totalPage
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true
    }

    const onChangeTab = (name) => {
      // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
      state.status = name
      onRefresh()
    }

    const goTo = (id) => {
      router.push({ path: '/order-detail', query: { id } })
    }

    const goBack = () => {
      router.go(-1)
    }

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        console.log(state.page)
        console.log(state.totalPage)
        state.page = state.page + 1
      }
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      loadData()
    }

    const onRefresh = () => {
      state.refreshing = true
      state.finished = false
      state.loading = true
      state.page = 1
      onLoad()
    }

    return {
      ...toRefs(state),
      onChangeTab,
      goTo,
      goBack,
      onLoad,
      onRefresh
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .order-box {
    .order-header {
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
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .skeleton {
      margin-top: 60px;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 34px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>
