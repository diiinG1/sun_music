import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    selId: '',
    videoList: [], //获取video下的vid
    videoAllData: [], //通过vid来获取视频
    videoId: '', //通过设置来判断显示图片还是视频
    timeUpdate:[], //更新视频播放时长  
    isFresh:false, //显示刷新下拉键
    offsetNum:1, //分页
    isDirection:''
  },
  //处理视频播放
  handlePlay(event) {
    let vid = event.currentTarget.id;
    //将数字型转为字符型
    this.setData({
      videoId: vid 
    })
    //关闭上一个播放视频
    //this.vid !== vid && this.videoContext && this.videoContext.stop();
    //判断是否关闭的是同一个视频
    //this.vid = vid;
    //创建控控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    let { timeUpdate } = this.data;
    let timeItem=timeUpdate.find(item => item.vid == vid)
    if(timeItem){
      this.videoContext.seek(timeItem.currentTime)
    }
   
  },
  //监听视频播放进度
  handleTimeUpdate(event) {
    let { timeUpdate } = this.data;
    let timeUpdateData = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    };
    let isTime = timeUpdate.find(item => item.vid == timeUpdateData.vid)
    if (isTime){
      isTime.currentTime = event.detail.currentTime
    }else{
      timeUpdate.push(timeUpdateData);
    }
    this.setData({
      timeUpdate
    })
  },
  //检测视频是否播放完毕
  handleVideoEnd(event){
    let { timeUpdate } = this.data;
    timeUpdate.splice(timeUpdate.findIndex(item=>item.vid==event.currentTarget.id),1)
    this.setData({
      timeUpdate
    })
  },
  //处理下拉视频刷新
  bindRefresh(){
    let {selId,offsetNum}=this.data
    this.setData({
      isFresh: true
    })
    //重新发请求获取新的视频数据
    let nData = { selId, offset: offsetNum }
    this.getVideoList(nData);
  },
  //视频滚动到最底部触发回调
  bindToLower(){
    let { selId, offsetNum } = this.data
    this.setData({
      offsetNum:offsetNum+1
    })
    let nData = { selId, offset: offsetNum }
    this.getVideoList(nData);
    this.setData({
      isDirection:0
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getVideoGroupList();
  },
  //获取视频导航标签列表
  async getVideoGroupList() {
    let result = await request('/video/group/list');
    this.setData({
      videoGroupList: result.data.slice(0, 14),
      selId: result.data[0].id
    })
    let { selId, offsetNum } = this.data

    //当以上数据存入以后再去请求接口 因为存在异步方式 所以卸载onload方法下获取不到id值
    let nData = { selId, offset: offsetNum }
    this.getVideoList(nData);
  },
  changeId(event) {
    let { selId, offsetNum } = this.data
    // 如果使用的是event.currentTarget.id则需要String类型转换int
    let id = event.currentTarget.dataset.id;
    this.setData({
      selId: id,
      videoList: []
    })
    //消息提示框
    wx.showLoading({
      title: "正在加载中",
    });
    let nData = { selId, offset: offsetNum }
    console.log(nData)
    this.getVideoList(nData);
  },
  //获取视频列表
  async getVideoList(data) {
    let result = await request('/video/group', {
      id: data.selId,
      offset: data.offset
    });
    //关闭消息提示框
    wx.hideLoading();
    let index = 0;
    result.datas.map(item => {
      item.id = index++;
    })
    this.setData({
      videoList: result.datas,
      isFresh: false  //关闭下拉刷新
    })
    this.getVideo(this.data.videoList);
  },
  async getVideo(list) {
    let vList = [];
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      let vid = list[i].data.vid;
      let result = await request('/video/url', {
        id: vid
      });
      result.id = index++;
      vList.push(result);
    }
    this.setData({
      videoAllData: vList
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
  onShareAppMessage: function({from}) {
    if(from==='button'){
      return{
        title:'来自button的转发',
        path:'/pages/video/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }else{
      return {
        title: '来自menu的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  }
})