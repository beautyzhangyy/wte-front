<template>
    <div class="product-box">
      <s-header :name="'分类'"></s-header>
      <nav-bar></nav-bar>
    </div>
    <div>
      <div class="good">
          <div class="good-box">
            <div class="good-item" v-for="item in productinfo" :key="item.productId">
              <img :src="imgRootUrl+item.productSPic" alt="">
              <div class="good-desc">
                <span>菜名: {{ item.productName }}</span><p></p>
                <span>价格：{{ item.productPrice }}</span><p></p>
                <span>介绍：{{ item.productIntro }}</span><p></p>
                <span>库存：{{ item.productInventory }}</span><p></p>
                卖家：{{ item.storeName }}<p></p>
                <div class="show1" @click="addToCart(item)">
                <img class="shopping" src="https://img.51miz.com/Element/00/37/55/19/01eb7699_E375519_856bb272.png" alt="">
              </div>
              </div>
            </div>
          </div>
      </div>
      </div>
  </template>

<script>
import { reactive, onMounted, toRefs} from 'vue'
import sHeader from '@/components/SimpleHeader'
import { useRouter,useRoute } from 'vue-router'
import navBar from '@/components/NavBar'
import { getProductsCategory } from '@/service/product'
import { Toast } from 'vant'
import { getLocal } from '../common/js/utils'
import { addCart } from '../service/cart'
import { useStore  } from 'vuex'
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      productinfo: [],
      imgRootUrl : 'http://localhost:8081',
    })

    onMounted(async () => {
      const userinfo = getLocal('userinfo')
      if (userinfo) {
        state.isLogin = true
        // 获取购物车数据.
        store.dispatch('updateCart')
      }
      const { id } = route.params
      const { data } = await getProductsCategory({params:{
        "productCategory":id
      }})
      state.productinfo = data.list
      state.loading = false
      Toast.clear()
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


    const goToDetail = (item) => {
      router.push({ path: `/product/${item.productId}` })
    }

    return {
      ...toRefs(state),
      goToDetail,
      addToCart
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
          line-height: 6px;
          font-size: 10px;
          padding: 10px 0px 10px 20px;
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
  }
}
</style>