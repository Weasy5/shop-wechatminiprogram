// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "反馈投诉",
        isActive: false
      }
    ],
    //被选中的图片路径
    chooseImgs:[],
    //输入框内容
    textValue:''
  },
  //上传的图片路径
  uploadImgs:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  },
  // 点击添加图片事件
  handleChooseImg(){
    //1 使用微信小程序api
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        
        this.setData({
          // 图片数组 进行拼接 
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
        console.log(result);
        
        console.log(this.data.chooseImgs);
        
      }
    });
  },
  // 点击图标，删除图片
  handleRemoveImg(e){
    //获取点击图片的索引
    const {index} = e.currentTarget.dataset
    // 获取选择图片的数组
    let {chooseImgs} = this.data
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
    
  },
  // 输入框事件
  handleTextInput(e){
    this.setData({
      textValue:e.detail.value
    })
  },
  // 点击提交
  handleFormSubmit(){
    // 获取文本框的值
    const {textValue} = this.data
    //验证输入框的值
    if(!textValue.trim()){
      wx.showToast({
        title: '输入内容不合法',
        mask: true
      });
      this.setData({
        textValue:''
      })
      return
    }
    // 微信上传文件api不能多个文件同时上传
    const {chooseImgs} = this.data
    if(chooseImgs.length!==0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'https://pics.images.ac.cn/',
          filePath: v,
          name: 'file',
          formData: {},
          success: (result)=>{
            console.log(result);
            // 获取result.data，放入UploadImgs中
            /* const url = JSON.parse(result.data).url
            this.uploadImgs.push(url) */
          }
        });
        // 所有的图片都上传完毕了才触发  
        if (i === chooseImgs.length - 1) {

          wx.hideLoading();


          console.log("把文本的内容和外网的图片数组 提交到后台中");
          //  提交都成功了
          // 重置页面
          this.setData({
            textValue: "",
            chooseImgs: []
          })
          // 返回上一个页面
          wx.navigateBack({
            delta: 1
          });

        }
      })
    }else{
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }
  }
  
})