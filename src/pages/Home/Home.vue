<template>
  <section class="msite">
    <!--首页头部全局组件-->
    <TopHeader :title="address.name">
      <span class="header_search" slot="left">
        <i class="iconfont icon-sousuo"></i>
      </span>
      <span class="header_login" slot="right">
        <span class="header_login_text">登录|注册</span>
      </span>
    </TopHeader>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categorys.length>0">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category,index) in categorys" :key="index">
              <div class="food_container">
                <img :src="'https://fuss10.elemecdn.com'+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="loading" v-else>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <!--商家列表显示组件-->
      <ShopList></ShopList>
    </div>
  </section>
</template>

<script>
    import ShopList from "../../components/ShopList/ShopList"
    import {mapState,mapActions} from "vuex"
    import "swiper/dist/css/swiper.min.css"
    import Swiper from "swiper"

    export default {
        name: "home",
        components:{
          ShopList
        },
        computed:{
          ...mapState(["address","categorys"]),
          /*因为后台传递过来的数据是一个数组中存储n个对象
          * 但是轮播图的最终效果是每一页是一个swiper-slide,每个swiper-slide中又分为多个小图标文字
          * 所有要将后台数据一维数组裁成二维数组,而二维数组中的小数组的对象个数根据一页显示多少个元素有关
          * */
          categorysArr(){
            //拿到后台一维数组
            const categorys = this.categorys;
            //创建一个空的二维大数组
            const bigArr = [];
            //创建一个空的小数组
            let smallArr = [];
            //遍历一维数组
            categorys.forEach((category)=>{
              //将小数组添加到大数组中,但是每一个小数组只添加一次
              if(smallArr.length===0){
                bigArr.push(smallArr)
              }
              //将每一个对象添加到小数组中
              smallArr.push(category);
              //限制小数组的length
              if(smallArr.length===8){
                smallArr=[]
              }
            });
            /*console.log("---");*/
            return bigArr;
          }
         /*
            切片方法
            categorysArr(){
            const categorys = this.categorys;
            const arr = categorys.concat();
            const SLICENUM = 8;
            let num = SLICENUM;
            let bigArr = [];
            while(arr.length){
              bigArr.push(arr.slice(0,num));
              arr.splice(0,num);
              if(arr.length>SLICENUM){
                num=SLICENUM;
              }else{
                num=arr.length;
              }
            }
            return bigArr;
          }*/
        },
        mounted(){
          //每次都会重新发送请求,因为组件只要切换出去就会被销毁
          /*获取商家列表到状态中,让ShopList组件读取显示*/
          this.$store.dispatch("getShops");
          /*获取食品分类列表到状态中,让Home组件swiper读取显示*/
          this.$store.dispatch("getCategorys");
        },
        watch:{
          categorys(){
            //swiper必须在界面上已经存在了元素列表数据后,才会出现轮播的效果
            /*在修改数据之后立即使用它(this.$nextTick),将回调延迟到下次 DOM 更新循环之后执行。*/
            this.$nextTick(()=>{
              new Swiper(".swiper-container",{
                loop: true, // 循环模式选项
                // 如果需要分页器
                pagination: {
                  el: '.swiper-pagination',
                },
                autoplay: true,
                delay : 400
              })
            })
          }
        }

    }


    /*methods:{
       ...mapActions(['getAddress'])
     },
     mounted(){
       this.getAddress();
     }*/
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/mixins.styl"
  .msite
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
