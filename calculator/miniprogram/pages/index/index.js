//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    taxRate:[
      {
        "rate":"0.03",
        "deduction":"0"
      },
      {
        "rate": "0.10",
        "deduction": "210"
      },
      {
        "rate": "0.20",
        "deduction": "1410"
      },
      {
        "rate": "0.25",
        "deduction": "2660"
      },
      {
        "rate": "0.30",
        "deduction": "4410"
      },
      {
        "rate": "0.35",
        "deduction": "7160"
      },
      {
        "rate": "0.40",
        "deduction": "15160"
      }
    ],
    social:[
      {
        name:'上海',
        pension:"0.08",
        medical:"0.02",
        unemployment:"0.005",
        providentFund:"0.07"
      },
      {
        name: '北京',
        pension: "0.08",
        medical: "0.02",
        unemployment: "0.002",
        providentFund: "0.12"
      },
      {
        name: '深圳',
        pension: "0.08",
        medical: "0.02",
        unemployment: "0.01",
        providentFund: "0.05"
      }
    ],
    kcItems:{
      house:0,
      parents: 0,
      children: 0,
      myedu: 0,
      disease: 0,
    },
    city:{
      name:'上海'
    },
    cityId:0,
    kc_total:0,
    payDutyVal:0,
    addFundRate:[0.01,0.02,0.03,0.04,0.05,0.06],
    zengshou:0.00,
    wageValue:0.00,
    oldRatalVal:0.00,
    newRatalVal:0.00,
    taxBaseVal:5000,
    socialFundVal:'',
    oldWage:0.00,
    newWage:0.00,
    deductionValue:0.00,
    show:true,
    value:'选择',
    range: ["1%", "2%", "3%", "4%", "5%", "6%",]
  },
  selectCity(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['上海', '北京', '深圳'],
      success(res) {
        console.log(res.tapIndex)
        _this.setData({
          city:{
            name: _this.data.social[res.tapIndex].name
          },
          cityId: res.tapIndex
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  selectRate(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['1%', '2%', '3%', '4%', '5%', '6%'],
      success(res) {
        console.log(res.tapIndex, _this.data.addFundRate[res.tapIndex]);
        let supRate = _this.data.addFundRate[res.tapIndex];
        console.log(supRate)
        _this.setData({
          addFundRate: supRate* 100+"%"
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  select() {
    this.setData({
      show: true
    })
  },
  bindchange(e) {
    this.setData({
      value: e.detail.value,
      show: false
    })
  },
  cancel() {
    this.setData({
      show: false
    })
  },
  getSocialFund(socialBase3,i){
    let yanglao = socialBase3 * this.data.social[i].pension;
    let yiliao =  socialBase3 * this.data.social[i].medical;
    let shiye =   socialBase3 * this.data.social[i].unemployment;
    let providentFund = socialBase3 * this.data.social[i].providentFund;
    console.log("yanglao", yanglao, "yiliao", yiliao, "shiye", shiye, "gongjijin", providentFund, this.data.addFundRate[4])

    return yanglao + yiliao + shiye + providentFund;
  },
  getWage(e) {
    if (e.detail.value.length > 3){
      let wageVal = e.detail.value;
      let socialBase3;

      if (wageVal > 21396) {
        socialBase3 = 21396;
      } else {
        socialBase3 = wageVal;
      }
      let ratalVal = e.detail.value - this.data.taxBaseVal - this.getSocialFund(socialBase3, this.data.cityId);
      if (ratalVal <0){
        ratalVal = 0;
      }

      this.setData({
        oldRatalVal: ratalVal,
        newRatalVal: ratalVal,
        socialFundVal: this.getSocialFund(socialBase3, this.data.cityId),
        wageValue: e.detail.value
      });
    }
  },
  deduction(e){

    if (e.detail.value.length>2){
      switch (e.target.id) {
        case "kc_house":
          this.data.kcItems.house = e.detail.value
          break;
        case "kc_parents":
          this.data.kcItems.parents = e.detail.value
          break;
        case "kc_children":
          this.data.kcItems.children = e.detail.value
          break;
        case "kc_myedu":
          this.data.kcItems.myedu = e.detail.value
          break;
        case "kc_disease":
          this.data.kcItems.disease = e.detail.value
          break;
        default:
          
      }

      let deductionVal = parseInt(this.data.kcItems.house) + 
      parseInt(this.data.kcItems.parents) + 
      parseInt(this.data.kcItems.children) + 
      parseInt(this.data.kcItems.myedu) + 
      parseInt(this.data.kcItems.disease);
      
      let ratalVal = this.data.oldRatalVal - deductionVal;
      console.log(deductionVal,e)

      this.setData({
        newRatalVal: ratalVal,
        kc_total: deductionVal
        // kcItems: {
        //   house: house_val,
        //   parents: parents_val,
        //   children: children_val,
        //   myedu: myedu_val,
        //   disease: disease_val,
        // }
      })
    }
  },
  primary(e){
    var _this = this;
    setTimeout(function(){
      let edu = _this.data.newRatalVal;
      let i = 0;
      if (edu < 3000) {
      } else if (edu < 12000) {
        i = 1;
      } else if (edu < 25000) {
        i = 2;
      } else if (edu < 35000) {
        i = 3;
      } else if (edu < 55000) {
        i = 4;
      } else if (edu < 80000) {
        i = 5;
      } else if (edu > 80000) {
        i = 6;
      }
      let theRate = parseFloat(_this.data.taxRate[i].rate);
      let theDeduction = parseFloat(_this.data.taxRate[i].deduction);

      let newIncomeVal = _this.data.wageValue - (edu * theRate - theDeduction) - _this.data.socialFundVal;
      let oldIncomeVal = _this.data.wageValue - (_this.data.oldRatalVal * theRate - theDeduction) - _this.data.socialFundVal;

      console.log(newIncomeVal,oldIncomeVal, _this.data.socialFundVal, edu * theRate - theDeduction)
      _this.setData({
        zengshou: (newIncomeVal- oldIncomeVal).toFixed(2),
        payDutyVal: newIncomeVal
      })

    },100)
    
  },

  onLoad: function() {
    wx.showShareMenu();
    let self = this;
    this.setData({
      addFundRate: this.data.addFundRate[4] * 100 + "%"
    })
    self.saveinfo = new Proxy({}, {
      set: function (target, key, value, receiver) {
        // 给saveinfo中属性赋值前，可以令程序执行其他功能
        self.moreinfo.item[key].value = value
        return Reflect.set(target, key, value, receiver)
      }
    });

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
