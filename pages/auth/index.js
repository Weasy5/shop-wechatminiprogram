import { login } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户信息
  async handleGetUserInfo(e){
      try {
      
        // 1 获取用户信息
        const { encryptedData, rawData, iv, signature } = e.detail;
        // 2 获取小程序登录成功后的code
        const { code } = await login();
        const loginParams={ encryptedData, rawData, iv, signature ,code};
        console.log(loginParams)
        //  3 发送请求 获取用户的token
        const {token}=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin",data:loginParams,method:"POST"});
        // 4 把token存入缓存中 同时跳转回上一个页面
        wx.setStorageSync("token", token);
        console.log(token)
        wx.navigateBack({
          delta: 1
        });
      
        } catch (error) {
          console.log(error);
        }
    
  }
})