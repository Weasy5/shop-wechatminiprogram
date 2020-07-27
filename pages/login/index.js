// pages/login/index.js
Page({

  handleGetUserInfo(e){
    // 获取用户信息
    const {userInfo} = e.detail
    // 将用户信息放入缓存中
    wx.setStorageSync('userInfo', userInfo);
    // 返回上一页
    wx.navigateBack({
      delta: 1
    });
  }
})