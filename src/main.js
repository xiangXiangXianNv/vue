import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import TopHeader from "./components/TopHeader/TopHeader"
import {Button} from "mint-ui"
import VueLazyload from 'vue-lazyload'
import loading from "./common/images/loading.gif"

import "./mock/mackServer"
import "./filters"

//全局注册头部组件
Vue.component("TopHeader",TopHeader);
Vue.component(Button.name,Button);
Vue.config.productionTip = false;
Vue.use(VueLazyload,{
  loading
});
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store
});
