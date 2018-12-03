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
  CLEAR_FOOD
} from "./mutation-types"
import Vue from "vue"
export default {
  [RECEIVE_ADDRESS](state,{address}){
    state.address = address;
  },
  [RECEIVE_CATEGORYS](state,{categorys}){
    state.categorys = categorys;
  },
  [RECEIVE_SHOPS](state,{shops}){
    state.shops = shops;
  },
  [RECEIVE_USER](state,{user}){
    state.user = user;
  },
  [RESET_USER](state){
    state.user = {};
  },
  [RECEIVE_GOODS](state,{goods}){
    state.goods=goods
  },
  [RECEIVE_RATINGS](state,{ratings}){
    state.ratings=ratings
  },
  [RECEIVE_INFO](state,{info}){
    state.info=info
  },
  [INCREMENT_FOOD_COUNT](state,{food}){
    if(!food.count){
      //因为给状态数据添加一个新增的属性,默认不会有响应式,就是更新了数据界面不会更新,使用set给该属性添加响应式
      Vue.set(food,"count",1);
      /*证明此food已经有了count属性,将该food添加到foods中*/
      state.foods.push(food);

      /*if(newName){
        state.gds.push({name:newName,foods:state.foods});
        localStorage.setItem('gds',JSON.stringify(state.gds));
      }*/

    }else{
      food.count++;
      /*if(newName){
        const gds = JSON.parse(localStorage.getItem('gds'));
        gds.forEach((obj,index)=>{
          for(let i = 0; i < obj.foods.length; i++){
            obj.foods[i].name === food.name;
            obj.foods[i] = food;
          }
        });
        state.gds = gds;
        localStorage.setItem('gds',JSON.stringify(gds));
      }
      */
    }
  },
  [DECREMENT_FOOD_COUNT](state,{food,newName}){
    if(food.count){
      food.count--;
      if(food.count===0){
        /*如果food中的count为0了,就要从foods中移除food*/
        state.foods.splice(state.foods.indexOf(food),1);

        /*if(newName){
          const gds = JSON.parse(localStorage.getItem('gds'));
          gds.forEach((obj,index)=>{
            for(let i = 0; i < obj.foods.length; i++){
              obj.foods[i].name === food.name;
              obj.foods[i] = food;
            }
          });
          state.gds = gds;
          localStorage.setItem('gds',JSON.stringify(gds));
        }*/
      }
    }
  },
  [CLEAR_FOOD](state){
    //解决清空后页面上的右侧列表的购物车选项的count值还存在,一直在显示的bug
    /*foods中的food与右侧显示列表中的food是同一个地址*/
    state.foods.forEach((food)=>{
      food.count = 0
    });
    state.foods=[];
  },
  /*update(state,{i,j}){
    const gds = JSON.parse(localStorage.getItem('gds'));
    const {goods} = state;
    const foodsI = goods[i].foods;
    const foodsJ = gds[j].foods;
    for(let i = 0; i < foodsI.length; i++){
        for(let j = 0; j < foodsJ.length; j++){
            if(foodsI[i].name===foodsJ[j].name){
                foodsI[i] = foodsJ[j];
            }
        }
    }
  }*/
}
