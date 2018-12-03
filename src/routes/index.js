// import Home from "../pages/Home/Home"
// import Order from "../pages/Order/Order"
// import Search from "../pages/Search/Search"
// import Profile from "../pages/Profile/Profile"

const Home = ()=> import('../pages/Home/Home');
const Order = ()=> import('../pages/Order/Order');
const Search = ()=> import('../pages/Search/Search');
const Profile = ()=> import('../pages/Profile/Profile');


import Login from "../pages/Login/Login"
import Shop from "../pages/Shop/Shop"
import ShopGoods from "../pages/Shop/ShopGoods/ShopGoods"
import ShopRatings from "../pages/Shop/ShopRatings/ShopRatings"
import ShopInfo from "../pages/Shop/ShopInfo/ShopInfo"
import Mine from "../pages/Mine/Mine"
export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta:{
      isShow : true
    }
  },
  {
    path: '/order',
    component: Order,
    meta:{
      isShow : true
    }
  },
  {
    path: '/search',
    component: Search,
    meta:{
      isShow : true
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta:{
      isShow : true
    }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/mine',
    component: Mine
  },
  {
    path: '/shop',
    component: Shop,
    children:[
      {
        path:'/shop/goods',
        component:ShopGoods
      },
      {
        path:'/shop/ratings',
        component:ShopRatings
      },
      {
        path:'/shop/info',
        component:ShopInfo
      },
      {
        path:'',
        redirect:'/shop/goods'
      }
    ]
  },

]
