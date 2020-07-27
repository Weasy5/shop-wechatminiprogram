
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    inputValue:'',
    isFocus:false
  },
  // 防抖
  //定义全局定时器
  TimeId:-1,
  //输入框事件
  handleInput(e){
    //1获取输入框的值
    const {value} = e.detail
    console.log(value)
    // 2判断合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
    }
    // 3发送请求，获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId= setTimeout(() => {
      this.qSearch(value)
    }, 1000);
  },
  // 发送请求，获取搜索数据
  async qSearch(query){
    const res = await request({url:'https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch',data:{query}})
    this.setData({
      goods:res.data.message
    })
  },
  //点击按钮重置输入框事件
  handleCancel(){
    console.log('clear')
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})