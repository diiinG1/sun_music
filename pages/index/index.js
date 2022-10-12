// pages/index/index.js
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图
    recommendList: [], //每日推荐
    topMusicList: [] //热歌排行榜
  },
  toRecommend() {
    wx.navigateTo({
      url: '/pages/recommendMusic/recommendMusic'
    })
  },
  toPlayList(event){
    let musicId=event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/playList/playList?musicId='+musicId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let bannerDataList = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerList: bannerDataList.banners
    });

    let recommendDataList = await request('/personalized', {
      limit: 10
    })
    this.setData({
      recommendList: recommendDataList.result
    })

    // 获取排行榜数据
    let allTopListData = await request('/toplist')
    let topList = allTopListData.list.slice(0, 4)
    let topListDetail = [];
    for (let item of topList) {
      let detailList = await request(`/playlist/detail?id=${item.id}`, { limit: 10 })
      topListDetail.push({ name: detailList.playlist.name, tracks: detailList.playlist.tracks.slice(0, 3) })
      this.setData({
        topMusicList: topListDetail
      })
    }
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