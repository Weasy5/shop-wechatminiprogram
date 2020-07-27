// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    collectNums:0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中拿个人信息缓存
    const userInfo = wx.getStorageSync('userInfo');
    // 从缓存中获取收藏数组
    const collect = wx.getStorageSync('collect');
    console.log(userInfo);
    // 将缓存，存入data中
    this.setData({
      userInfo:userInfo,
      collectNums:collect.length
    })
    
  }

  
})