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
export const reqCategorys = ()=>{
  return ajax(BASE+'/index_category')
};
// 3、根据经纬度获取商铺列表
export const reqShops = (latitude,longitude)=>{
  return ajax(BASE+'/shops',{latitude,longitude})
};
// 6、发送短信验证码
export const reqSendCode = (phone)=>{
  return ajax(BASE+'/sendcode',{phone})
};
// 7、用户名密码登陆
export const reqLoginPwd = (name,pwd,captcha)=>{
  return ajax(BASE+'/login_pwd',{name,pwd,captcha},"POST")
};
// 8、手机号验证码登陆
export const reqSmsLogin = (phone,code)=>{
  return ajax(BASE+'/login_sms',{phone,code},"POST")
};
// 9、根据会话获取用户信息
export const getUser = ()=>{
  return ajax(BASE+'/userinfo')
};
// 10、用户登出
export const resetUser = ()=>{
  return ajax(BASE+'/logout')
};
//mock食品数据
export const mockGoods = ()=>{
  return ajax('/goods')
};
//mock评价数据
export const mockRatings = ()=>{
  return ajax('/ratings')
};
//mock商家信息数据
export const mockInfo = ()=>{
  return ajax('/info')
};



