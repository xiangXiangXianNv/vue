import Mock from "mockjs"
import data from "./data.json"  //webpack打包时会自动解析为js中的(对象)
Mock.mock('/goods',{
  code:0,
  data:data.goods
});
Mock.mock('/ratings',{
  code:0,
  data:data.ratings
});
Mock.mock('/info',{
  code:0,
  data:data.info
});

