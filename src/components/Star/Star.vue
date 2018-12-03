<template>
  <div class="star" :class="`star-${size}`">
    <span class="star-item" v-for="starClass in starClassList" :class="starClass"></span>
  </div>
</template>

<script>
    export default {
        name: "star",
        //props只是声明接收外部传入的数据,最终数据会绑给组件对象
        props:{
          size:Number,
          score:Number
        },
        computed:{
          starClassList(){
            const starClassArr = [];
            const {score} = this;
          /*
          * on类名有n个  根据整数部分
          * half有 0/1 个 根据小数部分是否大于0.5
          * off有n个  根据starClassArr的长度是否为5
          * */
            //on类名有n个  根据整数部分
            const integerNum = Math.floor(score);
            for(let i = 0; i < integerNum; i++){
                starClassArr.push("on")
            }
            //half有 0/1 个 根据小数部分是否大于0.5
            if(score*10-integerNum*10 > 5){
               starClassArr.push("half")
            }
            //off有n个  根据最后的长度
            while(starClassArr.length < 5){
              starClassArr.push("off");
            }
            return starClassArr;
          }
        }
    }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/stars/star48_on')
        &.half
          bg-image('./images/stars/star48_half')
        &.off
          bg-image('./images/stars/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star36_on')
        &.half
          bg-image('./images/stars/star36_half')
        &.off
          bg-image('./images/stars/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star24_on')
        &.half
          bg-image('./images/stars/star24_half')
        &.off
          bg-image('./images/stars/star24_off')
</style>
