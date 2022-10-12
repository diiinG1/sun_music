import request from '../../utils/request.js'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    covertransform: 'translateY(0)',
    covertransition: '',
    userInfo: '',
    recentPlayList: '' //最近播放
  },
  toLogin(){
    let storage=wx.getStorageSync('userInfo');
    if(!storage){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let result = wx.getStorageSync('userInfo');
    if (result) {
      this.setData({
        userInfo: JSON.parse(result)
      })
    };
    this.getrecentPlayList();
  },
  async getrecentPlayList() {
    let result = await request('/record/recent/song',{limit:10});
    this.setData({
      recentPlayList:result.data.list
    })
  },
  handletouchstart(event) {
    this.setData({
      covertransition: ''
    });
    startY = event.touches[0].clientY;
  },
  handletouchmove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      covertransform: `translateY(${moveDistance}rpx)`
    })
  },
  handletouchend() {
    this.setData({
      covertransform: 'translateY(0rpx)',
      covertransition: 'transform 1s linear'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})