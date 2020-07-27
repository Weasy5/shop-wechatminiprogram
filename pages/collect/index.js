// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中获取收藏数据
    const collect = wx.getStorageSync('collect');
    this.setData({collect})
    console.log(collect);
    

  },
  handleTabsItemChange(e){
    // 获取子组件传过来的数据
    const {index} = e.detail
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => {
      i === index?v.isActive=true:v.isActive=false
    });
    // 保存到原数组中
    this.setData({
      tabs:tabs
    })
  }
})