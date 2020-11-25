//index.js
//获取应用实例
const app = getApp()
import {request} from '../../utils/request';
import {loginUrl} from '../../constants/urls';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if( !app.globalData.token ){
      this.login();
    }
  },
  login(e){
    const requestLoginApi = (code) => {
      request({
        url: loginUrl,
        method:"POST",
        data:{code:code},
        success:(data)=>{
          if (data.token == undefined){
            if (data.openid != undefined){
              app.globalData.openid = data.openid;
            }
            wx.navigateTo({
              url: '../register/register'
            })
          }else{
            app.globalData.openid = data.openid;
            onUserLogin(data.token);
            wx.setStorageSync('token', data.token)
          }
        },
        fail:() => {
          wx.navigateTo({
            url: '../register/register'
          })
        }
      });
    }
    const onUserLogin = (token) => {
      getApp().globalData.token = token;
    }
    wx.checkSession({
      success: (res) => {
        let token = wx.getStorageSync('token');
        if (token) {
          console.log("token",token)
          onUserLogin(token)
        }else {
          wx.login({
            success(res0) {
              console.log(res0)
              if(res0.code){
                requestLoginApi(res0.code);
              }
            } 
          })
        }
      },
      fail : () => {
        wx.login({
          success(res0) {
            if(res0.code){
              requestLoginApi(res0.code);
            }
          } 
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
