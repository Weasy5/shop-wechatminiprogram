import { request } from '../../request/index'
// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口需要的参数
  queryParsms:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPage:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParsms.cid = options.cid||''
    this.queryParsms.query = options.query||''
    
    
    this.getGoodsList()
  },
  // 获取列表数据
  getGoodsList() {
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/search',data:this.queryParsms})
    .then(result => {
      
      const total = result.data.message.total
      this.totalPage = Math.ceil(total/this.queryParsms.pagesize)
      
      // 对数组进行拼接，不是返回所有数组
      this.setData({
        goodsList:[...this.data.goodsList,...result.data.message.goods]
      })
    })
    // 关闭下拉刷新效果
    wx.stopPullDownRefresh();
  },
  handleTabsItemChange(e){
    console.log('父组件中的方法',e);
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
  },
  // 滚动栏触底事件
  onReachBottom() {
    console.log('触底了');
    if(this.queryParsms.pagenum>this.totalPage){
      console.log('not any page');
      wx.showToast({ title: '没有下一页数据' });
    }else {
      this.queryParsms.pagenum++
      this.getGoodsList()
      console.log('lodal new page');
      
    } 
  },
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.queryParsms.pagenum = 1
    this.getGoodsList()
  }
})