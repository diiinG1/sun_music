import request from '../../utils/request';
import PubSub from 'pubsub-js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0 //获取歌曲上/下-首的下标
  },
  handleDetailSong(event) {
    let {
      id,
      index
    } = event.currentTarget.dataset;
    this.setData({
      index
    })

    wx.navigateTo({
      url: '/pages/detailMusic/detailMusic?musicId=' + id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let storageInfo = wx.getStorageSync('userInfo');
    if (!storageInfo) {
      wx.showToast({
        title: '请先登录账号',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      });
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    });
    this.getRecommendList();

    //订阅来自detailMusic页面发布的消息
    PubSub.subscribe('changeMusic', (msg, detail) => { //msg可以不使用但不能省略
      let { type, mode } = detail;
      let { recommendList, index} = this.data;
      if (mode === 'xunhuanbofang') {
        if (type === 'pre') {
          //判断如果歌曲为第一首情况
          (index === 0) && (index = recommendList.length)
          index -= 1;
        } else {
          //判断如果歌曲为最后一首情况
          (index === recommendList.length) && (index = -1)
          index += 1;
        }
      } else if (mode === 'iconsMusicyemianbofangmoshiShuffle') {
        // 生成随机数组下标
        let randomIndex = Math.floor(Math.random() * recommendList.length + 1);
        while (randomIndex === index) {
          randomIndex = Math.floor(Math.random() * recommendList.length + 1);
        }
        index = randomIndex;
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id;
      PubSub.publish('musicId', musicId);
    })
  },

  //   PubSub.subscribe('switchMode', (msg, mode) => {
  //     // 随机播放
  //     if (mode === 'iconsMusicyemianbofangmoshiShuffle') {

  //     } else if (mode === 'xunhuanbofang') { //循环播放

  //     } else { //单曲循环

  //     }
  //   })
  // },
  async getRecommendList() {
    let result = await request('/recommend/songs');
    this.setData({
      recommendList: result.data.dailySongs
    });
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