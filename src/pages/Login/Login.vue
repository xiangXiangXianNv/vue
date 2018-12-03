<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay===1}" @click="loginWay=1">短信登录</a>
          <a href="javascript:;" :class="{on:loginWay===2}" @click="loginWay=2">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:loginWay===1}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <!--disabled为false的时候就可以点击,如果为true就不能进行操作,号码是正确或者是时间等于0s就可以点击-->
              <!--remainingTime为0的时候可以点击,返回false就可以点击,remainingTime为大于0就不能点击,返回true就不能点击-->
              <button :disabled="!isRightPhone || remainingTime > 0"
                      class="get_verification"
                      @click.prevent="sendCode"
                      :class="{switchColor:isRightPhone}"
              >
                  {{remainingTime>0?`已发送 ${remainingTime} s`:'获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:loginWay===2}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd?'tel':'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" :class="isShowPwd?'on':'off'" @click="isShowPwd=!isShowPwd">
                  <div class="switch_circle" :class="{on:isShowPwd}"></div>
                  <span class="switch_text" v-show="isShowPwd">123</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img ref="captcha" class="get_verification" src="http://localhost:5000/captcha" alt="captcha" @click="switchCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
  </section>
</template>

<script>
    import {reqSendCode,reqSmsLogin,reqLoginPwd} from "../../api"
    import {Toast,MessageBox} from "mint-ui"
    export default {
        name: "login",
        data(){
          return {
            loginWay : 1,   //用来标识显示短信登陆界面还是密码登陆界面 1标识短信登陆界面, 2标识密码登陆界面
            remainingTime : 0,//用来标识剩余时间,如果时间为0则代表未发送消息,如果大于0则代表正在发送消息
            isShowPwd:false,//用来标识是否显示密码
            phone:"", //短信注册手机号
            code:"",//短信注册验证码
            name:"",//用户名密码注册,用户名
            pwd:"",//用户名密码注册,密码
            captcha:""//用户名密码注册,图片验证码
          }
        },
        computed:{
          //用来判断手机号是否正确
          isRightPhone(){
            return /^1\d{10}$/.test(this.phone)
          }
        },
        methods:{
          //发送验证码时进行计时
          async sendCode(){
            this.remainingTime=30;
            const id = setInterval(()=>{
              this.remainingTime--;
              if(this.remainingTime<=0){
                this.remainingTime=0;
                clearInterval(id);
              }
            },1000);
            //发送请求让后台请求容联发送验证码
            const result = await reqSendCode(this.phone);
            if(result.code===0){  //发送成功,提示文本信息发送信息成功
              Toast('请注意查看手机验证码');
            }else{ //发送失败,警告验证码发送失败
              MessageBox.alert('发送验证码失败');
              this.remainingTime=0
            }
          },
          //切换验证码图片
          switchCaptcha(){
            this.$refs.captcha.src = "http://localhost:5000/captcha?time="+Date.now();
          },
          async login(){
            const {phone,code,name,pwd,captcha,loginWay,isRightPhone} = this;
            let result;
            //1. 进行前台验证  / 分为短信登陆和用户名密码登陆
            if(loginWay===1){  //短信登陆
              if(!isRightPhone){
                MessageBox.alert('请输入正确的手机号码');
              }else if(code.length!==6){
                MessageBox.alert('请输入正确的短信验证码');
              }
              /*2. 发送登陆请求*/
              result = await reqSmsLogin(phone,code);
              if(result.code!==0){
                  /*登陆失败*/
                this.remainingTime=0;
                MessageBox.alert(result.msg);
              }
            }else{  //用户名密码登陆
              if(!name){
                MessageBox.alert('请输入正确的用户名');
              }else if(!pwd){
                MessageBox.alert('请输入密码');
              }else if(captcha.length!==4){
                MessageBox.alert('请输入正确的图形验证码');
              }
              /*2. 发送登陆请求*/
              result = await reqLoginPwd(name,pwd,captcha);
              if(result.code!==0){
                /*登陆失败*/
                //重新刷新图片验证码
                this.switchCaptcha();
                MessageBox.alert(result.msg);
                //console.log("登陆失败")
              }
            }
            if(result.code===0){
              /*登陆成功后将返回的用户信息保存在状态中*/
              const user = result.data;
              this.$store.dispatch("saveUser",user);
              //跳转到个人中心界面
              this.$router.replace("/profile")
            }
          }
        },
        //在进入该组件之前进行控制路由
        beforeRouteEnter(to,from,next){
          next((component)=>{
            if(component.$store.state.user._id){
              //如果已经登陆则去个人中心界面
              //next('/mine')
              next();
            }else{
              next();
            }
          });
        }
    }
</script>

<style scoped lang="stylus">
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.switchColor
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.on
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
