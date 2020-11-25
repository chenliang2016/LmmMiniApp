// pages/register/register.js
const app = getApp()
import {request} from '../../utils/request';
import {registerUrl} from '../../constants/urls';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userName:"",
    phone:"",
    hasUserInfo: false,
    fileList:[],
  },

  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'http://localhost:7001/api/b/file/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      success: (res) => {
        // 上传完成需要更新 fileList
        console.log(res);
        if (res.statusCode == 200){
          const returnData =  JSON.parse(res.data);
          console.log(returnData)
          if (returnData.status == "success"){
            const { fileList = [] } = this.data;
          fileList.push({ ...file, url: `http://localhost:7001/public/${returnData.url}` });
          this.setData({ fileList });
          }else{

          }
        }
        
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  register: function() {
    console.log("注册")

    const { fileList = [],userInfo,userName,phone } = this.data;

    if (fileList.length > 0){
      const params = {
        faceImg:fileList[0].url,
        userName:userName,
        phone:phone,
        nickName:userInfo.nickName,
        openId:app.globalData.openid
      }
      request({
        url: registerUrl,
        method:"POST",
        data:params,
        success:(data)=>{
          console.log(data);
          app.globalData.token = data;
          wx.setStorageSync('token', data)
        },
        fail:(msg) => {
          
        }
      });
      console.log(params)
    }else{
      console.log("请上传图片")
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