// pages/login/login.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleLogin(event) {
    // let type = event.currentTarget.id; //通过id传值
    let type = event.currentTarget.dataset.type; //通过data-key=value形式
    //id具有唯一性 data-key形式可以指定多个
    this.setData({
      [type]: event.detail.value
    })
  },
  async login() {
    let {
      password,
      phone
    } = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneData = /^1[3-9]\d{9}$/;
    if (!phoneData.test(phone)) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    let result = await request('/login/cellphone', {
      phone,
      password
    })
    if (result.code === 200) {
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
      wx.showToast({
        title: '登录成功'
      });
      wx.reLaunch({
        url: '/pages/personal/personal',
      });
    } else if (result.code === 400) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none'
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})