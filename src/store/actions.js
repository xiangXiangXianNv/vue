import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_GOODS,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_FOOD,
} from "./mutation-types"
import {
  reqAddress,
  reqCategorys,
  reqShops,
  getUser,
  resetUser,
  mockGoods,
  mockRatings,
  mockInfo
} from "../api"
export default {
  //获取地址信息对象的函数
  async getAddress({commit,state}){
    const {latitude,longitude} = state;
    const result = await reqAddress(latitude,longitude);
    const address = result.data;
    if(result.code===0){
      commit(RECEIVE_ADDRESS,{address})
    }
  },
  //获取食品分类信息对象的函数
  async getCategorys({commit}){
    const result = await reqCategorys();
    const categorys = result.data;
    if(result.code===0){
      commit(RECEIVE_CATEGORYS,{categorys})
    }
  },
  //获取商家信息对象的函数
  async getShops({commit,state}){
    const {latitude,longitude} = state;
    const result = await reqShops(latitude,longitude);
    const shops = result.data;
    if(result.code===0){
      commit(RECEIVE_SHOPS,{shops})
    }
  },
  //保存用户信息的函数(同步)
  saveUser({commit},user){
    commit(RECEIVE_USER,{user})
  },
  //发送请求获取用户信息
  async getUser({commit}){
    const result  = await getUser();
    const user = result.data;
    if(result.code===0) {
      commit(RECEIVE_USER, {user});
    }
  },
  //用户登出
  async logout({commit}){
    const result = await resetUser();
    if(result.code===0){
      commit(RESET_USER)
    }
  },
  //获取食品数据
  async getGoods({commit},fn){
    const result = await mockGoods();
    const goods = result.data;
    if(result.code===0){
      commit(RECEIVE_GOODS,{goods});
      typeof fn==='function' && fn();
    }
  },
  //获取评价数据
  async getRatings({commit},fn){
    const result = await mockRatings();
    const ratings = result.data;
    if(result.code===0){
      commit(RECEIVE_RATINGS,{ratings});
      typeof fn==='function' && fn();
    }
  },
  //获取商家信息数据
  async getInfo({commit}){
    const result = await mockInfo();
    const info = result.data;
    if(result.code===0){
      commit(RECEIVE_INFO,{info})
    }
  },
  //更新food中的count数据
  updateFoodCount({commit},{isAdd,food,newName}){
    if(isAdd){  //加1
      commit(INCREMENT_FOOD_COUNT,{food,newName})
    }else{ //减1
      commit(DECREMENT_FOOD_COUNT,{food,newName})
    }
  },
  //清空foods
  clear({commit}){
    commit(CLEAR_FOOD)
  },
 /* updateGoods({commit,state},{i,j}){
    commit('update',{i,j})
  }*/
}
