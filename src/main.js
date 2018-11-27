import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import TopHeader from "./components/TopHeader/TopHeader"
//全局注册头部组件
Vue.component("TopHeader",TopHeader);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
});
