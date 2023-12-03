// pages/userInfoUpdate/userInfoUpdate.js
const db = wx.cloud.database()
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:"",
    pic:[],
    picPath:"",
    man:"", //设台人员
    cert:"", //证件号码
    call:"", //电台呼号
    type:"", //电台类型
    location:"", //电台地址
    due:Date(), //到期时间
  },

  getman(event){
    this.setData({
      man: event.detail.value
    })
  },

  getcert(event){
    this.setData({
      cert: event.detail.value
    })
  },

  getcall(event){
    this.setData({
      call: event.detail.value
    })
  },

  gettype(event){
    this.setData({
      type: event.detail.value
    })
  },

  getloca(event){
    this.setData({
      location: event.detail.value
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
                  cloudPath:"license/"+Date.now()+".jpg",
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
                  cloudPath:"license/"+Date.now()+".jpg",
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

  update(){
    let uname = this.data.uname
    if(this.data.pic.length == 0){
      wx.showToast({
        title: '请上传电台执照',
        icon:"error"
      })
      return
    }
    if(this.data.man == ""){
      wx.showToast({
        title: '请填写设台人员',
        icon:"error"
      })
      return
    }
    if(this.data.cert == ""){
      wx.showToast({
        title: '请填写证件号码',
        icon:"error"
      })
      return
    }
    if(this.data.call == ""){
      wx.showToast({
        title: '请填写电台呼号',
        icon:"error"
      })
      return
    }
    if(this.data.type == ""){
      wx.showToast({
        title: '请填写电台类型',
        icon:"error"
      })
      return
    }
    if(this.data.location == ""){
      wx.showToast({
        title: '请填写台站地址',
        icon:"error"
      })
      return
    }
    if(this.data.due == null){
      wx.showToast({
        title: '请选择到期时间',
        icon:"error"
      })
      return
    }
    db.collection('members').where({
      uname: uname
    }).update({
      data:({
        due: this.data.due,
        location: this.data.location,
        call: this.data.call,
        license: this.data.picPath,
        type: this.data.type,
        man: this.data.man,
        certificate: this.data.cert
      })
    })
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let uname = app.globalData.uname
    this.setData({
      uname: uname
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