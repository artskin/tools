//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    inputValue: '0.00',
    zengshou:'0.00',
    wageValue:'0.00',
    oldRatalVal:'0.00',
    newRatalVal:'0.00',
    deductionValue:5000
  },
  bindKeyInput(e) {
    let ratalVal = e.detail.value - this.data.deductionValue;
    this.setData({
      oldRatalVal: e.detail.value - 5000,
      inputValue: ratalVal,
      wageValue: e.detail.value
    })
  },
  deduction(e){
    if (e.detail.value.length>0){
      let deductionVal = this.data.deductionValue + parseInt(e.detail.value);
      let ratalVal = this.data.wageValue - deductionVal;
      console.log(this.data.deductionValue, e.detail.value, deductionVal)
      this.setData({
        //inputValue: ratalVal,
        newRatalVal: ratalVal,
        deductionValue: deductionVal
      })
    }
  },
  primary(e){
    let edu = this.data.newRatalVal;
    let rate = 0;
    let susuan = 0;
    if (edu < 3000){
      rate = 0.03;
      susuan = 0;
    } else if(edu < 12000){
      rate = 0.1;
      susuan = 210;
    } else if (edu < 25000){
      rate = 0.2;
      susuan = 1410;
    } else if(edu < 35000) {
      rate = 0.25;
      susuan = 2660;
    } else if (edu < 55000) {
      rate = 0.3;
      susuan = 4410;
    } else if (edu < 80000) {
      rate = 0.35;
      susuan = 7160;
    } else if (edu > 80000) {
      rate = 0.45;
      susuan = 15160;
    }
    let newIncomeVal = edu * rate - susuan;
    let oldIncomeVal = this.data.oldRatalVal * rate - susuan;
    console.log(edu, rate, susuan);
    console.log(this.data.oldRatalVal, rate, susuan)
    this.setData({
      zengshou: oldIncomeVal - newIncomeVal
    })

  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
