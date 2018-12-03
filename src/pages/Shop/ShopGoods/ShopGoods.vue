<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul ref="menuUl">
          <!--current-->
          <li class="menu-item"
              v-for="(good,index) in goods"
              :key="index"
              :class="{current:currentIndex===index}"
              @click="selectItem(index)"
          >
           <!--:class="{current:currentIndex===index}"-->
            <span class="text bottom-border-1px">
               <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUl">
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px"
                  v-for="(food,index) in good.foods"
                  :key="index"
                  @click="showFood(food)"
              >
                <div class="icon">
                  <img width="57" height="57"
                       :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food" ></CartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart></ShopCart>
    </div>
    <Food :food="food" ref="foodRef"></Food>
  </div>
</template>

<script>
  /*
      1. 滑动右侧列表, 可能需要更新左侧当前分类项
      2. 点击左侧某个分类项, 右侧列表滑动到对应的位置
      3. 保存当前分类项始终可见

      当前分类的下标: currentIndex
      右侧列表滑动的Y轴坐标: scrollY  ==> 在右侧滑动时实时的改变
      右侧列表中所有分类li的top值: tops  ==> 列表显示之后统计

      更新状态数据==>调用监视回调 ==> 异步更新界面
  */
    import BScroll from 'better-scroll'
    import {mapState} from "vuex"
    import CartControl from "../../../components/CartControl/CartControl"
    import Food from "../../../components/Food/Food"
    import ShopCart from "../../../components/ShopCart/ShopCart"
    export default {
        name: "shop-goods",
        mounted(){
          this.$store.dispatch("getGoods",()=>{
            this.$nextTick(()=>{
              this._initScroll();  //加一 个_代表不是事件回调
              this._initTops();
              //this._local()
            })
          });
        },
        data(){
          return {
            food : {},   //初始化food数据,每次点击往food更新新的内容
            tops:[],  //当前右侧列表所有li的高度
            scrollY:0, //滚动的y轴的距离,
          }
        },
        computed:{
          ...mapState(["goods"]),
          currentIndex(){
            //根据tops和scrollY算出当前的index
            const {tops,scrollY} = this;
            const index = tops.findIndex((top,index)=>{
              //scrollY与top相比较,如果在top数组的当前一个与下一个之间就返回当前一个的索引
              if(scrollY>=top&&scrollY<tops[index+1]){
                return true
              }
            });
            //将本次index值与上一次的index值作比较,如果不同则代表滚动了,左侧必须实时滚动到对应位置
            /*实现保证能在可视区域看见当前选定的menu*/
            if(index!==this.index && this.menuScroll){
              this.index=index;
              //scrollToElement会尽量使当前元素靠最顶部显示
              this.menuScroll.scrollToElement(this.$refs.menuUl.children[index],500)
            }
            return index;
          }
        },
        methods:{
          _initScroll(){
            this.menuScroll = new BScroll('.menu-wrapper',{
              //better-scroll内部会阻止原生click事件,需要配置click为true后就会为对应的绑定了dom派发一个click事件
              click : true
            });
            this.foodsScroll = new BScroll('.foods-wrapper',{
              click : true,
              probeType : 1
            });
            //绑定滚动时的监听,实时监控滚动的y值坐标放入状态的scrollY中
            this.foodsScroll.on("scroll",({x,y})=>{
              this.scrollY = Math.abs(y);
            });
            //绑定滚动结束的监听,将滚动最后的y值存入状态的scrollY中
            this.foodsScroll.on("scrollEnd",({x,y})=>{
              this.scrollY = Math.abs(y);
            })
          },
          showFood(food){
            /*更新状态中的数据food*/
            this.food = food;
            /*每次点击要显示food*/
            /*拿到组件标签对象,相当于拿到组件对象,相当于是父组件调用子组件内部的方法*/
            this.$refs.foodRef.toggleFood()
          },
          _initTops(){
            const tops = [];
            let top = 0;
            tops.push(top);
            const elementC = this.$refs.foodsUl.children;
            Array.prototype.slice.call(elementC).forEach((li)=>{
              top += li.offsetHeight;
              tops.push(top);
            });
            this.tops = tops;
          },
          selectItem(index){
            const height = this.tops[index];
            const x = 0;
            const y = -height;

            /*实现只要一按下就更改状态值scrollY,立即计算currentIndex的值,保证左侧能实施响应*/
            this.scrollY = height;

            /*虽然两个地方都进行改变scrollY,但是计算属性是有缓存的,只要没有改变对应关联的值就会使用缓存*/
            //让右侧foodsScroll滚动到响应位置
            this.foodsScroll.scrollTo(x,y,300)

            /*
            因为使用scrollTo的时候滚动了foodsScorll,最终触发scrollEnd的执行,
            在scrollEnd的内部改变了scrollY的值,所以左侧的currentIndex值改变了
             */
          },
         /* _local(){
            const gds = JSON.parse(localStorage.getItem('gds'));
            const {goods} = this;
            for(let i = 0; i < goods.length; i++){
              for(let j = 0; j <gds .length; j++){
                if( goods[i].name === gds[j].name){
                    this.$store.dispatch('updateGoods',{i:i,j:j})
                }
              }
            }
          }*/
        },
        components:{
          CartControl,
          Food,
          ShopCart
        }
    }
</script>

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 225px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
