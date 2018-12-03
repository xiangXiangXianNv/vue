<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggle">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount>0}">
              <i class="iconfont icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price highlight">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>
      <div class="shopcart-list" v-show="isShow && count">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="clear">清空</span>
        </div>
        <div class="list-content">
          <ul>
            <li class="food" v-for="(food,index) in foods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price"><span>￥{{food.price}}</span></div>
              <div class="cartcontrol-wrapper">
                <CartControl :food="food"></CartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="list-mask" v-show="isShow && count" @click="toggle"></div>
  </div>
</template>

<script>
    import {mapState,mapGetters} from "vuex";
    import CartControl from "../CartControl/CartControl"
    import BScroll from "better-scroll"
    import {MessageBox} from "mint-ui"
    export default {
        name: "shop-cart",
        data(){
          return {
            isShow:false
          }
        },
        computed:{
          ...mapState(["foods","info"]),
          ...mapGetters(['totalPrice','totalCount']),
          count(){
            //当列表要显示之后就去创建滚动
            if(this.isShow){
              this.$nextTick(()=>{
                //解决创建多个的bug
                if(!this.scroll){
                  this.scroll = new BScroll('.list-content',{
                      click:true
                  })
                }else{
                  //已经创建了就不需要重新创建,只需要重新计算要不要滚动
                  this.scroll.refresh();
                  //刷新的时候不会重新添加style样式,所以在使用判断的时候必须使用v-show
                  /*因为使用v-if会删除整个节点,ul的style就不存在了*/
                }
              });
            }
            if(this.foods.length===0){
              //清空购物车的时候此时isShow还是为true,而点击+后this.foods.length为true就会导致自动打开列表了
              //所以要把isShow置为false
              this.isShow = false;
              return false;
            }else{
              return true
            }
          },
          payClass(){
            const {totalPrice} = this;
            const {minPrice} = this.info;
            if(totalPrice<minPrice){
              return 'not-enough'
            }else{
              return 'enough'
            }
          },
          payText(){
            const {totalPrice} = this;
            const {minPrice} = this.info;
            if(totalPrice===0){
              return `￥${minPrice}元起送`
            }else if(totalPrice<minPrice){
              return `还差￥${minPrice-totalPrice}元起送`
            }else{
              return '去结算'
            }
          }
        },
        methods:{
          toggle(){
            //如果foods中没有数据的话就不改变isShow的值,
            // 解决点击购物车区域后变成true,然后再点击+就会自动出现列表区域
            if(this.foods.length){
              this.isShow = !this.isShow;
            }
          },
          clear(){
            MessageBox.confirm('你确定要清空吗?').then(()=>{
              this.$store.dispatch("clear")
            });

          }
        },
        components:{
          CartControl
        }
    }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: $green
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translateY(-100%)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
</style>
