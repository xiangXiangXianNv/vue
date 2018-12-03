<template>
  <div id="app">
    <router-view></router-view>
    <FootGuide v-show="$route.meta.isShow"></FootGuide>
  </div>
</template>
<script>
  import FootGuide from "./components/FootGuide/FootGuide"
  import {mapActions} from "vuex"

  export default {
    name: 'App',
    components:{
      FootGuide
    },
    /*请求地址信息到状态中,便于home组件读取显示*/
    mounted(){
      this.$store.dispatch("getAddress");
      /*发送请求实现根据会话自动登陆*/
      this.$store.dispatch("getUser");
    }
    /*methods:{
      ...mapActions(['getAddress'])
    },
    mounted(){
      this.getAddress();
    }*/
  }
</script>

<style lang="stylus">

</style>
