import Home from "../pages/Home/Home"
import Order from "../pages/Order/Order"
import Search from "../pages/Search/Search"
import Profile from "../pages/Profile/Profile"
import Login from "../pages/Login/Login"
export default [
  {
    path: '/login',
    component: Login
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
    path: '/',
    redirect: '/home'
  },
]
