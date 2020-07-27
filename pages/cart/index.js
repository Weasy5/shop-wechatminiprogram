import { getSetting,openSetting, chooseAddress,showModal,showToast } from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    // 全选值
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow:function(){
    // 页面加载完毕，从本地缓存中获取收货地址
    const address = wx.getStorageSync('address');
     // 获取缓存中购物车数据
     const cart = wx.getStorageSync('cart')||[];
     this.setData({address})
      this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击收货地址按钮 调用微信收货地址api
  async handleChooseAddress(){
   try {
     //1 获取权限状态（通过scope.address查看确定好权限状态）
    const res1 = await getSetting()
    //result.authSetting["scope.address"]保证获取状态，防止一些怪异数据
    const scopeAddress = res1.authSetting["scope.address"] 
    if(scopeAddress === false){
      // 2用户之前拒绝过授予权限，提示用户开启权限
      await openSetting()
     
    }
    // 调用微信收货地址api
    let address= await chooseAddress()
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    console.log(address.all)
    // 3 将收货地址缓存到本地
    wx.setStorageSync('address', address);
      
   } catch (error) {
     console.log(error);
     
   } 
  },
  // 复选框选择事件
  handleItemChange(e){
    const goods_id = e.currentTarget.dataset.id
    console.log('click item',goods_id);
    
    let {cart} = this.data
    let index = cart.findIndex(v => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked;
    // 将数据重新存入cart中
    this.setCart(cart)
  },
  //全选复选框事件
  handleItemAllCheck(){
    //1获取data中的数据
    let {cart,allChecked} = this.data
    // 2修改数据
    allChecked = !allChecked
    cart.forEach(v=>{
      v.checked = allChecked
    })
    // this.setData({allChecked})
    this.setCart(cart)
    
  },
  // 商品数量编辑事件
  async handleItemNumEdit(e){
    //1获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset
    // 2获取购物车数组
    let {cart} = this.data
    //3找到id对应商品，修改数量
    let index = cart.findIndex(v=>v.goods_id === id)
    // 判断商品数量是否为1，且用户执行-1操作
    if(cart[index].num===1&&operation===-1){
      const res= await showModal({content:'是否要删除该商品'})
      if(res.confirm){
        cart.splice(index,1)
        this.setCart(cart)
      }

    }else{
      cart[index].num+=operation
      // 4放回缓存
      this.setCart(cart)
    } 
  },
  // 点击结算 支付事件
  async handlePay(){
    // 1判断用户是否选购商品，是否添加地址
    const {address,totalNum} = this.data
    if(!address.userName){
      await showToast({title:'请添加收货地址'})
      return
    }
    if(totalNum===0){
      await showToast({title:'请选购商品'})
      return
    }
     // 2 跳转到 支付页面
     wx.navigateTo({
      url: '/pages/pay/index'
    });
  },
  // 设置购物车状态（计算总价总数，全选状态）
  setCart(cart){
   
     // 计算全选值
    let allChecked =true
    console.log('cart all',cart)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price
        totalNum +=v.num
      }else{
        allChecked=false
      }
    });
    allChecked = cart.length!==0?allChecked:false
    this.setData({
      cart:cart,
      allChecked:allChecked,
      totalPrice:totalPrice,
      totalNum:totalNum
    })
    wx.setStorageSync('cart', cart);
  }
})