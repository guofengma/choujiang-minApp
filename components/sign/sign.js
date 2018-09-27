// components/top-bar/top-bar.js
var signTime = require("signin.js");
let { Tool, RequestFactory, Storage } = global
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      isTrue:Boolean,
      isAuthorize: Boolean,
      visiable: Boolean,
      isAcitivityStart: Boolean,
      tipStart: String,
      startTime: Number,
      endTime: Number,
      tipStop: String
    },
    /**
     * 组件的初始数据
     */
    data: {
        signDay: [{ "signDay": "9" }, { "signDay": "11" }, { "signDay": "12" }, { "signDay": "15" }],
        signs: [1, 2, 3, 5, 6, 7],
        signtype: "1",
        signDays: [], // 存放 月
        todayDate: "1",
        todayMonth: "",
        todayYear: "",
        nextMonth: "",
        nextYear: "",
        prevYear: "",
        prevMonth: "",
        seriesCount: "99",
        series_gos: "15",
        for_signs: "none",
        powerData: "0",
        isSigncontinuity: 'none',
        hoverClass:'borderHover',
        borderBreak: 'borderBreak',
        isTrue:true,
        tip: false,
        tipOne: false,
        isNumber: '3',
        weekdays: [],
        isweekDays: [],
        oneWeekDays: [],
        signTitle: '连续签到7天',
        signNumber: '',
        isBreak:false,
        signTitleOne: '',
        signNumberOne: '',
        signIsArr: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad:function() {
        },
        sign_start: function() { // 签到
            this.signRequestHttp() // 调取签到接口
            //签到成功后重新调用后台接口加载新的签到数据
           setTimeout(()=>{
            //  console.log('签到之后获取签到列表')
             this.signListRequestHttp()
             this.getIsNumberHttp()
             this.signReady()
           },1000)
        },
        sign_end: function() { // 到底了
            wx.showToast({
                title: '今日已经签到',
                icon: 'loading',
                duration: 1500
            });
        },
        sign_prev: function() { // 上一页
            console.log("上一月");
            var showMonth = this.data.showMonth;
            var todayMonth = this.data.todayMonth;
            if (showMonth == "1") {
                var showMonth = "12";
                var showYear = parseInt(this.data.showYear) - 1;
                console.log(showYear)
            } else {
                var showMonth = parseInt(this.data.showMonth) - 1;
                var showYear = this.data.showYear;
            }
            if (parseInt(todayMonth - 3) == showMonth ) {
                wx.showToast({
                    title: '不能查看更多了',
                    icon: 'loading',
                    duration: 1500
                });
                return;
            }
            var that = this;
            if (showMonth < 10) {
                var showMonths = "0" + showMonth;
            } else {
                var showMonths = todayMonth;
            }
            var godates = showYear + "-" + showMonths + "-01";

            var $datas = { seriesCount: 1, signDays: [] };
            var anns = $datas.signDays;
            var signDate_arr = [];
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
                var newdats = anns[p];
                signDate_arr.push(newdats);
            }
            // console.log(signDate_arr[0]);
            signTime.dataTime.bulidCal(showYear, showMonth, that, signDate_arr);
            //初始化加载日历
            this.setData({
                showYear: showYear,
                showMonth: showMonth,
            });
        },
        sign_next: function() { // 下一页
            console.log("下一月");
          let getToday = new Date();
          let todayDate = getToday.getDate();
          let todayMonths = getToday.getMonth();
            let todayMonth1 = (todayMonths + 1);
            var showMonth = this.data.showMonth;
            var todayMonth = this.data.todayMonth;
            console.log(showMonth)
            console.log(todayMonth)
          if (todayMonth == showMonth ) {
                wx.showToast({
                    title: '未签到不能查看',
                    icon: 'loading',
                    duration: 1500
                });
                return;
          } else if (todayMonth > showMonth) {
              this.signReady()
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
            var godates = showYear + "-" + showMonths + "-01";

            var $datas = { seriesCount: 1, signDays: [] };
            var anns = $datas.signDays;
            var signDate_arr = [];
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
              var newdats = anns[p];
              signDate_arr.push(newdats);
            }
            // console.log(signDate_arr[0]);
            signTime.dataTime.bulidCal(showYear, showMonth, that, signDate_arr);
            //初始化加载日历
            this.setData({
                showYear: showYear,
                showMonth: showMonth,
            });

        },
        closeView: function() { // 关闭日历
          console.log(1)
          this.triggerEvent('closeView',false)
        },
        closeSingBox () { // 关闭连续签到
          this.setData({
            tip:!this.data.tip
          })
        },
        closeSingBoxOne() { // 首次签到
          this.setData({
            tipOne: !this.data.tipOne
          })
        },
        signListRequestHttp(){ // 请求签到列表
          let timeData = '';
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
          // console.log(timeData)
          let data = {
            activityId: Storage.getActivityId() || '',
            yearsMonth: timeData
          };
          console.log(data)
          let r = RequestFactory.signListRequest(data);
          r.finishBlock = (req) => {
            let stringJson = req.responseObject.data;
            console.log(stringJson)
            if (stringJson == [] || stringJson == '[]'){
                console.log('')
            }else {
              this.setData({
                weekdays: req.responseObject.data || []
              })
            }
             
          };
          Tool.showErrMsg(r);
          r.addToQueue();
        },
        signRequestHttp(){ // 签到
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
            console.log(req.responseObject.code)
            if (req.responseObject.code === 200) {
              wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 1500
              });
              
            } else {
              return null
            }
          };
          Tool.showErrMsg(r);
          r.addToQueue();
        },
        signReady () { // ready加载日历获取签到天数
          setTimeout( ()=>{
            var getToday = new Date();
            var todayDate = getToday.getDate();
            var todayMonths = getToday.getMonth();
            var todayMonth = (todayMonths + 1);
            var todayYear = getToday.getFullYear();
            var todayss = getToday.getDate();
            if (todayMonth < 10) {
              var todayMonthss = "0" + todayMonth;
            } else {
              var todayMonthss = todayMonth;
            }
            var godates = todayYear + "-" + todayMonthss + "-01";
            var that = this;
            var signDay = this.data.weekdays
            var data = { seriesCount: 1, signDays: [] };
            let yearDate = [];
            let result = [];
            for (let p in signDay) { // 获取签到列表的每一天
              let signJson = signDay[p].signTime
              let weekDays = 0;
              let t = parseInt(p)
              yearDate.push(signJson);
              if (todayss > 10 ) {
                weekDays = parseInt(signDay[p].signTime.substr(8, 2))
                data.signDays.push(weekDays)
              } else {
                weekDays = parseInt(signDay[p].signTime.substr(9, 1))
                data.signDays.push(weekDays)
              }
              if (signDay[0].hadWinCount !== 2) { // 获取列表中第一个天表示第一次签到
                this.setData({
                  oneWeekDays: parseInt(signDay[0].signTime.substr(8, 2))
                })
              }
              if (signDay[p].hadWinCount !== 2) { // 获取连续签到7天
                let arr = [];
                arr.push(weekDays)
                // console.log(arr)
                if(arr.indexOf(weekDays) > -1) {
                  this.setData({
                    isweekDays: arr
                  })
                }
              }
            }
            console.log(yearDate)
            // let signJsonNew = ''
            // let arrResult = []
            // if (signDay.length == 0) {
            //   return false 
            // } else if(signDay.length > 2){
            //     console.log('奏')
            //   if (signDay[0].signTime == undefined || signDay[0].signTime == 'undefined') {

            //   } else {
            //     console.log('算')
            //     signJsonNew = f(signDay[0].signTime, signDay[signDay.length - 1].signTime) // 获取2个日期直接天
            //   }
              
            //   for (var i = 0; i < signJsonNew.length; i++) {
            //     var obj = signJsonNew[i];
            //     var isExist = false;
            //     for (var j = 0; j < yearDate.length; j++) {
            //       var aj = yearDate[j];
            //       if (obj == aj) {
            //         isExist = true;
            //         break;
            //       }
            //     }
            //     if (!isExist) {
            //       result.push(obj);
            //     }
            //   }
            //   let resultWeekDays = 0
            //   for (let i in result) {
            //     if (todayss > 10) {
            //       resultWeekDays = parseInt(result[i].substr(8, 2))
            //     } else {
            //       resultWeekDays = parseInt(result[i].substr(9, 1))
            //     }
            //     arrResult.push(resultWeekDays)
            //   }
            //   // this.setData({
            //   //   signIsArr: arrResult
            //   // })
            // }
            // // console.log(arrResult)
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
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
              let newdats = anns[p];
              var t = parseInt(p);
              // console.log(this.data.oneWeekDays)
              if (anns[0] == this.data.oneWeekDays) {
                // console.log('第一次签到')
                this.setData({
                  signTitleOne: '首次签到',
                  signNumberOne: 1
                })
              }
              if ((anns[t + 1] - anns[p]) == 1 && anns.length == 7) {
                  // console.log('连续签到了7')
                  this.setData({
                    signTitle: '连续签到7天',
                    signNumber: 3
                  })
              } else if ((anns[t + 1] - anns[p]) == 1 && anns.length == 15){
                // console.log('连续签到了15天')
                  this.setData({
                    signTitle: '连续签到15天',
                    signNumber: 5
                  })
              } else if ((anns[t + 1] - anns[p]) == 1 && anns.length == 30){
                // console.log('连续签到了30天')
                  this.setData({
                    signTitle: '连续签到30天',
                    signNumber: 7
                  })
              } 
              signDate_arr.push(newdats);
            }
            let currentTime = this.data.activeEndTime
            let getStartTime = this.data.activeStartTime //活动开始时间
            // console.log(getStartTime > currentTime)
            if (getStartTime > currentTime) {
                that.setData({
                  signtype: "3",
                });
            } else {
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
            }
              // this.setData({
              //   signIsArr: arrResult
              // })
            // console.log(arrResult)
            signTime.dataTime.bulidCal(todayYear, todayMonth, that, signDate_arr);
            //初始化加载日历
            this.setData({
              todayDate: todayDate,
              todayMonth: todayMonth,
              todayYear: todayYear,
              prevYear: todayYear,
              nextYear: todayYear,
              prevMonth: todayMonth,
              nextMonth: todayMonth,
              showYear: todayYear,
              showMonth: todayMonth,
            });
          },600)
          // function f(start, end) {
          //   console.log('执行')
          //   var result = [];
          //   var beginDay = start.split("-");
          //   var endDay = end.split("-");
          //   var diffDay = new Date();
          //   var dateList = new Array;
          //   var i = 0;
          //   diffDay.setDate(beginDay[2]);
          //   diffDay.setMonth(beginDay[1] - 1);
          //   diffDay.setFullYear(beginDay[0]);
          //   result.push(start);
          //   while (i == 0) {
          //     var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
          //     diffDay.setTime(countDay);
          //     dateList[2] = diffDay.getDate();
          //     dateList[1] = diffDay.getMonth() + 1;
          //     dateList[0] = diffDay.getFullYear();
          //     if (String(dateList[1]).length == 1) { dateList[1] = "0" + dateList[1] };
          //     if (String(dateList[2]).length == 1) { dateList[2] = "0" + dateList[2] };
          //     result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
          //     if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
          //       i = 1;
          //     }
          //   };
          //   return result;
          // }
        },
        endStartSign (){
          let currentTime = new Date().getTime(); // 当前时间
          let getStartTime = this.data.startTime //活动开始时间
          if (currentTime < getStartTime) {
            console.log('活动结束')
            wx.showToast({
              title: this.data.tipStart,
            })
          } else {
            wx.showToast({
              title: this.data.tipStop,
            })
          }
        },
        getIsNumberHttp() { // 查询摇奖次数
          let data = {
            activityId: Storage.getActivityId() || ''
          };
          let that = this
          let r = RequestFactory.shakeNumberRequest(data);
          r.finishBlock = (req) => {
            // console.log(req.responseObject)
            let num = req.responseObject.data
            this.setData({
              isNumber: num,
            })
            setTimeout(() => {
              that.setData({
                isPlusNumber: false
              })
            }, 1500)
            wx.startAccelerometer();
          };
          Tool.showErrMsg(r);
          r.addToQueue();
        },
        myCatchTouch() {
          retrun;
        },
        signI(){
          var getToday = new Date();
          var todayDate = getToday.getDate();
          var todayMonths = getToday.getMonth();
          var todayMonth = (todayMonths + 1);
          var todayYear = getToday.getFullYear();
          var todayss = getToday.getDate();
          if (todayMonth < 10) {
            var todayMonthss = "0" + todayMonth;
          } else {
            var todayMonthss = todayMonth;
          }
          console.log(todayss);
          var godates = todayYear + "-" + todayMonthss + "-01";
          var that = this;
          var data = { seriesCount: 1, signDays: [] };
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
          for (var p in anns) { //遍历json对象的每个key/value对,p为key
            var newdats = anns[p];
            signDate_arr.push(newdats);
          }
          if (signDate_arr.indexOf(todayss) > -1) {
            console.log("当前已签到");
            that.setData({
              signtype: "2",
            });
          } else {
            console.log("当前未签到");
            that.setData({
              signtype: "1",
            });
          }
          console.log(signDate_arr[0]);
          signTime.dataTime.bulidCal(todayYear, todayMonth, that, signDate_arr);
          //初始化加载日历

          this.setData({
            todayDate: todayDate,
            todayMonth: todayMonth,
            todayYear: todayYear,
            prevYear: todayYear,
            nextYear: todayYear,
            prevMonth: todayMonth,
            nextMonth: todayMonth,
            showYear: todayYear,
            showMonth: todayMonth,
          });
        }
    },
    ready: function() {
      // this.signListRequestHttp() // 获取签到天数
      // setTimeout( ()=>{
      //   this.signReady() // 加载日历
      // },1000)
      var getToday = new Date();
      var todayDate = getToday.getDate();
      var todayMonths = getToday.getMonth();
      var todayMonth = (todayMonths + 1);
      var todayYear = getToday.getFullYear();
      var todayss = getToday.getDate();
      if (todayMonth < 10) {
        var todayMonthss = "0" + todayMonth;
      } else {
        var todayMonthss = todayMonth;
      }
      var godates = todayYear + "-" + todayMonthss + "-01";
      var that = this;
      var signDay = this.data.weekdays
      // console.log(signDay)
      var data = { seriesCount: 1, signDays: [] };
      let yearDate = [];
      let result = [];
      for (let p in signDay) { // 获取签到列表的每一天
        let signJson = signDay[p].signTime
        let weekDays = 0;
        let t = parseInt(p)
        yearDate.push(signJson);
        if (todayss > 10) {
          weekDays = parseInt(signDay[p].signTime.substr(8, 2))
          data.signDays.push(weekDays)
        } else {
          weekDays = parseInt(signDay[p].signTime.substr(9, 1))
          data.signDays.push(weekDays)
        }
        if (signDay[0].hadWinCount !== 2) { // 获取列表中第一个天表示第一次签到
          this.setData({
            oneWeekDays: parseInt(signDay[0].signTime.substr(8, 2))
          })
        }
        if (signDay[p].hadWinCount !== 2) { // 获取连续签到7天
          let arr = [];
          arr.push(weekDays)
          // console.log(arr)
          if (arr.indexOf(weekDays) > -1) {
            this.setData({
              isweekDays: arr
            })
          }
        }
      }
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
      for (var p in anns) { //遍历json对象的每个key/value对,p为key
        let newdats = anns[p];
        var t = parseInt(p);
        // console.log(this.data.oneWeekDays)
        if (anns[0] == this.data.oneWeekDays) {
          // console.log('第一次签到')
          this.setData({
            signTitleOne: '首次签到',
            signNumberOne: 1
          })
        }
        // console.log(this.data.signIsArr)
        if ((anns[t + 1] - anns[p]) == 1 && anns.length == 7) {
          // console.log('连续签到了7')
          this.setData({
            signTitle: '连续签到7天',
            signNumber: 3
          })
        } else if ((anns[t + 1] - anns[p]) == 1 && anns.length == 15) {
          // console.log('连续签到了15天')
          this.setData({
            signTitle: '连续签到15天',
            signNumber: 5
          })
        } else if ((anns[t + 1] - anns[p]) == 1 && anns.length == 30) {
          // console.log('连续签到了30天')
          this.setData({
            signTitle: '连续签到30天',
            signNumber: 7
          })
        }
        signDate_arr.push(newdats);
      }
      let currentTime = this.data.activeEndTime
      let getStartTime = this.data.activeStartTime //活动开始时间
      if (getStartTime > currentTime) {
        that.setData({
          signtype: "3",
        });
      } else {
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
      }
      signTime.dataTime.bulidCal(todayYear, todayMonth, that, signDate_arr);
      //初始化加载日历
      this.setData({
        todayDate: todayDate,
        todayMonth: todayMonth,
        todayYear: todayYear,
        prevYear: todayYear,
        nextYear: todayYear,
        prevMonth: todayMonth,
        nextMonth: todayMonth,
        showYear: todayYear,
        showMonth: todayMonth,
      });
    }
}) 