export default {
  //计算购物车的总价格
  totalPrice(state){
    const {foods} = state;
    const price = foods.reduce((pre,food)=>{
      return pre+food.price*food.count
    },0);
    return price
  },
  //计算购物车的总数量
  totalCount(state){
    const {foods} = state;
    const count = foods.reduce((pre,food)=>{
      return pre+food.count
    },0);
    return count
  },
  //计算评价的总数量
  totalRatingsCount(state){
    return state.ratings.length;
  },
  //计算评价中好评的总数量
  totalRatingsGoodCount(state){
    const {ratings} = state;
    return ratings.reduce((pre,rating)=>{
      return pre+(rating.rateType===0?1:0)
    },0)
  }
}
