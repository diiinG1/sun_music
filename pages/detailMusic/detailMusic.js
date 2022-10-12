import request from '../../utils/request';
import PubSub from 'pubsub-js';
import moment from 'moment'; //JavaScript处理时间库
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicInfo: {},
    musicId: '',
    musicUrl: '',
    currentTime: '00:00', //实时时长
    durationTime: '00:00', //总时长
    currentWidth: 0, //实时进度条的宽度
    lyricList: [], //获取实时歌词列表
    lyric: [], //获取歌词
    musicName: 'iconsMusicyemianbofangmoshiShuffle', //听歌模式名称
    index: 0, //听歌模式下标
  },

  //点击切换音乐模式
  handleMusicIcon() {
    let {
      index
    } = this.data;
    let musicArr = ['iconsMusicyemianbofangmoshiShuffle', 'xunhuanbofang', 'danquxunhuan'];
    let musicIndex = (index === 2 ? 0 : index + 1);
    this.setData({
      index: musicIndex,
      musicName: musicArr[musicIndex]
    });
  },
  //点击播放或暂停音乐
  handleMusicPlay() {
    let {
      isPlay,
      musicId,
      musicUrl
    } = this.data;
    let play = !isPlay;
    this.setData({
      isPlay
    })
    this.getMusicUrl(musicId, play, musicUrl);
  },
  //通过监听系统后台音乐来修改isPlay变量值
  handleIsPlay(isPlay) {
    this.setData({
      isPlay
    });
    //修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //点击切歌
  handleSwitch(event) {
    let data = {
      type: event.currentTarget.id,
      mode: this.data.musicName
    }
    PubSub.publish('changeMusic', data);

    PubSub.subscribe('musicId', (msg, musicId) => {
      //关闭当前音乐
      this.backgroundAudioManager.stop();
      //获取音乐详情
      this.getMusicInfo(musicId);
      //获取音乐播放地址
      this.getMusicUrl(musicId, true);
      // 获取实时歌词
      this.getLyricList(musicId);
      //取消订阅
      PubSub.unsubscribe('musicId');
    })
  },

  //  获取实时歌词
  handleLyricTime(currentTime) {
    let {
      lyricList
    } = this.data;
    let trueLyric = lyricList.find(item => item.indexOf(currentTime) !== -1);
    if (trueLyric) {
      let lyric = trueLyric.slice(10);
      if (lyric.indexOf(']') !== -1) {
        this.setData({
          lyric: lyric.slice(1)
        })
      } else {
        this.setData({
          lyric
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let musicId = options.musicId;
    this.getMusicInfo(musicId);
    this.getLyricList(musicId);
    //判断当前页面是否有音乐在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.gMusicId === musicId) {
      this.setData({
        isPlay: true
      })
    }
    //创建实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监听系统后台音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.handleIsPlay(true);
      appInstance.globalData.gMusicId = musicId;

    });
    this.backgroundAudioManager.onPause(() => {
      this.handleIsPlay(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.handleIsPlay(false);
    })

    //监听实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      //this.backgroundAudioManager.currentTime 实时时间
      //this.backgroundAudioManager.duration 总时间

      //将更新时间(s)转化为指定的格式

      //通过 实时时间/总时间=实时宽度/总宽度 进行控制
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      this.setData({
        currentTime,
        currentWidth
      })
      this.handleLyricTime(currentTime);
    });

    //监听实时播放的结束
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('changeMusic', 'next');
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    });
  },

  //获取音乐信息
  async getMusicInfo(id) {
    let result = await request('/song/detail', {
      ids: id
    });
    let durationTime = moment(result.songs[0].dt).format('mm:ss');
    this.setData({
      musicInfo: result.songs[0],
      musicId: id,
      durationTime
    });
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name,
    });
  },

  //获取音乐播放地址
  async getMusicUrl(id, play, urlLink) {
    let musicUrl = null;
    if (play) {
      if (!urlLink) {
        let result = await request('/song/url', {
          id
        });
        musicUrl = result.data[0].url;
        this.setData({
          musicUrl
        })
      } else {
        musicUrl = urlLink;
      }
      this.backgroundAudioManager.src = musicUrl;
      this.backgroundAudioManager.title = this.data.musicInfo.name;
    } else {
      this.backgroundAudioManager.pause();
    }
  },
  // 获取实时歌词
  async getLyricList(id) {
    let lyricListData = await request('/lyric', {
      id
    });
    this.setData({
      lyricList: lyricListData.lrc.lyric.split('\n')
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