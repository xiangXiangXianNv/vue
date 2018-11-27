/*
* 包含n个接口函数的模块,专门去调用ajax发送请求
* 返回值是一个promise对象
* */
import ajax from "./ajax"
const BASE = "/api";
/*latitude纬度  longitude经度*/
// 1、根据经纬度获取位置详情
export const reqAddress = (latitude,longitude) => {
  return ajax(BASE+`/position/${latitude},${longitude}`)
};
// 2、获取食品分类列表
export const reqFoodList = ()=>{
  return ajax(BASE+'/index_category')
};
// 3、根据经纬度获取商铺列表
export const reqShopList = (latitude,longitude)=>{
  return ajax(BASE+'/shops',{latitude,longitude})
};


