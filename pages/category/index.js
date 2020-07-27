import { request } from '../../request/index'
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧导航数据列表
    leftMenuList: [],
    // 右侧商品列表
    rightContentList: [],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 右侧内容滚动条距离顶部的距离
    scrollTop:0
    
  },
  cateList:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    1.判断本地缓存是否有数据
    2.如果没有旧数据，发送给新的数据请求
    3.如果有旧数据，判断数据是否过期，过期，重新拉取新数据
      没有过期，则使用本地缓存数据
    */
    /* 获取本地缓存数据 */
    const Cates = wx.getStorageSync('cates');
    /* 如果没有缓存 重新获取数据 */
    if(!Cates){
      this.getCateList()
      console.log('没有数据');
      
    }else {
      // 判断缓存数据是否过期
      if(Date.now() - Cates.time > 1000*10){
        this.getCateList()
        console.log('判断缓存');
        
      }else{
        // 可以使用旧数据
        this.cateList = Cates.data
        // 左侧大菜单数据
        let leftMenuList = this.cateList.map(v=>v.cat_name)
        // 右侧商品内容数据
        let rightContentList = this.cateList[0].children
        /*  this.cateList.forEach(element => {
          rightContentList.push(element.children)
        }); */
        this.setData({
          leftMenuList: leftMenuList,
          rightContentList:rightContentList
        })
        
      }
    }
    
  },
  // 获取分类数据
  getCateList() {
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/categories'})
    .then(result => {
      
      this.cateList = result.data.message
      // 把接口的数据存入到本地缓存中
      wx.setStorageSync('cates',{time:Date.now(),data:this.cateList})
      // 左侧大菜单数据
      let leftMenuList = this.cateList.map(v=>v.cat_name)
      // 右侧商品内容数据
      let rightContentList = this.cateList[0].children
     /*  this.cateList.forEach(element => {
        rightContentList.push(element.children)
      }); */
      this.setData({
        leftMenuList: leftMenuList,
        rightContentList:rightContentList
      })
      
      // console.log(rightMenuList)
    })
  },
  // 点击左侧菜单触发事件
  handleItemTap(e){
    const {index} = e.currentTarget.dataset
    let rightContentList = this.cateList[index].children
    this.setData({
      currentIndex:index,
      rightContentList:rightContentList,
      // 重新设置右侧内容距离顶部的距离
      scrollTop: 0
    })
  }
  
})