/**
 * Created by weiwei on 11/6/18.
 */
'use strict';

let bmap = require('../libs/baidu-map/bmap-wx.min');

//工具类


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Tool {

    constructor() {
        if (__instance()) return __instance();

        //init
        this.requestCount = 0;//判断加载动画是否需要隐藏

        __instance(this);
    }

    static sharedInstance() {
        return new Tool();
    }

    static formatTime(timestamp) {
        let date=new Date(timestamp);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        return [year, month, day].map(Tool.formatNumber).join('-') + ' ' + [hour, minute, second].map(Tool.formatNumber).join(':');
    }

    static formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }

    static timeStringFromInterval(interval, format) {
        let date = new Date(interval * 1000);
        return this.timeStringForDate(date, format);
    }

    static stringToDate(_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
    }

    static timeIntervalFromString(string) {
        let date = Tool.dateFromString(string);
        let timeInterval = parseInt(date.getTime() / 1000);
        return timeInterval;
    }

    static timeIntervalFromNow(interval = 0) {
        return this.timeIntervalFromDate(new Date(), interval);
    }

    static timeIntervalFromDate(date, interval) {
        return parseInt(date.getTime() / 1000) + interval;
    }

    static dateFromString(string) {
        let date = new Date(string.replace(/-/g, '/'));
        return date;
    }

    static timeStringForDate(date, formate) {
        let timeString = Date.format(date, formate);
        return timeString;
    }

    static timeDurationStringForInterval(interval) {
        let str = Tool.timeStringFromInterval(interval, "YYYY MM-DD HH:mm");
        return this.timeDurationStringForDateString(str);
    }

    static timeDurationStringForDateString(string) {
        if (Tool.isEmptyStr(string)) {
            return;
        }
        let duration = parseInt(new Date().getTime() / 1000) - Tool.timeIntervalFromString(string);
        let isNegtive = duration < 0;
        if (isNegtive) {
            duration = -duration;
        }
        let time = '';
        let count = 1;
        if (duration < 60 * 60) {
            count = parseInt(duration / 60.0);
            if (count == 0) {
                time = '刚刚';
            }
            else {
                time = count + "分钟" + (isNegtive ? '后' : '前');
            }
        }
        else if (duration < (24 * 60 * 60)) {
            count = parseInt(duration / 60 / 60);
            time = count + "小时" + (isNegtive ? '后' : '前');
        } else {
            time = Tool.timeStringForDateString(string, "MM-DD HH:mm");
        }

        return (time);
    }

    static dayCountFromInterval(interval) {
        let days = 0;
        let duration = interval - this.timeIntervalFromNow(0);
        let isNegtive = duration < 0;
        if (isNegtive) {
            duration = -duration;
        }

        days = parseInt(duration / (24 * 3600));

        return days + 1;
    }

    /**
     * 时间转为秒数 eg 8:30转为秒数
     * @param time
     * @returns {number}
     */
    static secondCountFromTime(time) {
        let arr = time.split(':');
        if (arr.length == 2) {
            let hour = arr[0]
            let min = arr[1];
            let timeInterval = hour * 60 * 60 + min * 60;
            return timeInterval;
        }
        return 0;
    }

    /**
     * 把秒数变成string
     * @param timeCount
     * @returns {string} 08:30
     */
    static timeStringForTimeCount(timeCount) {
        let hour = parseInt(timeCount / (60 * 60));
        let min = parseInt((timeCount - hour * 3600) / 60);
        let sec = parseInt(timeCount - hour * 3600 - min * 60);
        let hourString = hour + '';
        hourString = global.Tool.addZero(hourString, 2);
        let minString = min + '';
        minString = global.Tool.addZero(minString, 2);
        let secString = sec + '';
        secString = global.Tool.addZero(secString, 2);

        let openinghours = minString + ':' + secString;

        if (hourString != '00') {
            openinghours = hourString + ':' + minString + ':' + secString;
        }

        return openinghours;
    }

    // 日期倒计时 

    static getDistanceTime(time, self) {
      let endTime = new Date(Date.parse(time.replace(/-/g, "/")));/*replace将时间字符串中所有的'-'替换成'/',parse将时间格式的字符串转换成毫秒*/
      let nowTime = new Date();
      let distance = endTime.getTime() - nowTime.getTime();/*getTime把一个date对象转换成毫秒*/
      let day = 0;
      let hour = 0;
      let minute = 0;
      let second = 0;
      let distanceTime = ''
      if (distance >= 0) {
        day = Math.floor(distance / 1000 / 60 / 60 / 24);
        hour = Math.floor(distance / 1000 / 60 / 60 % 24);
        minute = Math.floor(distance / 1000 / 60 % 60);
        second = Math.floor(distance / 1000 % 60);
        distanceTime = day + "天" + hour + "时" + minute + "分" + second + "秒";
      } else {
        distanceTime = null
      }
      self.setData({
        distanceTime: distanceTime
      })
    }

    //Object 空值判断
    static isEmpty(object) {
        if (object === null || object === undefined) {
            return true;
        }
        for (let i in object) {
            return false;
        }
        return true;
    }

    static isValid(object) {
        return !Tool.isEmpty(object);
    }

    static isEmptyObject(obj) {
        if (Tool.isEmpty(obj)) {
            return true;
        }
        for (var name in obj) {
            return false;
        }
        return true;
    }

    static isValidObject(obj) {
        return !Tool.isEmptyObject(obj);
    }

    //String 空值判断
    static isEmptyStr(str) {
        if (Tool.isEmpty(str)) {
            return true;
        }
        else if (str instanceof String && str.length === 0) {
            return true;
        }
        return false;
    }

    static isValidStr(str) {
        return !Tool.isEmptyStr(str);
    }

    //Array 空值判断
    static isEmptyArr(arr) {
        if (Tool.isEmpty(arr)) {
            return true;
        }
        else if (arr instanceof Array && arr.length === 0) {
            return true;
        }
        return false;
    }

    static isValidArr(arr) {
        return !Tool.isEmptyArr(arr);
    }

    /**
     * 数组是否越界判断
     */
    static isArrValidForIndex(arr, index) {
        if (Tool.isValidArr(arr) && arr.length > index) {
            return true;
        }
        return false;
    }

    static isTrue(str) {
        if (Tool.isEmptyStr(str)) {
            return false;
        }
        return 'true' === str.toLowerCase();
    }

    static isFalse(str) {
        return !Tool.isTrue(str);
    }

    static isFunction(fun) {
        return typeof fun === 'function';
    }

    //弹窗提示
    static showAlert(msg, okCB = () => { }) {
        wx.showModal({
            title: '',
            content: msg,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    okCB();
                }
            }
        });
    }
    //弹窗自定义
    static showComfirm(msg, okCB = () => { }, errCB = () => { }) {
      wx.showModal({
        content: msg,
        showCancel: true,
        cancelText: '取消',
        confirmText: '确认',
        cancelColor:'#000',
        confirmColor:'#da2221',
        success: function (res) {
          if (res.confirm) {
            okCB();
          } else {
            errCB()
          }
        }
      });
    }
    static showSuccessToast(title, finish = null) {
        let duration = 1000;

        let success = () => {
            if (finish) {
                setTimeout(() => {
                    finish();
                }, duration);
            }
        }

        setTimeout(() => {
            wx.showToast({
                title: title,
                icon: 'success',
                duration: duration,
                success: success,
            })
        }, 400);
    }

    //显示加载动画 rCount 为请求的次数
    static showLoading(rCount = 1) {
        Tool.sharedInstance().requestCount = rCount;

        if (Tool.canIUse('showLoading')) {
            wx.showLoading({ title: '加载中...' });
        }
        else {
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 95000
            });
        }
    }

    //隐藏加载动画
    static hideLoading() {
        Tool.sharedInstance().requestCount--;
        if (Tool.sharedInstance().requestCount <= 0) {
            if (Tool.canIUse('hideLoading')) {
                wx.hideLoading();
            }
            else {
                wx.hideToast();
            }
        }
    }

    //返回上一个界面
    static navigationPop() {
        wx.navigateBack({
            delta: 1
        });
    }

    /**
     * 选择图片，并上传 
     * @param imgCount
     * @param successCallback
     */
    static uploadImage(imgCount, successCallback) {
      wx.chooseImage({
        count: imgCount, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          wx.uploadFile({
            url: global.RequestFactory.aliyunOSSUploadImage(),
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              let fileInfo = JSON.parse(res.data);
              successCallback(fileInfo)
            }
          })
        },
      })
    }

    static idFromDataKey(key) {
        let com = key.split('.');
        if (Tool.isValidArr(com)) {
            for (let i = 0; i < com.length; i++) {
                let userId = com[i];
                if (Tool.isValidStr(userId)) {
                    if (userId.length > 30 && userId.match("-") != null) {
                        return userId;
                    }
                }
            }
        }
    }

    /**
     * 从数组中移除一个对象
     * @param obj
     * @param arr
     * @returns {*}
     */
    static removeObjectFromArray(obj, arr) {
        var index = arr.indexOf(obj);
        // console.log('removeObjectFromArray index:' + index);

        if (index > -1) {
            arr.splice(index, 1);
        }

        return arr;
    }

    /**
     * str是否已needle开头
     *
     * @param str
     * @param needle
     * @returns {boolean}
     */
    static isStringStartsWith(str, needle) {
        return str.lastIndexOf(needle, 0) === 0
    }

    static addZero(str, length) {
        return new Array(length - str.length + 1).join("0") + str;
    }

    static redirectTo(url, success, fail, complete) {
        // console.log('\n\n******************************************************************************************');
        // console.log('redirectTo:' + url);
        wx.redirectTo({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        }
        )
    }

    static switchTab(url, success, fail, complete) {
        // console.log('\n\n******************************************************************************************');
        // console.log('switchTab:' + url);
        wx.switchTab({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        })
    }
   
    static navigateTo(url, success, fail, complete) {
        // console.log('\n\n******************************************************************************************');
        // console.log('navigateTo:' + url);
        wx.navigateTo({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        })
    }

    /**
     * 查看权限
     * @param scope
     * @param success
     * @param fail
     */
    static getScope(scope, success, fail, complete, notCompatible) {
        if (wx.canIUse('getSetting') && wx.canIUse('authorize')) {
            wx.getSetting({
                success(res) {
                    if (!res[scope]) {
                        wx.authorize({
                            scope: scope,
                            success() {
                                console.log(scope + ' success');
                                if (global.Tool.isFunction(success)) {
                                    success();
                                }
                            },
                            fail() {
                                console.log(scope + ' fail');
                                if (global.Tool.isFunction(fail)) {
                                    fail();
                                }
                            },
                            complete() {
                                console.log(scope + ' complete');
                                if (global.Tool.isFunction(complete)) {
                                    complete();
                                }
                            },
                        })
                    }
                },
                fail(res) {
                    console.log('authorize、getSetting 不兼容当前版本');
                    if (global.Tool.isFunction(notCompatible)) {
                        notCompatible();
                    }
                }
            })
        }
        else {
            console.log('authorize、getSetting 不兼容当前版本');
            if (global.Tool.isFunction(notCompatible)) {
                notCompatible();
            }
        }
    }

    static canIUse(method) {
        let canIUse = wx.canIUse(method);
        if (canIUse === false) {
            console.log('方法：' + method + '不兼容当前版本，无法使用');
        }
        return canIUse;
    }

    /**
     * 获取地理位置，自动处理授权提示
     * @param success
     * @param fail
     * @param complete
     */
    static getLocation(success = (res) => { }, fail = () => { }, complete = () => { }) {
        let resultHandler = (success, fail, complete) => {
            Tool.queryLocation((res) => {
                if (Tool.isValid(res)) {
                    success(res);
                }
                else {
                    fail();
                }
            }, () => {
                complete();
            });
        }

        //请求授权获取地理位置信息
        this.getScope('scope.userLocation',
            //成功
            () => {
                resultHandler(success, fail, complete);
            },
            //失败
            () => {
                fail();
            },
            //完成
            () => {
                complete();
            },
            //不兼容，直接请求地址
            () => {
                resultHandler(success, fail, complete);
            });
    }

    
    /**
     * 判断密码
     */
    static checkPwd(value) {
        console.log(value)
        var Regx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
        if (Regx.test(value)) {
          return true;
        }
        else {
          return false;
        }
    }
    // 判断手机号
    static checkPhone(value){
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (reg.test(value)){
        return true;
      } else{
        return false;
      }
    }

    // 判断人名
    static checkName(value) {
      // !(/^([a-zA-Z0-9\u4e00-\u9fa5\·]{2,16})$/.test(value))
      if (value.length > 1 && value.length<17) {
        return true
      } else {
        return false
      }
    }

    // 格式化服务器端返回的cookie

    static formatCookie(cookies) {
      let __cookies = [];
      (cookies.match(/([\w\-.]*)=([^\s]+);/g) ||[]).forEach((str) => {
        if (str.indexOf('Path=/') !== 0) {
          __cookies.push(str);
        } else if (str.indexOf('token2') != -1){
          let token2 = str.slice(7)
          __cookies.push(token2);
        } else if (str.indexOf('SESSION') != -1) {
          let SESSION = str.slice(7)
          __cookies.push(SESSION);
        } 
      });
      //  最后发送的
      let myCookie = __cookies.join('')
      global.Storage.setUserCookie(myCookie)
      return myCookie
    }

    // 倒计时是否可以点击

    static codeEnable(that,cb=()=>{}) {
      let tempEnable = that.data.getCodeBtEnable;
        if (!tempEnable) {
          return;
        }
        that.setData({
          getCodeBtEnable: !tempEnable,
          showSecond: that
        });
        this.countdown(that,this);
        cb()
      }

    // 倒计时

    static countdown(that,self) {
      // that 调用页面中的this slef 当前页面调用的this
      let second = that.data.second;
      clearTimeout(that.data.time);
      if (second == 0) {
        that.setData({
          second: '59',
          getCodeBtEnable: true,
          showSecond: false
        });
        return;
      }
      var time = setTimeout(function () {
        that.setData({
          second: second - 1,
          getCodeBtEnable: false,
          showSecond: true,
        });
        self.countdown(that,self);
      }, 1000)
      that.setData({
        time: time
      });
    }

    // 展示错误信息

    static showErrMsg(r) {
      r.failBlock = (req) => {
        // let page = this.getCurrentPageUrlWithArgs() //获取当前额页面
        let callBack = ()=>{

        }
        if (req.responseObject.code==210){
          callBack =()=>{
            let page ='/pages/login/login'           
            this.navigateTo(page+'?isBack='+true)
          }
        }
        if (req.responseObject.msg){
          this.showAlert(req.responseObject.msg, callBack)
        }
      }
    }

    // 是否登录

    static didLogin(that) {
      let didLogin = global.Storage.getUserCookie() ? true : false
      that.setData({
        didLogin: didLogin
      })
      return didLogin
    }

    // 登录以后的操作

    static loginOpt(req){
      // 获取 cookies
      let cookies = req.header['Set-Cookie'] || req.header['set-cookie'] || req.header['Set-cookie'] || req.header['set-Cookie'] 
      if (cookies) this.formatCookie(cookies)
      global.Storage.setUserAccountInfo(req.responseObject.data)
      global.Storage.setWxOpenid(req.responseObject.data.openId)
      if (req.responseObject.data.id){
        global.Storage.setAuthorize(true)
        global.Storage.setMemberId(req.responseObject.data.code)
        global.Event.emit('didLogin');
      }
    }
    
    // 获取当前的路径

    static getCurrentPageUrl() {
      let pages = getCurrentPages()    //获取加载的页面
      let currentPage = pages[pages.length - 1]    //获取当前页面的对象
      let url = currentPage.route    //当前页面url
      return url
    }

    //调用微信接口，获取定位信息
    static queryLocation(cb = (res) => { }, complete = () => { }) {
      wx.getLocation({
        // type:'gcj02',
        success: function (res) {
          let that = this;
          /* 获取定位地理位置 */
          // 新建bmap对象
          let BMap = new bmap.BMapWX({
            ak: global.TCGlobal.BaiduMapKey
          });
          let fail = function (data) {
            console.log(data);
          };
          let success = function (data) {
            //返回数据内，已经包含经纬度
            res.wxMarkerData = data.wxMarkerData;
            res.originalData = data.originalData;
            cb(res);
          }
          // 发起regeocoding检索请求
          BMap.regeocoding({
            fail: fail,
            success: success
          });
        },
        fail: function () {
          cb(null);
        },
        complete: function () {
          complete();
        }
      })
    }

    // 是否是iPhone 34rpx的底部像素差

    static isIPhoneX(that) {
      let isIPhoneX = global.Storage.sysInfo().isIphoneX
      // console.log(global.Storage.sysInfo())
      let className = isIPhoneX ? 'fixed-bottom-iPhoneX' :'fixed-bottom'
      let showBottom = isIPhoneX
      that.setData({
        isIPhoneX: { isIPhoneX, showBottom, className }
      })
      return { isIPhoneX,showBottom, className}
    }
}

