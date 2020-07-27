//import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index'

// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false
  },
  goodsInfo:{},
/**
   * 生命周期函数--监听页面加载
   */
  /* onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetails(goods_id);


  }, */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 获取页面栈
    var pages =  getCurrentPages()
    console.log(pages);
    // 获取当前页面
    let curPage = pages[pages.length-1]
    let options = curPage.options
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
    
  },
   // 获取商品详情数据
   getGoodsDetail(goods_id) {
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/detail',data:{goods_id}})
    .then(result => {
      const goodsObj = result.data.message
      this.goodsInfo = goodsObj
      let collet = wx.getStorageSync('collect')||[];
      let isCollect = collet.some(v=>v.goods_id === this.goodsInfo.goods_id)
      this.setData({
        goodsObj: {
          goods_name: goodsObj.goods_name,
          goods_price: goodsObj.goods_price,
          // iphone部分手机 不识别 webp图片格式 
          // 最好找到后台 让他进行修改 
          // 临时自己改 确保后台存在 1.webp => 1.jpg 
          goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
          pics: goodsObj.pics
        },
        isCollect:isCollect
    })
    
    })
  },
  // 点击图片，放大预览
  handlePreviewImage(e){
    // 1构造要预览的图片数组
    const urls =  this.goodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    console.log('bigger');
    
    wx.previewImage({
      current: current,
      urls: urls,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 点击 加入购物车
  handleCartAdd(){
    //1 获取缓存数据
    const cart = wx.getStorageSync('cart')||[];
    console.log('my cart',cart);
    
    // 2 判断商品是否存在于购物车
    let index = cart.findIndex(v=>v.goods_id === this.goodsInfo.goods_id)
    if(index === -1){
      // 不存在于购物车 ，添加进购物车
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    }else {
      // 存在于购物车， 数量加一
      cart[index].num++
    }
    // 将购物车重新存入缓存中
    wx.setStorageSync('cart', cart);
    // 弹出提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    });
  },
  // 点击 收藏事件
  handleCollect(){
    let isCollect=false;
    // 1获取缓存收藏组
    let collects = wx.getStorageSync('collect')||[];
    // 2判断当前商品是否被收藏
    let index = collects.findIndex(v=>v.goods_id===this.goodsInfo.goods_id)
    if(index === -1){
      //商品没有被找到,将该商品存入缓存中
      collects.push(this.goodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: false 
      });
    }else{
      // 商品收藏过，取消收藏
      //将商品从collect数组中剔除
      collects.splice(index,1)
      // 提示用户商品取消收藏成功
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: false
      });
    }
    // 把数组存入缓存中
    wx.setStorageSync('collect', collects);
    this.setData({
      isCollect:isCollect
    })
  }
})