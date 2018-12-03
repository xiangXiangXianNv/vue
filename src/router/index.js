import Vue from 'vue'
import Router from 'vue-router'
import routes from "../routes"
Vue.use(Router);
const router = new Router({
  routes,
});
/*const pathes = ['/a','/b'];
router.beforeEach((to,from,next)=>{
  if(pathes.indexOf(to.path)>=0){
    console.log('-----')
     next();
  }else{
    console.log('....');
    next();
  }
});*/
export default router;
