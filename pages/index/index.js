//index.js
//获取应用实例
let { Tool, RequestFactory, Storage, Event } = global
Page({
  data: {
    userInfo: {},// 用户个人信息保存
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isNumber: 0,
    last_update: 0,
    isTrue: false,
    last_x: 0,
    last_y: 0,
    last_z: 0,
    isShakeBox: false,
    isNotice: false,// 是否显示公告
    hasNotice: false,
    isShowNotice: false,
    isFixed: false,
    code: '',
    isWzj: false,
    iscardZJL: false,
    ishongbao: false,
    isMaterial: false,
    isShowModelTitle: '',
    isMaterialUrl: '',
    isMaterialName: '',
    iscardName: '',
    iscardUrl: '',
    ishongbaoUrl: '',
    ishongbaoName: '',
    animationData: {},
    winnerBlock: [],
    offsetTop: {},
    activeStartTime: '',
    activeEndTime: '',
    disabled: false,
    isPlusNumber: false, // 是否加+1 
    isReduceNumber: false, // 是否减1
    isNumberPlus: '', // 加1动画
    isNumberReduce: '',// 减1动画
    isDrawn: true,
    preHint: '', // 开始提示
    sufHint: '', // 结束提示
    actStauts: '',
    isDisplay: true,
    shakeStartMusicSrc: 'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/win.mp3', // 中奖
    shakeStopMusicSrc: 'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/nowin.mp3', // 未中奖
    skakeDefaultMusicSrc:'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/wave.mp3',// 默认音乐
    audioCtx: '', // 音乐
    SignActivtyId: false, // 活动是否开始了
    isAcitivityEnd: false, //活动是否结束
    isAcitivityPause: false, //活动是否暂停
    isAuthorize: false, // 是否注册登录过 没有注册过显示获取手机的按钮
    visiable: false, // 是否显示获取头像权限的按钮
    lastTime: 0,//上一次摇动时间
    lastSpeed: {
      lastTime: 0,
      lastX: 0, //赋值，为下一次计算做准备
      lastY: 0, //赋值，为下一次计算做准备
      lastZ: 0, //赋值，为下一次计算做准备
    },
    isAjax: true,
    showMyNum: false, //没有中奖次数提示框
    scaleani: {},
    isAnimiate: false,
    isShowTreeGift: false
  },
  onLoad: function () {
    this.setData({ // storage 中获取userId
      userId: Storage.memberId() || '',
      isAuthorize: Storage.didAuthorize() || '',
    });
    Tool.isIPhoneX(this); // 判断是否是iPhone X
    this.getActivtyId();
    this.getNoticeNumRequst() // 获取公告
    Event.on('didLogin', this.didLogin, this);
  },
  initDateSgin() { // 首次弹出公告以后 每日第一次进入弹出日历
    let notice = Storage.getIsShowNotice() || false
    let isSginDate = Storage.getTodaySign() || false
    let day = new Date().toLocaleDateString()
    let { SignActivtyId, isAcitivityPause, isAcitivityEnd } = this.data
    // 活动开始了 未暂停 未结束 已经首次显示过公告 当前日期与缓存日期不一致 弹出日历
    if (SignActivtyId && !isAcitivityPause && !isAcitivityEnd && notice && !(isSginDate == day)) {
      this.closeView()
    }
  },
  getActivtyId(callBack) { // 获取活动Id
    let r = global.RequestFactory.getActivityId();
    r.finishBlock = (req) => {
      if (req.responseObject.data == null || req.responseObject.data == 'null') {
        return false
      } else {
        Storage.setActivityId(req.responseObject.data.id)
        Storage.setActivityCode(req.responseObject.data.code)
        let activityDetail = {
          awardContent: req.responseObject.data.awardContent,
          introduce: req.responseObject.data.introduce
        }
        Storage.setActivityDetail(activityDetail)
        this.setData({
          activityId: req.responseObject.data.id,
          activeStartTime: req.responseObject.data.startTime,
          activeEndTime: req.responseObject.data.endTime,
          preHint: req.responseObject.data.preHint,
          sufHint: req.responseObject.data.sufHint,
          actStauts: req.responseObject.data.actStauts,
          shakeStartMusicSrc: req.responseObject.data.winMusic,
          shakeStopMusicSrc: req.responseObject.data.loseMusic,
        })
        let currentTime = new Date().getTime(); // 当前时间
        let getStartTime = req.responseObject.data.startTime //活动开始时间
        if (getStartTime > currentTime) { // 活动未开启
          this.setData({
            SignActivtyId: false,
            isDisplay: true,
            disabled: false
          })
        } else {
          let isAcitivityPause = false
          if (req.responseObject.data.actStauts == 3) { // 活动暂停
            isAcitivityPause = true
          }
          this.setData({
            isAcitivityPause: isAcitivityPause,
            SignActivtyId: true, // 活动开启
            isDisplay: false,
            disabled: true
          })
        }
        if (req.responseObject.data.endTime > currentTime) {
          this.setData({
            isAcitivityEnd: false,  // 活动未结束
            isDisplay: false,
            disabled: true
          })
        } else {
          this.setData({
            isAcitivityEnd: true, // 活动已结束
            isDisplay: true,
            disabled: false
          })
        }
        if (callBack !== undefined || Storage.memberId()) {
          this.selectComponent("#topBar").getUserId()
          this.getIsNumberHttp()
        }
        if (callBack !== undefined) {
          this.initDateSgin() //是弹出日期
        }
        //this.getIsNumberHttp() // 获取抽奖次数
        this.getWinnerRequest() // 获取中奖名单

        // this.selectComponent("#showNotice").noticeRequestHttp()
      }
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  catchTouchMove: function (res) { // swipei 滑动
    return false
  },
  ani() {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(4).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.scale(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
  },
  bindinputCode(e) { // 获取输入防伪码
    this.setData({
      code: e.detail.value
    })
  },
  bindFocus() {
    // 活动未开启input 无法输入
    let currentTime = new Date().getTime()
    let getStartTime = this.data.activeStartTime //活动开始时间
    if (this.data.SignActivtyId) { // 活动开启
      this.setData({
        disabled: false,
        isDisplay: false
      })
    } else if (this.data.isAcitivityEnd) { // 活动已结束   
      Tool.showAlert(this.data.sufHint)
    } else if (this.data.isAcitivityPause) {
      Tool.showAlert('活动已暂停')
      this.setData({
        disabled: false,
        isDisplay: true
      })
    } else if (!this.data.SignActivtyId) {
      this.setData({
        disabled: true
      })
      Tool.showAlert(this.data.preHint)
    }

  },
  bindBlur() {
    let currentTime = new Date().getTime()
    let getStartTime = this.data.activeStartTime //活动开始时间
    if (this.data.SignActivtyId) {
      this.setData({
        disabled: false,
        isDisplay: false
      })
    } else if (this.data.isAcitivityEnd) { // 活动已结束
      Tool.showAlert(this.data.sufHint)
    } else if (this.data.isAcitivityPause) {
      this.setData({
        disabled: false,
        isDisplay: true
      })
    } else if (!this.data.SignActivtyId) {
      this.setData({
        disabled: true
      })
      Tool.showAlert(this.data.preHint)
    }
  },
  SecurityCodeRequestHttp() { // 防伪码验证
    let code = this.data.code;
    this.setData({
      userId: Storage.memberId() || ''
    })
    let currentTime = this.data.activeEndTime
    let getStartTime = this.data.activeStartTime //活动开始时间
    if (!this.data.SignActivtyId) { // 未开启
      Tool.showAlert(this.data.preHint)
    } else if (this.data.isAcitivityEnd) {
      Tool.showAlert(this.data.sufHint)
    } else if (this.data.isAcitivityPause) {
      this.setData({
        disabled: false,
        isDisplay: true
      })
      Tool.showAlert('活动已暂停')
    } else {
      if (this.data.userId == '' || this.data.userId == null) {
        this.getIsLogin() // 
        return
      }
      if (this.data.code === '' || this.data.code === null) {
        wx.showModal({
          title: '',
          content: '请输入16位防伪码',
        })
      } else {
        let data = {
          activityId: Storage.getActivityId() || '',
          code: this.data.code
        };
        let r = RequestFactory.SecurityCodeRequest(data);
        r.finishBlock = (req) => {
          Tool.showSuccessToast('兑换成功')
          this.setData({
            isPlusNumber: true,
            disabled: true
          })
          this.ani()
          this.getIsNumberHttp()
        };
        Tool.showErrMsg(r);
        r.addToQueue();
      }
    }
  },
  getIsNumberHttp() { // 查询摇奖次数
    let data = {
      activityId: Storage.getActivityId() || ''
    };
    let that = this
    let r = RequestFactory.shakeNumberRequest(data);
    r.finishBlock = (req) => {
      let num = req.responseObject.data
      this.setData({
        isNumber: num,
        // isNumber: 99
      })
      setTimeout(() => {
        that.setData({
          isPlusNumber: false,
          isNumberPlus: '',
        })
      }, 1000)
      wx.startAccelerometer()
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  showResult(n, req,isName) { 
    this.data.isNumber = this.data.isNumber-1
    if (n == 1) {
      this.setData({
        isShowModelTitle: '恭喜你，中奖啦',
        isMaterial: true,
        iscardZJL: false,
        isWzj: false,
        ishongbao: false,
        isMaterialUrl: req.responseObject.data.imgUrl,
        isMaterialName: isName,
        isDrawn: true
      })
    } else if (n == 2) {
      this.setData({ 
        isShowModelTitle: '恭喜你，中奖啦',
        iscardZJL: true,
        ishongbao: false,
        isWzj: false,
        isMaterial: false,
        iscardUrl: req.responseObject.data.imgUrl,
        iscardName: isName,
        isDrawn: true
      })
    } else if (n == 3) {
      this.setData({
        isShowModelTitle: '恭喜你，中奖啦',
        ishongbao: true,
        isMaterial: false,
        iscardZJL: false,
        isWzj: false,
        ishongbaoUrl: req.responseObject.data.imgUrl,
        ishongbaoName: isName
      })
    } else {
      this.setData({
        isShowModelTitle: '很遗憾，未中奖',
        isWzj: true,
        iscardZJL: false,
        ishongbao: false,
        isMaterial: false,        
        isDrawn: false
      })
    }
    if(n>=3){
      this.setMusicSrc(this.data.shakeStartMusicSrc)
    }else{
      this.setMusicSrc(this.data.shakeStopMusicSrc)
    }
    this.setData({
      isShakeBox: true,
      isNumber: this.data.isNumber,
      isNumberReduce: 'isNumberReduce',
      isReduceNumber: true,
      isAnimiate: false
    })
    this.ani()
  },
  setMusicSrc(musicSrc){
    this.data.audioCtx = wx.createAudioContext('myAudioShake');
    this.data.audioCtx.setSrc(musicSrc);
    this.data.audioCtx.play();
  },
  onAccelerometerChange(acceleration) { // 监听摇一摇
    let that = this,x = 0, y = 0, z = 0
    let { lastX, lastY, lastZ, lastTime } = this.data.lastSpeed
    let shakeSpeed = 110; //设置阈值
    let nowTime = new Date().getTime(); //记录当前时间
    //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
    if (nowTime - lastTime > 100) {
      let diffTime = nowTime - lastTime; //记录时间段
      lastTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
      x = acceleration.x; //获取x轴数值，x轴为垂直于北轴，向东为正
      y = acceleration.y; //获取y轴数值，y轴向正北为正
      z = acceleration.z; //获取z轴数值，z轴垂直于地面，向上为正
      //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
      let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
      if (speed > shakeSpeed && this.data.isAjax) { // 如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
        
        wx.stopAccelerometer()
        
        let callBack = ()=>{
          console.log(111111)
          wx.startAccelerometer();
        }
        if (!this.data.SignActivtyId) { // 活动未开启
          Tool.showAlert(this.data.preHint, callBack)
          return
        }
        if (this.data.isAcitivityEnd) { // 活动已结束
          Tool.showAlert(this.data.sufHint, callBack)
          return
        }
        if (this.data.isAcitivityPause) {
          Tool.showAlert('活动已暂停', callBack)
          return
        }
        if (this.data.isNumber <= 0) {
          this.showMyNumClicked(callBack)
          return
        }
        // 一次cookie 都没有表示从未注册登录过
        let isLogin = Storage.getUserCookie() || false
        if (!isLogin) {
          Tool.showAlert('请先登录', callBack)
        
          return
        }
        this.setData({
          isAjax: false
        })
       
        wx.showLoading({
          title: '摇奖中...'
        })
        this.setMusicSrc(this.data.skakeDefaultMusicSrc)
        let data = {
          activityId: Storage.getActivityId() || ''
        };
        let r = RequestFactory.shakeStartRequest(data);
        r.finishBlock = (req) => {
          // let num = this.data.isNumber--
          let isName = ''
          let Dname = req.responseObject.data.dictionaryName == null ? '' : req.responseObject.data.dictionaryName
          isName = '"' + Dname + '"' + req.responseObject.data.awardName
          if (req.responseObject.data.pType == 1 || req.responseObject.data.pType == '1') { // 实物
            setTimeout(function () {
              that.showResult(1, req,isName)
            }, 2900)
          } else if (req.responseObject.data.pType == 2 || req.responseObject.data.pType == '2') { // 字卡
            setTimeout(function () {
              that.showResult(2, req, isName)
            }, 2400)
          } else if (req.responseObject.data.pType == 3 || req.responseObject.data.pType == '3') { // 红包
            setTimeout(function () {
              that.showResult(3, req, isName)
            }, 2400)
          }
          this.getWinnerRequest()  // 中奖一次以后更新中奖名单
        };
        r.failBlock = (req) => {
          if (this.data.isNumber == 0) return
          // let num = this.data.isNumber--
          if (req.responseObject.code === 600) {
            setTimeout(function () {
              that.showResult(4, req, '')
            }, 2400)
          } else {
            Tool.showAlert(req.responseObject.msg, callBack)
          }
        };
        r.completeBlock = (req) => {
          wx.hideLoading()
          wx.stopAccelerometer();
          this.setData({
            isAjax: true,
            isAnimiate: true
          })
        }
        r.addToQueue();//
      }
      that.setData({ //赋值，为下一次计算做准备
        lastSpeed: {
          lastTime: nowTime,
          lastX: x,
          lastY: y,
          lastZ: z,
        },
      })
    }
  },
  closeBindshakeBox() { // 摇一摇弹框
    let that = this
    this.setData({
      isShakeBox: false
    })
    that.data.audioCtx.pause()
    this.getIsNumberHttp();
    setTimeout(() => {
      that.setData({
        isReduceNumber: false
      })
    }, 1000)
  },
  closeView(e) { // 显示天天签到
    this.setData({
      isTrue: !this.data.isTrue,
      isFixed: !this.data.isFixed
    })
    if (this.data.isTrue) {
      this.selectComponent("#sign").signListRequestHttp()
    }
    Storage.setTodaySign(new Date().toLocaleDateString())
  },
  showNoticeClicked() { // 点击公告按钮
    // 用户第一次登录弹出公告
    Storage.setIsShowNotice(true)
    this.setData({
      isNotice: !this.data.isNotice,
      isFixed: !this.data.isFixed
    })
    if (this.data.isNotice) {
      this.selectComponent("#showNotice").noticeRequestHttp()
    }
  },
  showNotice(e) { // 显示公告
    this.showNoticeClicked()
    // 如果活动开始了 
    if (this.data.SignActivtyId) {
      this.getIsSign()
    }
  },
  getIsSign() { // 用户是否签到
    let userId = Storage.getUserAccountInfo() ? Storage.getUserAccountInfo().id : ''
    if (Storage.getUserAccountInfo()) {
      userId = Storage.getUserAccountInfo().id ? Storage.getUserAccountInfo().id : ''
    }
    let data = {
      activityId: Storage.getActivityId() || '',
      userId: userId,
    }
    let r = RequestFactory.signIsTrueRequest(data);
    r.finishBlock = (req) => {
      let userId = req.responseObject.data.userId
      let { isTrue, isFixed, isNotice, SignActivtyId, isAcitivityPause, isAcitivityEnd } = this.data
      if (userId > 0) {
        this.setData({
          isTrue: false,
          isFixed: false
        })
      } else {
        // 活动开始了 没有结束 没有暂停的情况下显示公告
        if (SignActivtyId && !isAcitivityPause && !isAcitivityEnd) {
          isTrue = true
        }
        this.setData({
          isTrue: isTrue,
          // isFixed: false,
          isNotice: false
        })
        if (isTrue) {
          this.selectComponent("#sign").signListRequestHttp()
        }
      }
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getWinnerRequest() { // 获取公告中奖名单
    let data = {
      activityId: Storage.getActivityId() || ''
    };
    let r = RequestFactory.winnerRequest(data);
    r.finishBlock = (req) => {
      if (Tool.isEmpty(req.responseObject.data)) {

      } else {
        let arrNumber = req.responseObject.data;
        let arrLength = arrNumber.length;
        let arr = [];
        let num;
        arrNumber.forEach((res, index, array) => {
          let t = Math.floor(index / 5);
          if (num !== t) {
            num = t;
            arr[t] = new Array();
          }
          let telIphone = ''
          if (res.telephone == null) {
          } else {
            let str = res.telephone
            let strL = str.length
            if (Tool.isEmpty(str)) {
              console.log('不完整')
            } else {
              if (strL < 11 || strL > 11) {
                console.log('手机号位数错误')
              } else {
                telIphone = str.substr(0, 3) + "****" + str.substr(7)
              }
            }

          }
          arr[t].push({
            index: index + 1,
            tphone: telIphone,
            prizeName: res.prizeName
          });
        })
        this.setData({
          winnerBlock: arr
        })
      }
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  getNoticeNumRequst() { // 请求公告
    let data = { page: 1 };
    let r = global.RequestFactory.noticeRequest(data);
    r.finishBlock = (req) => {
      let datas = req.responseObject.data;
      let { isNotice, hasNotice } = this.data.isNotice
      if (!datas) {
        return
      }
      let totals = datas.total;
      if (totals > 0) {
        isNotice = Storage.getIsShowNotice() === true ? false : true
        this.setData({
          isNotice: isNotice,
          hasNotice: !hasNotice
        });
        if (isNotice) {
          this.selectComponent("#showNotice").noticeRequestHttp()
        }
      }
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  goPage() { // 跳转detail
    if (this.getIsLogin()) {
      Tool.navigateTo('/pages/activity-detail/activity-detail')
    }
  },
  awardClicked() { // 跳转我的奖品
    // console.log(this.data.isNumber)
    this.setData({
      // isNumber: this.data.isNumber,
      isShakeBox: false
    })
    if (this.getIsLogin()) {
      Tool.navigateTo('/pages/my/my')
    }
  },
  shakeBoxAwardClicked(){
    this.closeBindshakeBox()
    this.awardClicked()
  },
  didLogin() { // 获取 token
    this.selectComponent("#topBar").getUserId()
    let callBack = () => { }
    if (this.data.activityId) {
      this.getIsNumberHttp()
      this.initDateSgin()
    } else {
      this.getActivtyId(callBack)
    }
    this.setData({
      isAuthorize: Storage.didAuthorize() || '',
    })
  },
  getIsLogin(isGoPage) { // 退出之后跳转登录
    let cookies = Storage.getUserCookie() || false
    if (!cookies) {
      if (isGoPage === undefined) {
        Tool.navigateTo('/pages/login/login')
      }
      return false
    }
    return true
  },
  getPhoneNumber(e) { // 获取手机
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        visiable: !this.data.visiable,
      })
    } else {
      console.log('用户拒绝了你的请求')
    }
  },
  agreeGetUser(e) { // 获取授权
    if (!this.data.canIUse) {
      this.getUserInfo()
    }
    this.setData({
      visiable: !this.data.visiable
    })
    if (e.detail.userInfo !== undefined) {
      this.getLogin(e.detail.userInfo)
    }
  },
  requetLogin() { // 登录
    let params = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      openId: Storage.getWxOpenid() || '',
      name: this.data.userInfo.nickName,
      headImgUrl: this.data.userInfo.avatarUrl,
      loginAddress: Storage.getLocation() || '',
      sex: this.data.userInfo.gender
    }

    let r = global.RequestFactory.appWechatLogin(params);
    r.finishBlock = (req) => {
      Tool.loginOpt(req)
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getUserInfo() { // 获取授权
    let that = this
    wx.getUserInfo({
      success: res => {
        this.getLogin(res.userInfo)
      },
      fail: function () {

      }
    })
  },
  getLogin(userInfo) { // 登录
    this.setData({
      userInfo: userInfo
    })
    Storage.setWxUserInfo(userInfo)
    this.requetLogin()
  },
  showMyNumClicked(callBack) {
    this.setData({
      showMyNum: !this.data.showMyNum
    })
  },
  showMyNumClosed(){
    this.showMyNumClicked()
    wx.startAccelerometer()
  },
  onShow: function () { // 进行摇一摇
    wx.startAccelerometer()
  },
  onHide: function () {
    wx.stopAccelerometer()
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
  onShareAppMessage: function (res) {
    let imgUrl = ''
    return {
      title: "天天朵宝",
      path: '/pages/start-page/start-page',
      imgUrl: imgUrl
    }
  },
})