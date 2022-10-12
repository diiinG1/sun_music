import request from '../../utils/request';
let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyword: '',   //搜索框placeholder的关键字
    hotList: [],  //热搜列表
    inputContent: '',  //搜索内容
    searchList: [],  //搜索列表数据
    historyList: [],  //历史记录列表
  },
  // 处理搜索框内容
  handleContent(event) {
    let inputContent = event.detail.value.trim();
    this.setData({
      inputContent
    });
    //函数节流发送请求
    if (isSend) return;
    isSend = true;
    setTimeout(() => {
      this.getSearchList();

      isSend = false;
    }, 1000)
  },
  // 清除搜索框关键字内容
  clearKeywordInfo(){
    this.setData({
      inputContent:'',
      searchList:[]
    })
  },
  // 清除所有历史记录
  deleteAllHistory(){
    // 模拟动态提示框
    wx.showModal({
      title: '删除历史记录',
      content: '您确定要删除吗？',
      success: (result) => {
        if(result.confirm){
          this.setData({
            historyList:[]
          });
          wx.removeStorageSync('searchHistory');
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchInfo();
    this.getHistoryList();
  },
  getHistoryList() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList
      })
    }

  },
  async getSearchInfo() {
    let result = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      showKeyword: result.data.showKeyword,
      hotList: hotListData.data
    })
  },
  // 获取搜索数据功能
  async getSearchList() {
    let { inputContent, historyList } = this.data;

    // 搜索关键字为空就不必再发请求且不必展示数据
    if (!inputContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    let searchListData = await request('/search', { keywords: inputContent, limit: 10 });
    console.log(searchListData);
    this.setData({
      searchList: searchListData.result.songs
    });

    if (historyList.indexOf(inputContent) !== -1) {
      historyList.splice(historyList.indexOf(inputContent), 1);
    }
    historyList.unshift(inputContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList);
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