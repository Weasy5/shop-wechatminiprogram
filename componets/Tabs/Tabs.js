// componets/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      // 获取点击的索引
      console.log('子组件的方法',e);
      const {index} = e.currentTarget.dataset
      // 触发 父组件中自定义的事件
      this.triggerEvent('tabsItemChange',{index})
      
    }
  }
})
