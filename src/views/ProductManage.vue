<template>
    <div class="product-box">
      <s-header :name="'菜品管理'"></s-header>
     <ul class="product-list">
        <li class="van-hairline--bottom" @click="goTo('/productUpload')">
          <span>菜品上传</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom">
          <span>菜品管理</span>
          <van-icon name="arrow" />
        </li>
      </ul>
      <nav-bar></nav-bar>
    </div>
  </template>

<script>
import navBar from '@/components/NavBar'
import sHeader from '@/components/SimpleHeader'
import { useRouter } from 'vue-router'

export default {
  components: {
    navBar,
    sHeader
  },
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.go(-1)
    }

    const goTo = (r, query) => {
      router.push({ path: r, query: query || {} })
    }

    return {
      goBack,
      goTo
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-box {
    .product-list {
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