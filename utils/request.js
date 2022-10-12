import config from './config.js'
const that=this;
export default (url, data = {}, method = 'get') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      method,
      data,
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      success: ((res) => {
        resolve(res.data);
      }),
      fail: (err) => {
        reject(err);
      }
    })
  })
}

