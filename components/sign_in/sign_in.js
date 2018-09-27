let yangdate = require("sign_in_ss.js");

let { Tool, RequestFactory, Storage } = global

Component({
  properties: {
    isTrue: Boolean, // 是否显示日历
    isAcitivityStart: Boolean,// 活动是否开始
    isAuthorize: Boolean,
    visiable: Boolean,
    isAcitivityEnd: Boolean, // 活动是否结束
    isAcitivityPause: Boolean, // 活动是否暂停
  },
  data: {
    signtype: "1",
    signDays: [],
    todayDate: "1",
    todayMonth: "",
    todayYear: "",
    nextMonth: "",
    nextYear: "",
    prevYear: "",
    prevMonth: "",
    seriesCount: "99",
    series_gos: "15",
    powerData: "0",
    tips:false, // 是否显示联系签到的提示
    tipsContent:{title:"",content:""}, // 联系签到的提示
  },
  methods: {
    dateClicked(e) {
      let className = e.currentTarget.dataset.class
      let num = e.currentTarget.dataset.num
      let title = e.currentTarget.dataset.day
      if (num!==undefined) {
        this.closeSingBox()
        this.setData({
          tipsContent: { title: title, content: num }
        })
      }
    },
    closeSingBox(){
      this.setData({
        tips: !this.data.tips
      })
    },
    signListRequestHttp(month, preMonth) { // 请求签到列表
      let activityId = Storage.getActivityId() || ''
      let cookies = Storage.getUserCookie() || false
      if (!cookies || !activityId){
        this.calendar()
      }
      if (!cookies) return
      let timeData = '';
      if (!month) {
        let getToday = new Date();
        let todayDate = getToday.getDate();
        let todayMonths = getToday.getMonth();
        let todayMonth = (todayMonths + 1);
        let todayYear = getToday.getFullYear();
        if (todayMonth < 10) {
          timeData = todayYear + "-0" + todayMonth
        } else {
          timeData = todayYear + "-" + todayMonth
        }
      } else {
        timeData = month
      }
      // console.log(timeData)
      let data = {
        activityId: Storage.getActivityId() || '',
        yearsMonth: timeData
      };
      let r = RequestFactory.signListRequest(data);
      r.finishBlock = (req) => {
        let stringJson = req.responseObject.data;
        if (stringJson == [] || stringJson == '[]') {
          console.log('')
        } else {
          let data = req.responseObject.data
          let myDays = []
          data.forEach((item) => {
            let day = item.signTime
            day = day.split('-')
            let num = day[2][0] == 0 ? day[2][1] : day[2]
            myDays.push(parseInt(num))
            item.date = parseInt(num)
          })
          this.setData({
            myDays: myDays,
            weekdays: data
          })
          this.calendar(this.data.myDays, this.data.weekdays, preMonth)
          // console.log(this.data.weekdays)
        }

      };
      r.failBlock = (req) => {
        this.callBack(req)
      }
      r.addToQueue();
    },
    calendar(myDays = [], weekdays = [], preMonth) {
      var godates = ''
      var getToday = ''
      var todayDate = ''
      var todayMonth = ''
      var todayYear = ''
      var todayss = ''
      var showMonth = ''
      var showYear = ''
      var getToday = new Date();
      if (!preMonth) {
        todayYear = getToday.getFullYear()
        todayDate = getToday.getDate();
        var todayMonths = getToday.getMonth();
        todayMonth = (todayMonths + 1);
        showMonth = todayMonth
        todayYear = getToday.getFullYear();
        showYear = todayYear
        todayss = getToday.getDate();
        if (todayMonth < 10) {
          var todayMonthss = "0" + todayMonth;
        } else {
          var todayMonthss = todayMonth;
        }
        godates = todayYear + "-" + todayMonthss + "-01";
      } else {
        godates = preMonth
        let arr = godates.split('-')
        // console.log(arr)
        todayYear = getToday.getFullYear();
        showYear = parseInt(arr[0]) 
        showMonth = arr[1][0] == '0' ? parseInt(arr[1][1]) : parseInt(arr[1])
        todayMonth = getToday.getMonth() + 1;
        todayss = getToday.getDate();
      }

      // var godates = todayYear + "-" + todayMonthss + "-01";
      var that = this;
      var data = { seriesCount: 1, signDays: myDays };
      var $datas = data;
      var signDate_arr = new Array();
      var anns = $datas.signDays;
      var count_signday = $datas.seriesCount;

      if (count_signday > 9) {
        var series_gos = "0";
      } else if (count_signday < 0) {
        var series_gos = 99;
      } else {
        var series_gos = 10 - parseInt(count_signday);
      }
      that.setData({
        seriesCount: count_signday,
        series_gos: series_gos,
      });
      for (var p in anns) {//遍历json对象的每个key/value对,p为key
        var newdats = anns[p];
        signDate_arr.push(newdats);
      }
      // console.log(signDate_arr)
      if (showMonth == todayMonth) {
        if (signDate_arr.indexOf(todayss) > -1) {
          // console.log("当前已签到");
          that.setData({
            signtype: "2",
          });
        } else {
          // console.log("当前未签到");
          that.setData({
            signtype: "1",
          });
        }
      } else {
        that.setData({
          signtype: "2",
        });
      }

      let hadWinCount = []
      let maxSign = []
      for (let i = 0; i < weekdays.length; i++) {
        if (weekdays[i].hadWinCount == 1) {
          hadWinCount.push(weekdays[i].date)
          maxSign.push(weekdays[i].maxSign)
        }
      }
      // console.log(signDate_arr[0]);
      yangdate.yang_date.bulidCal(showYear, showMonth, that, signDate_arr, weekdays, hadWinCount, maxSign);
      //初始化加载日历

      this.setData({
        todayDate: todayDate,
        todayMonth: todayMonth,
        todayYear: todayYear,
        prevYear: todayYear,
        nextYear: todayYear,
        prevMonth: todayMonth,
        nextMonth: todayMonth,
        showYear: showYear,
        showMonth: showMonth,
      });

      // console.log(this.data.signDays)
    },
    sign_start: function () {
      this.signRequestHttp()
    },

    close_qdbox: function () {
      var seriesCount = this.data.seriesCount;
      // var seriesCount = seriesCount+1;
      if (seriesCount < 10) {
        var series_gos = 10 - seriesCount;
      } else {
        var series_gos = "0";
      }
      this.setData({
        seriesCount: seriesCount,
        series_gos: series_gos,
        for_signs: "none",
      });
    },
    sign_end: function () {
      wx.showToast({
        title: '今日已经签到',
        icon: 'loading',
        duration: 500
      });
    },
    sign_prev: function () {
      // console.log("上一月");
      var showMonth = this.data.showMonth;
      var todayMonth = this.data.todayMonth;
      if (showMonth == "1") {
        var showMonth = "12";
        var showYear = parseInt(this.data.showYear) - 1;
      } else {
        var showMonth = parseInt(this.data.showMonth) - 1;
        var showYear = this.data.showYear;
      }
      if (parseInt(todayMonth - 3) == showMonth) {
        wx.showToast({
          title: '不能查看更多了',
          icon: 'loading',
          duration: 500
        });
        return;
      }
      var that = this;
      if (showMonth < 10) {
        var showMonths = "0" + showMonth;
      } else {
        var showMonths = todayMonth;
      }
      var godates = showYear + "-" + showMonths;
      let preMonth = showYear + "-" + showMonths + "-01";
      // console.log(godates)
      this.signListRequestHttp(godates, preMonth)
    },
    sign_next: function () {
      // console.log("下一月");
      var showMonth = this.data.showMonth;
      var todayMonth = this.data.todayMonth;
      if (todayMonth == showMonth) {
        wx.showToast({
          title: '未签到不能查看',
          icon: 'loading',
          duration: 500
        });
        return;
      }
      if (showMonth == "12") {
        var showMonth = "1";
        var showYear = parseInt(this.data.showYear) + 1;
      } else {
        var showMonth = parseInt(this.data.showMonth) + 1;
        var showYear = this.data.showYear;
      }
      var that = this;
      if (showMonth < 10) {
        var showMonths = "0" + showMonth;
      } else {
        var showMonths = todayMonth;
      }
      var godates = showYear + "-" + showMonths;
      let preMonth = showYear + "-" + showMonths + "-01";
      this.signListRequestHttp(godates, preMonth)
    },
    signRequestHttp() { // 签到
      let data = {
        activityId: Storage.getActivityId() || ''
      };
      let getToday = new Date();
      let todayDate = getToday.getDate();
      let todayMonths = getToday.getMonth();
      let todayMonth = (todayMonths + 1);
      let todayYear = getToday.getFullYear();
      let todayss = getToday.getDate();
      let r = RequestFactory.signRequest(data);
      r.finishBlock = (req) => {
        // console.log(req.responseObject.code)
        if (req.responseObject.code === 200) {
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 1500
          });
          this.signListRequestHttp()
          this.triggerEvent('getIsNumberHttp') // 更新抽奖次数
          // this.signReady()
        } else {
          return null
        }
      };
      r.failBlock = (req) => {
        this.callBack(req)
      }
      r.addToQueue();
    },
    closeView: function () { // 关闭日历
      this.triggerEvent('closeView', false)
    },
    getPhoneNumber(e){
      this.triggerEvent('getPhoneNumber', e.detail)
    },
    agreeGetUser(e){
      this.triggerEvent('agreeGetUser', e.detail)
      if(e.target.dataset.index!=1){
        this.closeView()
      }
    },
    callBack(req){
      this.calendar()
      let callBack = () => {

      }
      if (req.responseObject.code == 210) {
        callBack = () => {
          let page = '/pages/login/login'
          this.closeView()
          Tool.navigateTo(page + '?isBack=' + true)
        }
      }
      if (req.responseObject.msg) {
        Tool.showAlert(req.responseObject.msg, callBack)
      };
    }
  },
  ready: function () {
    //this.signListRequestHttp()
  }
})