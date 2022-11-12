<template>
    <div class="product-box">
      <s-header :name="'菜品管理'"></s-header>
      <nav-bar></nav-bar>
    </div>
  <div>
    <div class="good">
        <div class="good-box">
          <div class="good-item" v-for="item in productinfo" :key="item.productId" @click="goToManage(item)">
            <img :src="imgRootUrl+item.productSPic" alt="">
            <div class="good-desc">
              <span>菜名: {{ item.productName }}</span><p></p>
              <span>价格：{{ item.productPrice }}</span><p></p>
              <span>介绍：{{ item.productIntro }}</span><p></p>
              <span>库存：{{ item.productInventory }}</span><p></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>

<script>
import { reactive, onMounted, toRefs} from 'vue'
import sHeader from '@/components/SimpleHeader'
import { useRouter } from 'vue-router'
import navBar from '@/components/NavBar'
import { getProductsSellerList } from '@/service/product'
import { Toast } from 'vant'
import { getLocal } from '../common/js/utils'
export default {
  setup() {
    const router = useRouter()
    const state = reactive({
      productinfo: [],
      imgRootUrl : 'http://localhost:8081',
    })

    onMounted(async () => {
      state.seller = JSON.parse(getLocal('sellerinfo'))
      const { data } = await getProductsSellerList({params:{
        "sellerId":state.seller.sellerId
      }})
      state.productinfo = data.list
      state.loading = false
      Toast.clear()
    })

    const goToManage = (item) => {
      router.push({ path: `/productUpdate/${item.productId}` })
    }

    const goToDetail = (item) => {
      router.push({ path: `/product/${item.productId}` })
    }

    return {
      ...toRefs(state),
      goToDetail,
      goToManage
    }
  },
  components: {
    navBar,
    sHeader
  }
}
</script>

<style lang="less" scoped >
  @import '../common/style/mixin';
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
        .save-btn {
        width: 120px;
        height: 90px;
        margin: 20px auto ;
      }
        img {
          display: block;
          width: 120px;
          height: 90px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          line-height: 3px;
          font-size: 10px;
          padding: 10px ;
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
  }
}
</style>