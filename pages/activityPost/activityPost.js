// pages/activityPost/activityPost.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic:[],
    picPath:"",
    title:"",
    time:"",
    location:"",
    detail:"",
    items: [
      { value: '姓名', isChecked: false, disabled: false },
      { value: '联系电话', isChecked: false, disabled: false },
      { value: '证件号码', isChecked: false, disabled: false },
      { value: '电台呼号', isChecked: false, disabled: false },
      { value: '电台类型', isChecked: false, disabled: false },
      { value: '台站地址', isChecked: false, disabled: false }    
    ],
    customInfo: [],
    infoTexts:[],
    aid:""
  },

  getName(event){
    this.setData({
      title:event.detail.value
    })
  },

  bindDateChange(event){
    this.setData({
      time:event.detail.value
    })
  },

  getLocal(event){
    this.setData({
      location: event.detail.value
    })
  },

  getDes(event){
    this.setData({
      detail: event.detail.value
    })
  },

  loadPic(){
    let _this = this
    wx.showActionSheet({
      itemList: ['拍照', '选择本地文件'],
      success (res) {
        if(res.tapIndex == 0){
          wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success(res) {
              _this.setData({
                pic: res.tempFilePaths,
              })
              let list = []
              for(let i = 0;i < _this.data.pic.length;i++){
                wx.cloud.uploadFile({
                  filePath: res.tempFilePaths[i],
                  cloudPath:"activity/"+_this.data.aid+".jpg",
                }).then(res=>{
                  list.push(res.fileID)
                  console.log(list)
                  _this.setData({
                    picPath:list[0]
                  })
                })
              }
            }
          })
        }
        if(res.tapIndex == 1){
          wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              _this.setData({
                pic: res.tempFilePaths,
              })
              let list = []
              for(let i = 0;i < _this.data.pic.length;i++){
                wx.cloud.uploadFile({
                  filePath: res.tempFilePaths[i],
                  cloudPath:"activity/"+_this.data.aid+".jpg",
                })
                .then(res=>{
                  list.push(res.fileID)
                  console.log(list)
                  _this.setData({
                    picPath:list[0]
                  })
                })
              }
            }
          })
        }
      }
    })
  },

  post(){
    if(this.data.title == ""){
      wx.showToast({
        title: '请填写活动名称',
        icon:'error'
      })
      return
    }
    if(this.data.time == ""){
      wx.showToast({
        title: '请选择活动时间',
        icon:'error'
      })
      return 
    }
    if(this.data.location == ""){
      wx.showToast({
        title: '请填写活动地点',
        icon:'error'
      })
      return 
    }
    let _this = this
    let info = []
    const infoMap = {
      '姓名': 'man',
      '联系电话': 'phone',
      '证件号码': 'certificate',
      '电台呼号': 'call',
      '电台类型': 'type',
      '台站地址': 'location'
    };
    let newItems = this.data.items
    for(let i = 0; i < newItems.length; i++) {
      if(newItems[i].isChecked) {
        info.push(infoMap[newItems[i].value])
      }
    }
    let locale = app.globalData.location
    console.log(this.data.infoTexts)
    db.collection('activities_'+locale).add({
      data:{
        aid:_this.data.aid,
        detail:_this.data.detail,
        location: _this.data.location,
        time: new Date(_this.data.time),
        pic: _this.data.picPath,
        title: _this.data.title,
        participants:[],
        chosen:info,
        otherInfo:_this.data.infoTexts  //自定义报名信息
      }
    }).then(res => {
      wx.switchTab({
        url: '/pages/activities/activities',
      })
    })

  },

  onChangeTap(event) {
    let newItems = this.data.items
    for(let i = 0; i < newItems.length; i++) {
      if(newItems[i].value == event.detail.key) {
        newItems[i].isChecked = event.detail.checked;
      }
    }
    this.setData({
      items: newItems
    })
  },

  addCustomInfo: function() {
    const id = this.data.customInfo.length;
    this.setData({
      customInfo: this.data.customInfo.concat({id: id}),
    });
  },

  removeCustomInfo: function(e) {
    const id = e.currentTarget.dataset.id;
    let data = this.data.infoTexts
    data.splice(id,1)
    this.setData({
      customInfo: this.data.customInfo.filter(customInfo => customInfo.id !== id),
      infoTexts:data
    });
  },

  addInfoText(e){
    if(e.detail.value != ""){
      let index = e.currentTarget.dataset.id
      let data = this.data.infoTexts
      if(data.length <= index){
        data.push(e.detail.value)
      }else{
        data[index] = e.detail.value
      }
      this.setData({
        infoTexts:data
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      aid:Date.now()+""
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})